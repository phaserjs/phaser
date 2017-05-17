var TweenData = function (value, ease, delay, duration, hold, repeat, repeatDelay, startAt, yoyo)
{
    return {

        //  A function to call when starting the tween, populates the 'start' and 'end' values
        value: value,

        // the ease function this tween uses
        ease: ease,

        // duration of the tween in ms/frames, excludes time for yoyo or repeats
        duration: duration,

        // return the tween back to its start position again?
        yoyo: yoyo,

        // number of times to repeat the tween
        repeat: repeat,

        // time in ms/frames before tween will start
        delay: delay,

        // time in ms/frames the tween will remain in its end state before either yoyo, repeat or complete
        hold: hold,

        // time in ms/frames before repeat will start
        repeatDelay: repeatDelay,

        //  Changes the property to be this value before starting the tween
        startAt: startAt,

        // between 0 and 1 showing completion of this TweenData
        progress: 0,

        // delta counter
        elapsed: 0,

        // how many repeats are left to run?
        repeatCounter: 0,

        //  TWEEN_CONST.CREATED
        state: 0,

        //  For chained TweenData these point to the prev and next references
        prev: null,
        next: null
    };
};

module.exports = TweenData;
