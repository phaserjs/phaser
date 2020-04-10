/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BitmapText = require('./BitmapText');
var BuildGameObject = require('../../BuildGameObject');
var GameObjectCreator = require('../../GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');
var GetValue = require('../../../utils/object/GetValue');

/**
 * Creates a new Bitmap Text Game Object and returns it.
 *
 * Note: This method will only be available if the Bitmap Text Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#bitmapText
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.BitmapText.BitmapTextConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 * 
 * @return {Phaser.GameObjects.BitmapText} The Game Object that was created.
 */
GameObjectCreator.register('bitmapText', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var font = GetValue(config, 'font', '');
    var text = GetAdvancedValue(config, 'text', '');
    var size = GetAdvancedValue(config, 'size', false);
    var align = GetValue(config, 'align', 0);

    var bitmapText = new BitmapText(this.scene, 0, 0, font, text, size, align);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, bitmapText, config);

    return bitmapText;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
