import { useEffect, useRef } from "react";

export const useAutofocus = (showDetailType, detailType) => {
	const autoFocusRef = useRef();

	useEffect(() => {
		if (showDetailType === detailType) {
			autoFocusRef.current.focus();
		}
	}, [showDetailType]);

	return autoFocusRef;
};


