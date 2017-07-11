module.exports = function()
{
    return {
        "component-factory.renderer": {
            "callable": __dirname + "/../renderer/hyperhtml",
            "arguments": [
                "@hyperhtml",
                "@component-factory.renderer.slot",
                "@dom.getShadowRootForNode"
            ]
        },
        "hyperhtml": {
            "object": "hyperhtml/hyperhtml",
            "version": "0.15.5"
        }
    };
}
