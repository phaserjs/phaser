var Begin = function ()
{
    var removeList = this._pendingRemoval;
    var insertList = this._pendingInsertion;

    var toRemove = removeList.length;
    var toInsert = insertList.length;

    if (toRemove === 0 && toInsert === 0)
    {
        //  Quick bail
        return;
    }

    var current = this._list;

    //  Delete old gameObjects
    for (var i = 0; i < toRemove; i++)
    {
        var gameObject = removeList[i];

        var index = current.indexOf(gameObject);

        if (index > -1)
        {
            current.splice(index, 1);

            //  TODO: Clear from _draggable, _drag and _over too

            this.clear(gameObject);
        }
    }

    //  Clear the removal list
    removeList.length = 0;

    //  Move pendingInsertion to list (also clears pendingInsertion at the same time)
    this._list = current.concat(insertList.splice(0));
};

module.exports = Begin;

