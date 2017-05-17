var LoadValues = function ()
{
    this.start = this.target[this.key];
    this.current = this.start;
    this.end = this.value();

    if (this.repeat === -1)
    {
        this.loop = true;
    }

    this.repeatCounter = (this.loop) ? Number.MAX_SAFE_INTEGER : this.repeat;

    this.state = 3;
};

module.exports = LoadValues;
