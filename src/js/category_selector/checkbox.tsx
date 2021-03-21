import * as React from "react";

type Props = {
    label: String,
    path: Array<String>
}

const Checkbox: React.FC<Props> = ({ label, path }) => {
    const isLeaf = path.length == 0
    const id = 'category-group__' + concatCategory(path, '__')
    const className = concatCategory(path, ' ')
    const [isChecked, updateChecked] = React.useState(false)
    return (
        <>
            <input id={id} type="checkbox" onChange={_ => { updateChecked(!isChecked) }} />
            <label htmlFor={id}>{label}</label>
        </>
    )
}

function concatCategory(categoryList, sep) {
    return categoryList.reduce((acc, e) => {
        if (acc === "") return e
        return acc + sep + e
    }, "")
}

export default Checkbox