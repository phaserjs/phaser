/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
*/

var BuildGameObject = require('../../BuildGameObject');
var GameObjectCreator = require('../../GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');
var NoiseSimplex3D = require('./NoiseSimplex3D');

/**
 * Creates a new NoiseSimplex3D Game Object and returns it.
 *
 * Note: This method will only be available if the NoiseSimplex3D Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#noisesimplex3d
 * @since 4.0.0
 *
 * @param {Phaser.Types.GameObjects.NoiseSimplex3D.NoiseSimplex3DConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.NoiseSimplex3D} The Game Object that was created.
 */
GameObjectCreator.register('noisesimplex3d', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var quadConfig = GetAdvancedValue(config, 'config', null);
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 128);
    var height = GetAdvancedValue(config, 'height', 128);

    var noisesimplex3d = new NoiseSimplex3D(this.scene, quadConfig, x, y, width, height);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, noisesimplex3d, config);

    return noisesimplex3d;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
