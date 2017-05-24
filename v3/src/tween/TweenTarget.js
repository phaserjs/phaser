var TweenTarget = function (target, keys)
{
    //  keys: {
    //      x: { start: 0, current: 0, end: 0, startCache: null, endCache: null },
    //      y: { start: 0, current: 0, end: 0, startCache: null, endCache: null }
    //  }

    return {

        ref: target,

        keys: keys

    };
};

module.exports = TweenTarget;
