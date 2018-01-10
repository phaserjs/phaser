/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#sortScenes
 * @since 3.0.0
 *
 * @param {object} sceneA - [description]
 * @param {object} sceneB - [description]
 *
 * @return {integer} [description]
 */
var SortScenes = function (sceneA, sceneB)
{
    //  Sort descending
    if (sceneA.index < sceneB.index)
    {
        return -1;
    }
    else if (sceneA.index > sceneB.index)
    {
        return 1;
    }
    else
    {
        return 0;
    }
};

module.exports = SortScenes;
