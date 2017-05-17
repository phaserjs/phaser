var UpdateTweenData = require('./UpdateTweenData');

var Update = function (timestamp, delta)
{
    if (UpdateTweenData(this, this.tween, timestamp, delta))
    {
        //  Next TweenData
        

        //  Tween has completed
        this.state = 5;
    }

    return (this.state === 5);
};

module.exports = Update;
