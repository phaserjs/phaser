var SortStates = require('./SortStates');

//  If the arguments are strings they are assumed to be keys, otherwise they are State objects
//  You can only swap the positions of Active (rendering / updating) States. If a State is not active it cannot be moved.

var SwapPosition = function (state1, state2)
{
    if (state1 === state2)
    {
        return;
    }

    var index1 = (typeof state1 === 'string') ? this.getActiveStateIndexByKey(state1) : this.getActiveStateIndex(state1);
    var index2 = (typeof state2 === 'string') ? this.getActiveStateIndexByKey(state2) : this.getActiveStateIndex(state2);

    if (index1 !== -1 && index2 !== -1)
    {
        this.active[index1].index = index2;
        this.active[index2].index = index1;

        this.active.sort(SortStates);
    }
};

module.exports = SwapPosition;
