//  If the arguments are strings they are assumed to be keys, otherwise they are State objects
//  You can only swap the positions of Active (rendering / updating) States. If a State is not active it cannot be moved.

var SendToBack = function (state)
{
    var index = (typeof state === 'string') ? this.getActiveStateIndexByKey(state) : this.getActiveStateIndex(state);

    if (index > 0)
    {
        var entry = this.active.splice(index, 1);

        this.active.unshift({ index: 0, state: entry[0].state });

        for (var i = 0; i < this.active.length; i++)
        {
            this.active[i].index = i;
        }
    }
};

module.exports = SendToBack;
