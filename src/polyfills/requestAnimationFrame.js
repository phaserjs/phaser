// References:
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// https://gist.github.com/1579671
// http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
// https://gist.github.com/timhall/4078614
// https://github.com/Financial-Times/polyfill-service/tree/master/polyfills/requestAnimationFrame

// requestAnimationFrame
var lastTime = Date.now();

var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++)
{
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
{
    window.requestAnimationFrame = function (callback)
    {
        if (typeof callback !== 'function')
        {
            throw new TypeError(callback + 'is not a function');
        }

        var currentTime = Date.now();
        var delay = 16 + lastTime - currentTime;

        if (delay < 0)
        {
            delay = 0;
        }

        lastTime = currentTime;

        return setTimeout(function () {
            lastTime = Date.now();
            callback(performance.now());
        }, delay);
    };
}

if (!window.cancelAnimationFrame)
{
    window.cancelAnimationFrame = function(id)
    {
        clearTimeout(id);
    };
}
