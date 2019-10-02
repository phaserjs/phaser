/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectFactory = require('../GameObjectFactory');
var ParticleEmitterManager = require('./ParticleEmitterManager');

/**
 * Creates a new Particle Emitter Manager Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Particles Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#particles
 * @since 3.0.0
 *
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer|object)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig|Phaser.Types.GameObjects.Particles.ParticleEmitterConfig[]} [emitters] - Configuration settings for one or more emitters to create.
 *
 * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} The Game Object that was created.
 */
GameObjectFactory.register('particles', function (key, frame, emitters)
{
    var manager = new ParticleEmitterManager(this.scene, key, frame, emitters);

    this.displayList.add(manager);
    this.updateList.add(manager);

    return manager;
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
