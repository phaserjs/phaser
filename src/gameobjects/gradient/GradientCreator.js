/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Gradient = require('./Gradient');

/**
 * Creates a new Gradient Game Object and returns it. A Gradient is a rectangular
 * Game Object that renders a smooth color gradient across its surface using WebGL.
 * It is useful for backgrounds, overlays, and decorative visual effects where a
 * multi-color fill is needed without a texture. Position, size, and gradient
 * appearance are all configured via the `config` object.
 *
 * Note: This method will only be available if the Gradient Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#gradient
 * @since 4.0.0
 *
 * @param {Phaser.Types.GameObjects.Gradient.GradientConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Gradient} The Game Object that was created.
 */
GameObjectCreator.register('gradient', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var quadConfig = GetAdvancedValue(config, 'config', null);
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 128);
    var height = GetAdvancedValue(config, 'height', 128);

    var gradient = new Gradient(this.scene, quadConfig, x, y, width, height);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, gradient, config);

    return gradient;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
