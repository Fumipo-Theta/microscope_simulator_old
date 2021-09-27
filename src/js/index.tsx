import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { App } from './component/app'
import deleteOldVersionDatabase from "./deleteOldVersionDatabase"

ReactDOM.render(
    <App />,
    document.getElementById("app")
)
