const fs = require("fs-extra")

const updatePackageJson = (current, coreJson) => {
    const { new: _, ...scripts } = coreJson
    const appOnlyScripts = {
        "update:core": "node script/npm/update_core.js",
    }
    return {
        ...current,
        scripts: {
            ...current.scripts,
            ...coreJson.scripts,
            ...appOnlyScripts,
        },
        devDependencies: { ...current.devDependencies, ...coreJson.devDependencies },
        dependencies: { ...current.dependencies, ...coreJson.dependencies },
    }
}

const copyCoreScripts = (appDir, coreDir) => {
    fs.copySync(`${coreDir}/script`, `${appDir}/script`)
}

module.exports = { updatePackageJson, copyCoreScripts }
