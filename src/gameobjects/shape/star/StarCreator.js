/**
 * @author       Halil Çakar <hcakar.1992@gmail.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Star = require('./Star');
var GameObjectCreator = require('../../GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');

/**
 * Creates a new Star Game Object and returns it.
 *
 * @param {object} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this
 *     argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Star} The Game Object that was created.
 */
GameObjectCreator.register('star', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var points = GetAdvancedValue(config, 'points', 5);
    var innerRadius = GetAdvancedValue(config, 'innerRadius', 32);
    var outerRadius = GetAdvancedValue(config, 'outerRadius', 64);
    var fillColor = GetAdvancedValue(config, 'fillColor', undefined);
    var fillAlpha = GetAdvancedValue(config, 'fillAlpha', undefined);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    var gameObject = new Star(this.scene, x, y, points, innerRadius, outerRadius, fillColor, fillAlpha);

    if (config.add)
    {
        this.scene.sys.displayList.add(gameObject);
    }

    return gameObject;
});
