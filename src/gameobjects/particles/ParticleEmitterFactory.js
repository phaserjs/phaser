/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectFactory = require('../GameObjectFactory');
var ParticleEmitter = require('./ParticleEmitter');

/**
 * Creates a new Particle Emitter Game Object and adds it to the Scene.
 *
 * If you wish to configure the Emitter after creating it, use the `ParticleEmitter.setConfig` method.
 *
 * Prior to Phaser v3.60 this function would create a `ParticleEmitterManager`. These were removed
 * in v3.60 and replaced with creating a `ParticleEmitter` instance directly. Please see the
 * updated function parameters and class documentation for more details.
 *
 * Note: This method will only be available if the Particles Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#particles
 * @since 3.60.0
 *
 * @param {number} [x] - The horizontal position of this Game Object in the world.
 * @param {number} [y] - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} [texture] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} [config] - Configuration settings for the Particle Emitter.
 *
 * @return {Phaser.GameObjects.Particles.ParticleEmitter} The Game Object that was created.
 */
GameObjectFactory.register('particles', function (x, y, texture, config)
{
    if (x !== undefined && typeof x === 'string')
    {
        console.warn('ParticleEmitterManager was removed in Phaser 3.60. See documentation for details');
    }

    return this.displayList.add(new ParticleEmitter(this.scene, x, y, texture, config));
});
