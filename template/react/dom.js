module.exports = function($, domToString, prop)
{
    prop = prop || "data-prop";
    return function(el)
    {
        if(typeof el === "undefined") {
            el = $("html");
        }
        if(typeof el === "string") {
            sel = sel || "html";
            el = $(el);
        }
        var html = el[0];//.cloneNode(true);
        $("[" + prop + "]", html).forEach(
            function(item)
            {
                var key = item.getAttribute(prop); 
                if(item.nodeName == "INPUT") {
                    item.setAttribute("value", "${ props." + key + " }");
                    item.setAttribute("onInput", "${ dispatch('" + key + "') }");
                } else {
                    item.textContent = "${ props." + key + " }";
                }
                item.removeAttribute(prop);
            }
        );
        return domToString(html).replace(/(")(\$.+?(?="))(")/g, "$2").replace(/oninput/g, "onInput");
    }

}
