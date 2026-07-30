/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Noise = require('./Noise');

/**
 * Creates a new Noise Game Object and returns it.
 *
 * A Noise Game Object renders procedural noise — such as Perlin or simplex noise — directly
 * onto a WebGL quad using a shader. It is useful for generating dynamic visual effects such
 * as clouds, fog, terrain previews, animated backgrounds, or any effect that benefits from
 * smooth, organic-looking randomness. The noise pattern is generated entirely on the GPU,
 * making it very efficient to animate each frame.
 *
 * Note: This method will only be available if the Noise Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#noise
 * @since 4.0.0
 *
 * @param {Phaser.Types.GameObjects.Noise.NoiseConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Noise} The Game Object that was created.
 */
GameObjectCreator.register('noise', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var quadConfig = GetAdvancedValue(config, 'config', null);
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 128);
    var height = GetAdvancedValue(config, 'height', 128);

    var noise = new Noise(this.scene, quadConfig, x, y, width, height);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, noise, config);

    return noise;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
