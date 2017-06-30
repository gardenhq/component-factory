module.exports = function(querySelectorAll)
{
    querySelectorAll = querySelectorAll || document.querySelectorAll.bind(document);
    return function(sel, context)
    {
        if(context) {
            return [].slice.call(querySelectorAll.bind(context)(sel));
        }
        return [].slice.call(querySelectorAll(sel));
    }
}
