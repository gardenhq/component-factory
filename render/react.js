module.exports = function($, _render)
{
    var render = function(component, el)
    {
        if(typeof el === "string") {
            el = $(el)[0];
        }
        _render(component, el);
    }
    return function(Component, selector)
    {
        render(
            Component.create(),
            selector
        );
    }
}

