var GetActiveStateIndex = function (state)
{
    for (var i = 0; i < this.active.length; i++)
    {
        if (this.active[i].state === state)
        {
            return this.active[i].index;
        }
    }

    return -1;
};

module.exports = GetActiveStateIndex;
