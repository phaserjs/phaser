//  If the arguments are strings they are assumed to be keys, otherwise they are Scene objects
//  You can only swap the positions of Active (rendering / updating) Scenes. If a Scene is not active it cannot be moved.

var MoveUp = function (scene)
{
    var index = (typeof scene === 'object') ? this.getActiveSceneIndex(scene) : this.getActiveSceneIndexByKey(scene);

    if (index !== -1 && index < this.active.length - 1)
    {
        var sceneB = this.getSceneAt(index + 1);

        if (sceneB)
        {
            this.swapPosition(scene, sceneB);
        }
    }
};

module.exports = MoveUp;
