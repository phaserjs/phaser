//  If the arguments are strings they are assumed to be keys, otherwise they are State objects
//  You can only swap the positions of Active (rendering / updating) States. If a State is not active it cannot be moved.

var MoveDown = function (state)
{
    var index = (typeof state === 'string') ? this.getActiveStateIndexByKey(state) : this.getActiveStateIndex(state);

    if (index > 0)
    {
        var stateB = this.getStateAt(index - 1);

        if (stateB)
        {
            this.swapPosition(state, stateB);
        }
    }
};

module.exports = MoveDown;
