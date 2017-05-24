var TweenData = function (target, key, value, ease, delay, duration, yoyo, hold, repeat, repeatDelay, startAt)
{
    return {

        //  The target to tween
        target: target,

        //  The property of the target to tween
        key: key,

        //  A function to call when starting the tween, populates the 'start' and 'end' values
        value: value,

        //  The ease function this tween uses.
        ease: ease,

        //  Duration of the tween in ms/frames, excludes time for yoyo or repeats.
        duration: 0,

        //  The total calculated duration of this TweenData (based on duration, repeat, delay and yoyo)
        totalDuration: 0,

        //  Time in ms/frames before tween will start.
        delay: 0,

        //  Cause the tween to return back to its start value after hold has expired.
        yoyo: yoyo,

        //  Time in ms/frames the tween will pause before running the yoyo or starting a repeat.
        hold: 0,

        //  Number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
        repeat: 0,

        //  Time in ms/frames before the repeat will start.
        repeatDelay: 0,

        //  Changes the property to be this value before starting the tween.
        startAt: startAt,

        //  Between 0 and 1 showing completion of this TweenData.
        progress: 0,

        //  Delta counter.
        elapsed: 0,

        //  How many repeats are left to run?
        repeatCounter: 0,

        //  Value Data:

        start: 0,
        current: 0,
        end: 0,
        startCache: 0,
        endCache: 0,

        //  LoadValue generation functions
        gen: {
            delay: delay,
            duration: duration,
            hold: hold,
            repeat: repeat,
            repeatDelay: repeatDelay
        },

        //  TWEEN_CONST.CREATED
        state: 0
    };
};

module.exports = TweenData;
