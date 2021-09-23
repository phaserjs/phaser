/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetValue = require('../../utils/object/GetValue');
var Rope = require('./Rope');

/**
 * Creates a new Rope Game Object and returns it.
 *
 * Note: This method will only be available if the Rope Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#rope
 * @since 3.23.0
 *
 * @param {Phaser.Types.GameObjects.Rope.RopeConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Rope} The Game Object that was created.
 */
GameObjectCreator.register('rope', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);
    var horizontal = GetAdvancedValue(config, 'horizontal', true);
    var points = GetValue(config, 'points', undefined);
    var colors = GetValue(config, 'colors', undefined);
    var alphas = GetValue(config, 'alphas', undefined);

    var rope = new Rope(this.scene, 0, 0, key, frame, points, horizontal, colors, alphas);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, rope, config);

    if (!config.add)
    {
        this.updateList.add(rope);
    }

    return rope;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
