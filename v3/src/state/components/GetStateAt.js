//  Get's the Active state at the given position

var GetStateAt = function (index)
{
    if (this.active[index])
    {
        return this.active[index].state;
    }
};

module.exports = GetStateAt;
