import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to position and viewport-clamp a floating toolbar beside active form section
 * @param {Object} params
 * @param {number} params.activeSection - Currently active section index
 * @param {React.MutableRefObject} params.sectionRefs - Map of section index to DOM element ref
 * @param {React.RefObject} params.mainRef - Outer scrolling container ref
 * @param {React.RefObject} params.formContainerRef - Form content wrapper ref
 * @param {number} params.fieldsLength - Total dynamic fields count
 * @param {number} [params.offsetRight=16] - Horizontal offset from right edge of form
 * @param {number} [params.minTop=120] - Top clamping bound (below header)
 * @param {number} [params.bottomOffset=260] - Bottom clamping bound
 */
export const useFloatingSidebar = ({
	activeSection,
	sectionRefs,
	mainRef,
	formContainerRef,
	fieldsLength,
	offsetRight = 16,
	minTop = 120,
	bottomOffset = 260,
}) => {
	const [sidebarStyle, setSidebarStyle] = useState({
		top: minTop,
		left: 0,
		isReady: false,
	});

	const updatePosition = useCallback(() => {
		const activeRef = sectionRefs.current[activeSection];
		const formContainer = formContainerRef.current;
		if (!activeRef || !formContainer) return;

		const formRect = formContainer.getBoundingClientRect();
		const activeRect = activeRef.getBoundingClientRect();

		// Position toolbar to the right of the form container
		const left = formRect.right + offsetRight;

		// Desired top aligns with the top of the active card
		const desiredTop = activeRect.top + 12;

		// Viewport clamping limits
		const maxTop = window.innerHeight - bottomOffset;
		const clampedTop = Math.max(minTop, Math.min(maxTop, desiredTop));

		setSidebarStyle({
			top: clampedTop,
			left,
			isReady: true,
		});
	}, [activeSection, sectionRefs, formContainerRef, offsetRight, minTop, bottomOffset]);

	useEffect(() => {
		updatePosition();

		const mainEl = mainRef.current;
		if (mainEl) {
			mainEl.addEventListener("scroll", updatePosition, {
				passive: true,
			});
		}
		window.addEventListener("resize", updatePosition);

		const timeoutId = setTimeout(updatePosition, 100);
		return () => {
			if (mainEl) {
				mainEl.removeEventListener("scroll", updatePosition);
			}
			window.removeEventListener("resize", updatePosition);
			clearTimeout(timeoutId);
		};
	}, [updatePosition, fieldsLength, mainRef]);

	return { sidebarStyle, updatePosition };
};

export default useFloatingSidebar;
