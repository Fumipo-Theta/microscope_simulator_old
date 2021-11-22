import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { App } from './component/app'

import CustomComponents from "@vender/custom_components"
// import deleteOldVersionDatabase from "./deleteOldVersionDatabase"

ReactDOM.render(
    <App {...CustomComponents} />,
    document.getElementById("app")
)
