var Begin = function ()
{
    var removeList = this.children.pendingRemoval;
    var insertList = this.children.pendingInsertion;

    var toRemove = removeList.length;
    var toInsert = insertList.length;

    if (toRemove === 0 && toInsert === 0)
    {
        //  Quick bail
        return;
    }

    var current = this.children.list;

    //  Delete old gameObjects
    for (var i = 0; i < toRemove; i++)
    {
        var interactiveObject = removeList[i];

        var index = current.indexOf(interactiveObject);

        if (index > -1)
        {
            current.splice(index, 1);

            //  Tidy up all of the Interactive Objects references?
            //  Callbacks, shapes, etc
            interactiveObject.gameObject.input = null;
        }
    }

    //  Clear the removal list
    removeList.length = 0;

    //  Move pendingInsertion to list (also clears pendingInsertion at the same time)
    this.children.list = current.concat(insertList.splice(0));

    //  Update the size
    this.children.size = this.children.list.length;
};

module.exports = Begin;

