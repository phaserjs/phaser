var Mesh = require('./Mesh');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Mesh Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Mesh Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#mesh
 * @webglOnly
 * @since 3.0.0
 *
 * 
 * @return {Phaser.GameObjects.Mesh} The Game Object that was created.
 */
if (WEBGL_RENDERER)
{
    GameObjectFactory.register('mesh', function (x, y, vertices, uv, colors, alphas, texture, frame)
    {
        return this.displayList.add(new Mesh(this.scene, x, y, vertices, uv, key, frame));
    });
}

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
