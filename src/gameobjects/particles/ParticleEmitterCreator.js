/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetFastValue = require('../../utils/object/GetFastValue');
var ParticleEmitter = require('./ParticleEmitter');

/**
 * Creates a new Particle Emitter Game Object and returns it.
 *
 * Prior to Phaser v3.60 this function would create a `ParticleEmitterManager`. These were removed
 * in v3.60 and replaced with creating a `ParticleEmitter` instance directly. Please see the
 * updated function parameters and class documentation for more details.
 *
 * Note: This method will only be available if the Particles Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#particles
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterCreatorConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Particles.ParticleEmitter} The Game Object that was created.
 */
GameObjectCreator.register('particles', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var emitterConfig = GetFastValue(config, 'config', null);

    var emitter = new ParticleEmitter(this.scene, 0, 0, key);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, emitter, config);

    if (emitterConfig)
    {
        emitter.setConfig(emitterConfig);
    }

    return emitter;
});
