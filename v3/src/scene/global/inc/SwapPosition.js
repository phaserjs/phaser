//  If the arguments are strings they are assumed to be keys, otherwise they are Scene objects

/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#swapPosition
 * @since 3.0.0
 *
 * @param {string|Phaser.Scene} scene1 - [description]
 * @param {string|Phaser.Scene} scene2 - [description]
 */
var SwapPosition = function (scene1, scene2)
{
    if (scene1 === scene2) { return; }

    if (typeof scene1 === 'string') { scene1 = this.getScene(scene1); }
    if (typeof scene2 === 'string') { scene2 = this.getScene(scene2); }

    if (scene1 === scene2) { return; }

    var index1 = this.getSceneIndex(scene1),
        index2 = this.getSceneIndex(scene2);

    this.scenes[index1] = scene2;
    this.scenes[index2] = scene1;

    index1 = this.getActiveSceneIndex(scene1);
    index2 = this.getActiveSceneIndex(scene2);

    if (index1 >= 0 && index2 >= 0)
    {
        this.active[index1] = scene2;
        this.active[index2] = scene1;
    }
};

module.exports = SwapPosition;
