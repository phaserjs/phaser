/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BitmapText = require('./DynamicBitmapText');
var BuildGameObject = require('../../BuildGameObject');
var GameObjectCreator = require('../../GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');

/**
 * @typedef {object} BitmapTextConfig
 * @extends GameObjectConfig
 *
 * @property {string} [font=''] - [description]
 * @property {string} [text=''] - [description]
 * @property {(number|false)} [size=false] - [description]
 * @property {string} [align=''] - [description]
 */

/**
 * Creates a new Dynamic Bitmap Text Game Object and returns it.
 *
 * Note: This method will only be available if the Dynamic Bitmap Text Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#dynamicBitmapText
 * @since 3.0.0
 *²
 * @param {BitmapTextConfig} config - [description]
 *
 * @return {Phaser.GameObjects.DynamicBitmapText} The Game Object that was created.
 */
GameObjectCreator.register('dynamicBitmapText', function (config)
{
    var font = GetAdvancedValue(config, 'font', '');
    var text = GetAdvancedValue(config, 'text', '');
    var size = GetAdvancedValue(config, 'size', false);
    var align = GetAdvancedValue(config, 'align', 'left');

    var bitmapText = new BitmapText(this.scene, 0, 0, font, text, size, align);

    BuildGameObject(this.scene, bitmapText, config);

    return bitmapText;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
