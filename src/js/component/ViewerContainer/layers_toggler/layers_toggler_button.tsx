import React, { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { LayersIcon } from "../../misc/icons/layers_icon";
import styles from "./index.module.css"
import { sampleLayersStatusState } from "@src/js/state/atom/sample_layers_status_state";
import { sampleLayersState } from "@src/js/state/atom/sample_layers_state";
import { useShowLayersFlag } from "@src/js/hooks/location_hooks";

export const LayersTogglerButton: React.FC = () => {
    const [buttonState, setButtonState] = useRecoilState(sampleLayersStatusState)
    const onClick = useCallback((_e) => {
        setButtonState(current => !current)
    }, [setButtonState])
    const layerIsDisabled = (!useShowLayersFlag()) || !useRecoilValue(sampleLayersState)
    return (<>
        {
            layerIsDisabled
                ? <></>
                : <button className={`${styles.button} ${buttonState ? styles.active : ""}`} onClick={onClick}>
                    <LayersIcon isActive={buttonState} />
                </button>
        }
    </>)
}
