var SortScenes = require('./SortScenes');

//  If the arguments are strings they are assumed to be keys, otherwise they are Scene objects
//  You can only swap the positions of Active (rendering / updating) Scenes. If a Scene is not active it cannot be moved.

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
    if (scene1 === scene2)
    {
        return;
    }

    var index1 = (typeof scene1 === 'string') ? this.getActiveSceneIndexByKey(scene1) : this.getActiveSceneIndex(scene1);
    var index2 = (typeof scene2 === 'string') ? this.getActiveSceneIndexByKey(scene2) : this.getActiveSceneIndex(scene2);

    if (index1 !== -1 && index2 !== -1 && index1 !== index2)
    {
        this.active.forEach(function(scene){
          if(scene.scene === this.scenes[index1])
          {
            scene.index = index2;
          }

          if(scene.scene === this.scenes[index2])
          {
            scene.index = index1;
          }
        }, this)

        this.active.sort(SortScenes);
    }
};

module.exports = SwapPosition;
