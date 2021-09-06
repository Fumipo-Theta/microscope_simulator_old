import React, { useCallback } from "react"
import { useSetRecoilState } from "recoil"
import styles from "./index.module.css"
import { isOpenNicolState } from "@src/js/state/atom/nicol_state"


const ToggleButton: React.FC = () => {
    const toggleIsOpenNicolValue = useSetRecoilState(isOpenNicolState)
    const onChange = useCallback((e) => {
        toggleIsOpenNicolValue((current) => !current)
    }, [toggleIsOpenNicolValue])
    return (
        <div className={styles.nicolToggler}>
            <input className={styles.toggleButtonInput} id={"nicol_toggle_button"} type={"checkbox"} defaultChecked={true} onChange={onChange} />
            <label className={styles.toggleButtonLabel} htmlFor={"nicol_toggle_button"} data-on-label={"Open"} data-off-label={"Cross"}></label>
        </div>
    )
}

export const NicolToggler: React.FC = () => {
    return (
        <ToggleButton />
    )
}
