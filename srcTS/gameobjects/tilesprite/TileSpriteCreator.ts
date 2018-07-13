/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var TileSprite = require('./TileSprite');

/**
 * @typedef {object} TileSprite
 * @extends GameObjectConfig
 *
 * @property {number} [x=0] - The x coordinate of the Tile Sprite.
 * @property {number} [y=0] - The y coordinate of the Tile Sprite.
 * @property {number} [width=512] - The width of the Tile Sprite.
 * @property {number} [height=512] - The height of the Tile Sprite.
 * @property {string} [key=''] - The key of the Texture this Tile Sprite will use to render with, as stored in the Texture Manager.
 * @property {string} [frame=''] - An optional frame from the Texture this Tile Sprite is rendering with.
 */

/**
 * Creates a new TileSprite Game Object and returns it.
 *
 * Note: This method will only be available if the TileSprite Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#tileSprite
 * @since 3.0.0
 *
 * @param {TileSprite} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.TileSprite} The Game Object that was created.
 */
GameObjectCreator.register('tileSprite', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 512);
    var height = GetAdvancedValue(config, 'height', 512);
    var key = GetAdvancedValue(config, 'key', '');
    var frame = GetAdvancedValue(config, 'frame', '');

    var tile = new TileSprite(this.scene, x, y, width, height, key, frame);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, tile, config);

    return tile;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
