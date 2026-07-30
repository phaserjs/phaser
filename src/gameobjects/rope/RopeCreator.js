/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
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
 * A Rope is a WebGL-only Game Object that renders a strip of textured triangles along a series of points.
 * This makes it ideal for creating rope, ribbon, cloth, or other flexible strip-like visual effects.
 * The points define the spine of the rope, and the texture is stretched and mapped across the resulting mesh.
 * Per-vertex colors and alpha values can be set to create gradient or fade effects along the length of the rope.
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

    return rope;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
