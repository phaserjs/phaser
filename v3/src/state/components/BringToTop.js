//  If the arguments are strings they are assumed to be keys, otherwise they are State objects
//  You can only swap the positions of Active (rendering / updating) States. If a State is not active it cannot be moved.

var BringToTop = function (state)
{
    var index = (typeof state === 'string') ? this.getActiveStateIndexByKey(state) : this.getActiveStateIndex(state);

    if (index < this.active.length)
    {
        var i = 0;
        var entry = this.active.splice(index, 1);

        for (i = 0; i < this.active.length; i++)
        {
            this.active[i].index = i;
        }

        this.active.push({ index: i, state: entry[0].state });
    }
};

module.exports = BringToTop;
