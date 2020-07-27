/**
 * @author       Halil Çakar <hcakar.1992@gmail.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Ellipse = require('./Ellipse');
var GameObjectCreator = require('../../GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');

/**
 * Creates a new Ellipse Game Object and returns it.
 *
 * @param {object} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this
 *     argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Ellipse} The Game Object that was created.
 */
GameObjectCreator.register('ellipse', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 128);
    var height = GetAdvancedValue(config, 'height', 128);
    var fillColor = GetAdvancedValue(config, 'fillColor', undefined);
    var fillAlpha = GetAdvancedValue(config, 'fillAlpha', undefined);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    var gameObject = new Ellipse(this.scene, x, y, width, height, fillColor, fillAlpha);

    if (config.add)
    {
        this.scene.sys.displayList.add(gameObject);
    }

    return gameObject;
});
