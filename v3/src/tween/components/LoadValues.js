var LoadValues = function ()
{
    this.start = this.target[this.key];
    this.current = this.start;
    this.end = this.tween.value();
};

module.exports = LoadValues;
