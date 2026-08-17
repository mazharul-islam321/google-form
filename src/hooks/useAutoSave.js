import { useEffect, useRef } from "react";

/**
 * Custom hook to watch form changes and trigger debounced auto-save
 * @param {Object} params
 * @param {Function} params.watch - react-hook-form watch function
 * @param {Function} params.onSave - Async or sync callback to save form data
 * @param {number} [params.delay=700] - Debounce delay in milliseconds
 * @param {boolean} [params.enabled=true] - Whether auto-save is currently enabled
 * @param {Function} [params.onSavingStart] - Called when user starts typing / editing
 * @param {Function} [params.onSavingEnd] - Called when save completes (success: boolean)
 */
export const useAutoSave = ({
	watch,
	onSave,
	delay = 700,
	enabled = true,
	onSavingStart,
	onSavingEnd,
}) => {
	const timerRef = useRef(null);
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (!enabled) return;

		const subscription = watch((formData) => {
			// Skip initial mount render
			if (isFirstRender.current) {
				isFirstRender.current = false;
				return;
			}

			if (onSavingStart) {
				onSavingStart();
			}

			clearTimeout(timerRef.current);
			timerRef.current = setTimeout(async () => {
				try {
					await onSave(formData);
					if (onSavingEnd) {
						onSavingEnd(true);
					}
				} catch (err) {
					console.error("Auto-save error:", err);
					if (onSavingEnd) {
						onSavingEnd(false, err);
					}
				}
			}, delay);
		});

		return () => {
			subscription.unsubscribe();
			clearTimeout(timerRef.current);
		};
	}, [watch, onSave, delay, enabled, onSavingStart, onSavingEnd]);
};

export default useAutoSave;
