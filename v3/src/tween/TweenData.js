var TweenData = function (key, value, ease, delay, duration, hold, repeat, repeatDelay, startAt, yoyo)
{
    return {

        //  The property of the target to tween
        key: key,

        //  A function to call when starting the tween, populates the 'start' and 'end' values
        value: value,

        // the ease function this tween uses
        ease: ease,

        // duration of the tween in ms/frames, excludes time for yoyo or repeats
        duration: duration,

        //  The total calculated duration of this TweenData (based on duration, repeat, delay, hold, yoyo)
        totalDuration: 0,

        //  Cause the tween to alternate back and forth on each *repeat*. Has no effect unless repeat > 0.
        yoyo: yoyo,

        //  Number of times to repeat the tween.
        repeat: repeat,

        //  Time in ms/frames before tween will start.
        delay: delay,

        //  Time in ms/frames the tween will remain in its end state before repeat or complete.
        hold: hold,

        //  Time in ms/frames before repeat will start
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

        startValue: null,

        endValue: null
    };
};

module.exports = TweenData;
