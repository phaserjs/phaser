//  Given an array of Interactive Objects, sort the array and return it,
//  so that the objects are in index order with the lowest at the bottom.
var SortInteractiveObjects = function (interactiveObjects)
{
    this.scene.sys.depthSort();

    return interactiveObjects.sort(this.sortIndexHandler.bind(this));
};

module.exports = SortInteractiveObjects;
