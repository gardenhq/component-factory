module.exports = function(hyper, dispatch, getShadowRootForNode)
{
    return function(shadow, addSlot, slot)
    {
        // if(this.root == null) {
        //      this.root = shadow ? getShadowRootForNode(this) : this
        // }
        // while(this.root.firstChild) {
        //  addSlot(this.root.removeChild(this.root.firstChild));
        // }
        const tree = this.render(
            hyper.bind(this)//,
            // slot,
            // dispatch.bind(this)
        );
        // if(tree) {
        //  this.root.appendChild(tree);
        // }
    }
    
}
