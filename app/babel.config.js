// This make async works
// https://github.com/facebook/jest/issues/3126#issuecomment-483320742
module.exports = {
    "presets": [
        [
        "@babel/preset-env",
        {
            "targets": {
            "node": "current"
            }
        }
        ]
    ]
}