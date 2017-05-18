var TWEEN_CONST = require('../const');
var UpdateTweenData = require('./UpdateTweenData');

var Update = function (timestamp, delta)
{
    if (this.useFrames)
    {
        delta = 1;
    }

    switch (this.state)
    {
        case TWEEN_CONST.ACTIVE:

            for (var key in this.data)
            {
                var prop = this.data[key];

                if (UpdateTweenData(this, prop.current, delta))
                {
                    //  TweenData complete - advance to the next one
                    //  TODO:
                    //  At the moment this sets the overall Tween.state, but
                    //  it should only do that when the last remaining TweenData has ended,
                    //  otherwise a shorter property tween could start this tween looping
                    //  before a longer property tween has even finished
                    this.nextTweenData(prop);
                }
            }

            break;

        case TWEEN_CONST.LOOP_DELAY:
        case TWEEN_CONST.START_DELAY:

            this.countdown -= delta;

            if (this.countdown <= 0)
            {
                this.state = TWEEN_CONST.ACTIVE;
            }

            break;

        case TWEEN_CONST.COMPLETE_DELAY:

            this.countdown -= delta;

            if (this.countdown <= 0)
            {
                this.state = TWEEN_CONST.PENDING_REMOVE;
            }

            break;
    }

    return (this.state === TWEEN_CONST.PENDING_REMOVE);
};

module.exports = Update;
