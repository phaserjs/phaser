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

            var stillRunning = false;

            for (var i = 0; i < this.totalData; i++)
            {
                if (UpdateTweenData(this, this.data[i], delta))
                {
                    stillRunning = true;
                }
            }

            //  Anything still running? If not, we're done
            if (!stillRunning)
            {
                this.nextState();
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
