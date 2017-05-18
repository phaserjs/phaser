var LoadValues = function ()
{
    var tweenData = this.currentTweenData;

    if (tweenData.startValue === null)
    {
        this.start = this.target[this.key];
        this.end = this.currentTweenData.value();

        tweenData.startValue = this.start;
        tweenData.endValue = this.end;
    }
    else
    {
        this.start = tweenData.startValue;
        this.end = tweenData.endValue;
    }

    this.current = this.start;
    
    this.target[this.key] = this.start;
};

module.exports = LoadValues;
