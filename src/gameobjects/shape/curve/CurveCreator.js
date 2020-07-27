/**
 * @author       Halil Çakar <hcakar.1992@gmail.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Curve = require('./Curve');
var GameObjectCreator = require('../../GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');

/**
 * Creates a new Curve Game Object and returns it.
 *
 * @param {object} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this
 *     argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Curve} The Game Object that was created.
 */
GameObjectCreator.register('curve', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var curve = GetAdvancedValue(config, 'curve', undefined);
    var fillColor = GetAdvancedValue(config, 'fillColor', undefined);
    var fillAlpha = GetAdvancedValue(config, 'fillAlpha', undefined);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    var gameObject = new Curve(this.scene, x, y, curve, fillColor, fillAlpha);

    if (config.add)
    {
        this.scene.sys.displayList.add(gameObject);
    }

    return gameObject;
});
