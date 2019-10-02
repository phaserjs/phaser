/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Blitter = require('./Blitter');
var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');

/**
 * Creates a new Blitter Game Object and returns it.
 *
 * Note: This method will only be available if the Blitter Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#blitter
 * @since 3.0.0
 *
 * @param {object} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Blitter} The Game Object that was created.
 */
GameObjectCreator.register('blitter', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var blitter = new Blitter(this.scene, 0, 0, key, frame);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, blitter, config);

    return blitter;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
