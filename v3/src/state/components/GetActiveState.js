var GetActiveState = function (key)
{
    var state = this.getState(key);

    for (var i = 0; i < this.active.length; i++)
    {
        if (this.active[i].state === state)
        {
            return this.active[i];
        }
    }
};

module.exports = GetActiveState;
