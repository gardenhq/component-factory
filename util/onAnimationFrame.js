module.exports = function(throttledRaf)
{
    return function(callback, prop)
    {
        prop = prop || "_raf_frame";
        return (
            function()
            {
                return function ()
                {
                    if(this[prop] == null) {
                        this[prop] = throttledRaf(
                            callback.bind(this)
                        );
                    }
                    this[prop].apply(this, arguments);
                }

            }
        )();
    }
}

