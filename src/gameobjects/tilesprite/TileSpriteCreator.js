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
 * Creates a new TileSprite Game Object and returns it.
 *
 * Note: This method will only be available if the TileSprite Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#tileSprite
 * @since 3.0.0
 *
 * @param {object} config - [description]
 *
 * @return {Phaser.GameObjects.TileSprite} The Game Object that was created.
 */
GameObjectCreator.register('tileSprite', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 512);
    var height = GetAdvancedValue(config, 'height', 512);
    var key = GetAdvancedValue(config, 'key', '');
    var frame = GetAdvancedValue(config, 'frame', '');

    var tile = new TileSprite(this.scene, x, y, width, height, key, frame);

    BuildGameObject(this.scene, tile, config);

    return tile;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
