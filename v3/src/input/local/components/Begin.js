var Begin = function ()
{
    var toRemove = this._pendingRemoval.length;
    var toInsert = this._pendingInsertion.length;

    if (toRemove === 0 && toInsert === 0)
    {
        //  Quick bail
        return;
    }

    var i;
    var gameObject;

    //  Delete old gameObjects
    for (i = 0; i < toRemove; i++)
    {
        gameObject = this._pendingRemoval[i];

        var index = this._list.indexOf(gameObject);

        if (index > -1)
        {
            this._list.splice(index, 1);

            gameObject.input = null;
        }
    }

    //  Move pending to active (can swap for concat splice if we don't need anything extra here)

    for (i = 0; i < toInsert; i++)
    {
        gameObject = this._pendingInsertion[i];

        //  Swap for Input Enabled Object
        this._list.push(gameObject);
    }

    this._size = this._list.length;

    //  Clear the lists
    this._pendingRemoval.length = 0;
    this._pendingInsertion.length = 0;
};

module.exports = Begin;

