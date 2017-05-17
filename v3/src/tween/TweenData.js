var TweenData = function (value, ease, duration, yoyo, repeat, loop, delay, repeatDelay)
{
    return {

        //  A function to call when starting the tween, to populate the 'start' and 'end' values with
        value: value,

        // the ease function this tween uses
        ease: ease,

        // duration of the tween in ms/frames, excludes time for yoyo or repeats
        duration: duration,

        // alternate the tween back to its start position again?
        yoyo: yoyo,

        // number of times to repeat the tween (-1 = forever, same as setting loop=true)
        repeat: repeat,

        // infinitely loop this tween?
        loop: loop,

        // time in ms/frames between tween will start its first run
        delay: delay,

        // time in ms/frames before repeat will start
        repeatDelay: repeatDelay,

        // between 0 and 1 showing completion of current portion of tween
        progress: 0,

        // delta counter
        elapsed: 0,

        // delta countdown timer
        countdown: 0,

        // how many repeats are left to run?
        repeatCounter: 0,

        //  0 = Waiting to be added to the TweenManager
        //  1 = Paused (dev needs to invoke Tween.start)
        //  2 = Started, but waiting for delay to expire
        //  3 = Playing Forward
        //  4 = Playing Backwards
        //  5 = Completed
        state: 0,

        //  For chained TweenData these point to the prev and next references
        prev: null,
        next: null
    };
};

module.exports = TweenData;
