/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
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
 * @property {string} [font=''] - The key of the font to use from the BitmapFont cache.
 * @property {string} [text=''] - The string, or array of strings, to be set as the content of this Bitmap Text.
 * @property {(number|false)} [size=false] - The font size to set.
 */

/**
 * Creates a new Dynamic Bitmap Text Game Object and returns it.
 *
 * Note: This method will only be available if the Dynamic Bitmap Text Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#dynamicBitmapText
 * @since 3.0.0
 *²
 * @param {BitmapTextConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.DynamicBitmapText} The Game Object that was created.
 */
GameObjectCreator.register('dynamicBitmapText', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var font = GetAdvancedValue(config, 'font', '');
    var text = GetAdvancedValue(config, 'text', '');
    var size = GetAdvancedValue(config, 'size', false);

    var bitmapText = new BitmapText(this.scene, 0, 0, font, text, size);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, bitmapText, config);

    return bitmapText;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
