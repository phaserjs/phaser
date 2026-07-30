/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var BuildGameObject = require('../../BuildGameObject');
var GameObjectCreator = require('../../GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');
var NoiseCell2D = require('./NoiseCell2D');

/**
 * Creates a new NoiseCell2D Game Object and returns it.
 *
 * Note: This method will only be available if the NoiseCell2D Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#noisecell2d
 * @since 4.0.0
 *
 * @param {Phaser.Types.GameObjects.NoiseCell2D.NoiseCell2DConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.NoiseCell2D} The Game Object that was created.
 */
GameObjectCreator.register('noisecell2d', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var quadConfig = GetAdvancedValue(config, 'config', null);
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 128);
    var height = GetAdvancedValue(config, 'height', 128);

    var noisecell2d = new NoiseCell2D(this.scene, quadConfig, x, y, width, height);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, noisecell2d, config);

    return noisecell2d;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
