import React, { useEffect, useCallback } from "react"
import { useSetRecoilState } from "recoil"
import { windowInnerSizeState } from "@src/js/state/atom/window_inner_size_state"

export const Window: React.FC = ({ children }) => {
    const setWindowInnerSizeValue = useSetRecoilState(windowInnerSizeState)
    const handleResize = useCallback(() => {
        setWindowInnerSizeValue(() => {
            return {
                width: window.innerWidth,
                height: window.innerHeight,
            }
        })
    }, [setWindowInnerSizeValue])
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        window.addEventListener(
            "orientationchange",
            handleResize,
            false
        );
        // Call handler right away so state gets updated with initial window size
        handleResize();
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
        }
    }, [])
    return (<>{children}</>)
}