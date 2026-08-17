import { useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";

/**
 * Custom hook to watch form changes and trigger debounced auto-save ONLY when values actually change.
 * Uses function refs to avoid infinite render loops.
 * @param {Object} params
 * @param {Object} params.control - react-hook-form control object
 * @param {Function} params.onSave - Async or sync callback to save form data
 * @param {number} [params.delay=700] - Debounce delay in milliseconds
 * @param {boolean} [params.enabled=true] - Whether auto-save is currently enabled
 * @param {Function} [params.onSavingStart] - Called when user starts typing / editing
 * @param {Function} [params.onSavingEnd] - Called when save completes (success: boolean)
 */
export const useAutoSave = ({
	control,
	onSave,
	delay = 700,
	enabled = true,
	onSavingStart,
	onSavingEnd,
}) => {
	const timerRef = useRef(null);
	const prevSnapshotRef = useRef(null);
	const isInitializedRef = useRef(false);

	// Keep callbacks in refs so they never cause useEffect to re-run
	const onSaveRef = useRef(onSave);
	const onSavingStartRef = useRef(onSavingStart);
	const onSavingEndRef = useRef(onSavingEnd);

	useEffect(() => {
		onSaveRef.current = onSave;
		onSavingStartRef.current = onSavingStart;
		onSavingEndRef.current = onSavingEnd;
	});

	const formValues = useWatch({ control });

	useEffect(() => {
		if (!enabled || !formValues) return;

		const currentSnapshot = JSON.stringify(formValues);

		// Record initial baseline on mount without triggering save
		if (!isInitializedRef.current) {
			prevSnapshotRef.current = currentSnapshot;
			isInitializedRef.current = true;
			return;
		}

		// If form values haven't actually changed from baseline, skip
		if (prevSnapshotRef.current === currentSnapshot) {
			return;
		}

		// Update baseline snapshot
		prevSnapshotRef.current = currentSnapshot;

		// Notify saving started
		if (onSavingStartRef.current) {
			onSavingStartRef.current();
		}

		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(async () => {
			try {
				if (onSaveRef.current) {
					await onSaveRef.current(formValues);
				}
				if (onSavingEndRef.current) {
					onSavingEndRef.current(true);
				}
			} catch (err) {
				console.error("Auto-save error:", err);
				if (onSavingEndRef.current) {
					onSavingEndRef.current(false, err);
				}
			}
		}, delay);

		return () => {
			clearTimeout(timerRef.current);
		};
	}, [formValues, delay, enabled]);
};

export default useAutoSave;
