var UpdateTweenData = require('./UpdateTweenData');

var ProcessTweenData = function (delta)
{
    for (var key in this.data)
    {
        var prop = this.data[key];

        if (UpdateTweenData(this, prop.current, delta))
        {
            //  TweenData complete - advance to the next one
            this.nextTweenData(prop);
        }
    }
};

module.exports = ProcessTweenData;
