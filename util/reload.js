module.exports = function(win, doc, builder)
{
    var require = function(path)
    {
        return Promise.all(
            [
                "o.dev.delete",
                "o.dev.import"
            ].map(
                function(item)
                {
                    return builder.get(item);
                }
            )
        ).then(
            function(modules)
            {
                var del = modules[0];
                var require = modules[1];
                return del(path).then(
                    function()
                    {
                        return require(path);
                    }
                )
            }
        );
    }
    return function(path, extension)
    {
        // need to reset the items in the cache also for building
        switch(extension) {
            case "css":
                require(path).then(
                    function(content)
                    { 
                        // path = "/node_modules/component-factory" + path;
                        var links = doc.querySelectorAll('[_csshref="' + path + '"]');
                        var css = URL.createObjectURL(new Blob([content], {type: "text/css"}));
                        [].slice.call(links).forEach(
                            function(item)
                            {
                                item.setAttribute("_css", css);
                            }
                        );
                    }
                )
                break;
            case "html":
                var component = doc.querySelector('[_templatehref="'  + path + '"]');
                if(component) {
                    require(path).then(
                        function(content)
                        {
                            console.log(path);
                            var component = doc.querySelector('[_templatehref="'  + path + '"]');
                            content += "<!--# sourceURL=" + path + " -->";
                            content = '<link href="${ props._css }" rel="stylesheet" type="text/css" />' + content;
                            component.setAttribute("_template", content);
                        }
                    );
                    break;
                } else {
                    return true;
                }
                break;
            default:
                return true;
        }
        return false;
    }
}
