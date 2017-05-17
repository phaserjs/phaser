var UpdateTweenData = require('./UpdateTweenData');

var Update = function (timestamp, delta)
{
    if (UpdateTweenData(this, this.tween, timestamp, delta))
    {
        //  Next TweenData
        if (this.tween.next)
        {
            this.setCurrentTweenData(this.tween.next);
        }
        else if (this.loop)
        {
            this.setCurrentTweenData(this.data[0]);
        }
        else
        {
            //  Tween has completed
            this.state = 5;
        }
    }

    return (this.state === 5);
};

module.exports = Update;
