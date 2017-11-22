/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#sortScenes
 * @since 3.0.0
 *
 * @param {Phaser.Scene} sceneA - [description]
 * @param {Phaser.Scene} sceneB - [description]
 *
 * @return {integer} [description]
 */
var SortScenes = function (sceneA, sceneB)
{
    //  Sort descending
    return sceneA.index - sceneB.index;
};

module.exports = SortScenes;
