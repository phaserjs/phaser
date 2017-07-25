//  Given an array of Interactive Objects, sort the array and return it,
//  so that the objects are in index order with the lowest at the bottom.
var SortInteractiveObjects = function (interactiveObjects)
{
    if (interactiveObjects.length < 2)
    {
        return interactiveObjects;
    }

    this.scene.sys.depthSort();

    return interactiveObjects.sort(this.sortHandlerIO.bind(this));
};

module.exports = SortInteractiveObjects;
