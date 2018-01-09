/**
 * performance.now
 */
(function () {

    if ('performance' in window === false)
    {
        window.performance = {};
    }

    //  Thanks IE8
    Date.now = (Date.now || function () {
        return new Date().getTime();
    });

    if ('now' in window.performance === false)
    {
        var nowOffset = Date.now();

        if (performance.timing && performance.timing.navigationStart)
        {
            nowOffset = performance.timing.navigationStart;
        }

        window.performance.now = function now ()
        {
            return Date.now() - nowOffset;
        }
    }

})();
