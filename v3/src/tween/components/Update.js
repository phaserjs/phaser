var UpdateTweenData = require('./UpdateTweenData');

var Update = function (timestamp, delta)
{
    var tween = this.data[this.current];

    if (UpdateTweenData(tween, timestamp, delta))
    {
        //  Tween has completed
        this.state = 5;
    }

    return (this.state === 5);
};

module.exports = Update;
