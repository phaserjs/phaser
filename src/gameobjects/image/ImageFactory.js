var Image = require('./Image');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Image Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Image Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#image
 * @since 3.0.0
 *
 * @param {number} x - The x position of the Game Object.
 * @param {number} y - The y position of the Game Object.
 * @param {string} key - The key of the Texture the Game Object will use.
 * @param {string|integer} [frame] - The Texture Frame the Game Object will use.
 * 
 * @return {Phaser.GameObjects.Image} The Game Object that was created.
 */
GameObjectFactory.register('image', function (x, y, key, frame)
{
    return this.displayList.add(new Image(this.scene, x, y, key, frame));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
