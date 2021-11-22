const fs = require("fs-extra")

const updatePackageJson = (current, coreJson) => {
    return {
        ...current,
        scripts: { ...current.scripts, ...coreJson.scripts },
        devDependencies: { ...current.devDependencies, ...coreJson.devDependencies },
        dependencies: { ...current.dependencies, ...coreJson.dependencies },
    }
}

const copyCoreScripts = (appDir, coreDir) => {
    fs.copySync(`${coreDir}/script`, `${appDir}/script`)
}

module.exports = { updatePackageJson, copyCoreScripts }
