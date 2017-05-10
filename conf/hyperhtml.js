module.exports = function()
{
    var temp = __dirname.split("/");
    temp.pop();
    var root = temp.join("/");
    return {
        "component-factory.renderer": {
            "callable": root + "/renderer/hyperhtml",
            "arguments": [
                "@hyperhtml",
                "@component-factory.renderer.slot",
                "@dom.getShadowRootForNode"
            ]
        },
        "hyperhtml": {
            "object": "hyperhtml/hyperhtml"
        }
    };
}
