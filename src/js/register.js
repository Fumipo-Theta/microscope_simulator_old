import registerZip from "./registerZip.js"

export default function register(state, isNewData) {
    if (isNewData) {
        return entry => new Promise((res, rej) => {
            registerZip(state)(entry)
                .then(res)
        })
    } else {
        return _ => new Promise((res, rej) => {
            res(state)
        })
    }
}
