module.exports = function(prop, ELEMENT_NODE)
{
    ELEMENT_NODE = ELEMENT_NODE || Node.ELEMENT_NODE;
    prop = prop || "slots";
    const getSlot = function()
    {
        return function(name)
        {
            // return '<slot name="' + name + '"/>';
            return this[prop][name] || "";
        }
    }

    return function(el)
    {
        if(el[prop] == null) {
            el[prop] = [];
            Array.prototype.slice.call(el.childNodes).forEach(
                function(node)
                {
                    if(node.nodeType == ELEMENT_NODE && node.hasAttribute("slot")) {
                        // this[prop][node.getAttribute("slot")] = node.cloneNode(true);
                        this[prop][node.getAttribute("slot")] = node.parentNode.removeChild(node);
                    }
                },
                el
            );
        }
        return getSlot(prop).bind(el);
    }
}
