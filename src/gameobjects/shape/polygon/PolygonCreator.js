/**
 * @author       Halil Çakar <hcakar.1992@gmail.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Polygon = require('./Polygon');
var GameObjectCreator = require('../../GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');

/**
 * Creates a new Polygon Game Object and returns it.
 *
 * @param {object} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this
 *     argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Polygon} The Game Object that was created.
 */
GameObjectCreator.register('polygon', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var points = GetAdvancedValue(config, 'points', undefined);
    var fillColor = GetAdvancedValue(config, 'fillColor', undefined);
    var fillAlpha = GetAdvancedValue(config, 'fillAlpha', undefined);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    var gameObject = new Polygon(this.scene, x, y, points, fillColor, fillAlpha);

    if (config.add)
    {
        this.scene.sys.displayList.add(gameObject);
    }

    return gameObject;
});
