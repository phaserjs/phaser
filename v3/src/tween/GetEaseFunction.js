var EaseMap = require('../math/easing/EaseMap');

var GetEaseFunction = function (ease)
{
    if (typeof ease === 'string' && EaseMap.hasOwnProperty(ease))
    {
        //  String based look-up
        return EaseMap[ease];
    }
    else if (typeof ease === 'function')
    {
        //  Custom function
        return ease;
    }
    else if (Array.isArray(ease) && ease.length === 4)
    {
        //  Bezier function (TODO)
    }

    return EaseMap.Power0;
};

module.exports = GetEaseFunction;
