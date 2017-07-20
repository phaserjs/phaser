var SetPollRate = function (value)
{
    this.pollRate = value;
    this._pollTimer = 0;

    return this;
};

module.exports = SetPollRate;
