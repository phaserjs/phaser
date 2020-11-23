/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
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
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number|object)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig|Phaser.Types.GameObjects.Particles.ParticleEmitterConfig[]} [emitters] - Configuration settings for one or more emitters to create.
 *
 * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} The Game Object that was created.
 */
GameObjectFactory.register('particles', function (key, frame, emitters)
{
    return this.displayList.add(new ParticleEmitterManager(this.scene, key, frame, emitters));
});
