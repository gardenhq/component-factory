module.exports = function(key, value, obj)
{
    obj = obj || {};
    key.replace("]", "").replace("[", ".").split(".").reduce(
        function(prev, item, i, arr)
        {
            // var isArray = item.indexOf("[]") === 0 ? true : false;
            // item = isArray ? item.substr(2) : item;
            // console.log(item);
            if(i == arr.length - 1) {
                prev[item] = value;
                return;
            }
            prev[item] = prev[item] || [];//isArray ? [] : {};
            return prev[item];
        },
        obj
    );
    return obj;
};
