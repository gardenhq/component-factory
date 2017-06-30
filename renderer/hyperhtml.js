module.exports = function(hyper, getSlotFunction, getShadowRootForNode)
{
    return function(el, props, dispatch, render, shadow)
    {
        if(el.html == null) {
            const root = shadow ? getShadowRootForNode(el) : el; 
            el.html = hyper.bind(root);
            el.html.slot = getSlotFunction(el)
        }
        const tree = render(
            props,
            dispatch,
            el.html
        );
    }
    
}
