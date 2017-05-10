module.exports = function(hyper, getSlotFunction, getShadowRootForNode)
{
    return function(el, props, dispatch, render, shadow)
    {
        if(el.html == null) {
            const root = shadow ? getShadowRootForNode(el) : el; 
            // el.html = hyper.bind(root);
            el.html = hyper.wire(el, el instanceof SVGElement ? "svg": null);
            el.html.slot = getSlotFunction(el)
            // el.html.root = root;
            el.html.update = hyper.bind(root);
        }
        const tree = render(
            props,
            dispatch,
            el.html
        );
        if(tree != null) {
            el.html.update`${tree}`;
        } else {
            // el.parentNode.removeChild(el);
            
        }
        // if(tree == null) {
            // this.parentNode.removeChild(this);
        // }
        // this.root.appendChild(tree);
    }
    
}
