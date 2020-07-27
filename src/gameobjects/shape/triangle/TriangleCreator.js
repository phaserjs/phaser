/**
 * @author       Halil Çakar <hcakar.1992@gmail.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Triangle = require('./Triangle');
var GameObjectCreator = require('../../GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');

/**
 * Creates a new Triangle Game Object and returns it.
 *
 * @param {object} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this
 *     argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Triangle} The Game Object that was created.
 */
GameObjectCreator.register('triangle', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var x1 = GetAdvancedValue(config, 'x1', 0);
    var y1 = GetAdvancedValue(config, 'y1', 128);
    var x2 = GetAdvancedValue(config, 'x2', 64);
    var y2 = GetAdvancedValue(config, 'y2', 0);
    var x3 = GetAdvancedValue(config, 'x3', 128);
    var y3 = GetAdvancedValue(config, 'y3', 128);
    var strokeColor = GetAdvancedValue(config, 'strokeColor', undefined);
    var strokeAlpha = GetAdvancedValue(config, 'strokeAlpha', undefined);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    var gameObject = new Triangle(this.scene, x, y, x1, y1, x2, y2, x3, y3, strokeColor, strokeAlpha);

    if (config.add)
    {
        this.scene.sys.displayList.add(gameObject);
    }

    return gameObject;
});
