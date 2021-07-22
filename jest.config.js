const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
    verbose: true,
    testMatch: [
        "**/test/**/*.test.js",
        "**/test/**/*.test.ts"
    ],
    moduleNameMapper: {
        '^@src(.*)$': '<rootDir>/src/$1'
    },
    "moduleFileExtensions": [
        "ts",
        "js"
    ],
    "transform": {
        "^.+\\.jsx?$": "babel-jest",
        ...tsjPreset.transform,
    },
    "globals": {
        "ts-jest": {
            "tsConfig": "tsconfig.json"
        }
    },
};