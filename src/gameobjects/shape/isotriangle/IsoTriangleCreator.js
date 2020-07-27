/**
 * @author       Halil Çakar <hcakar.1992@gmail.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var IsoTriangle = require('./IsoTriangle');
var GameObjectCreator = require('../../GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');

/**
 * Creates a new IsoTriangle Game Object and returns it.
 *
 * @param {object} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this
 *     argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.IsoTriangle} The Game Object that was created.
 */
GameObjectCreator.register('isotriangle', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var size = GetAdvancedValue(config, 'size', 48);
    var height = GetAdvancedValue(config, 'height', 32);
    var reversed = GetAdvancedValue(config, 'reversed', false);
    var fillTop = GetAdvancedValue(config, 'fillTop', 0xeeeeee);
    var fillLeft = GetAdvancedValue(config, 'fillLeft', 0x999999);
    var fillRight = GetAdvancedValue(config, 'fillRight', 0xcccccc);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    var gameObject = new IsoTriangle(this.scene, x, y, size, height, reversed, fillTop, fillLeft, fillRight);

    if (config.add)
    {
        this.scene.sys.displayList.add(gameObject);
    }

    return gameObject;
});
