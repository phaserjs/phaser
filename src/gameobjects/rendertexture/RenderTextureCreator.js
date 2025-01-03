/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var RenderTexture = require('./RenderTexture');

/**
 * Creates a new Render Texture Game Object and returns it.
 *
 * Note: This method will only be available if the Render Texture Game Object has been built into Phaser.
 *
 * A Render Texture is a combination of Dynamic Texture and an Image Game Object, that uses the
 * Dynamic Texture to display itself with.
 *
 * A Dynamic Texture is a special texture that allows you to draw textures, frames and most kind of
 * Game Objects directly to it.
 *
 * You can take many complex objects and draw them to this one texture, which can then be used as the
 * base texture for other Game Objects, such as Sprites. Should you then update this texture, all
 * Game Objects using it will instantly be updated as well, reflecting the changes immediately.
 *
 * It's a powerful way to generate dynamic textures at run-time that are WebGL friendly and don't invoke
 * expensive GPU uploads on each change.
 *
 * @method Phaser.GameObjects.GameObjectCreator#renderTexture
 * @since 3.2.0
 *
 * @param {Phaser.Types.GameObjects.RenderTexture.RenderTextureConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.RenderTexture} The Game Object that was created.
 */
GameObjectCreator.register('renderTexture', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 32);
    var height = GetAdvancedValue(config, 'height', 32);

    var renderTexture = new RenderTexture(this.scene, x, y, width, height);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, renderTexture, config);

    return renderTexture;
});
