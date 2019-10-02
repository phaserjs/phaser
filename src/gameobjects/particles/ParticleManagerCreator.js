/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetFastValue = require('../../utils/object/GetFastValue');
var ParticleEmitterManager = require('./ParticleEmitterManager');

/**
 * Creates a new Particle Emitter Manager Game Object and returns it.
 *
 * Note: This method will only be available if the Particles Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#particles
 * @since 3.0.0
 *
 * @param {object} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} The Game Object that was created.
 */
GameObjectCreator.register('particles', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);
    var emitters = GetFastValue(config, 'emitters', null);

    //  frame is optional and can contain the emitters array or object if skipped
    var manager = new ParticleEmitterManager(this.scene, key, frame, emitters);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    var add = GetFastValue(config, 'add', false);

    if (add)
    {
        this.displayList.add(manager);
    }

    this.updateList.add(manager);

    return manager;
});
