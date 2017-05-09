var TweenData = function (parent)
{
    this.tween = parent;

    this.property;
    
    this.value;

    this.ease;
    this.duration;
    this.yoyo;
    this.repeat;
    this.delay;
    this.startAt;
    this.onCompleteDelay;
    this.elasticity;

};

TweenData.prototype.constructor = TweenData;

TweenData.prototype = {



};

module.exports = TweenData;
