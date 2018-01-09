//  Given an array of Game Objects, sort the array and return it,
//  so that the objects are in index order with the lowest at the bottom.
var SortGameObjects = function (gameObjects)
{
    if (gameObjects.length < 2)
    {
        return gameObjects;
    }

    this.scene.sys.depthSort();

    return gameObjects.sort(this.sortHandlerGO.bind(this));
};

module.exports = SortGameObjects;
