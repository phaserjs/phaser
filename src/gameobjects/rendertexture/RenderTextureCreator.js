/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var RenderTexture = require('./RenderTexture');

/**
 * @typedef {object} RenderTextureConfig
 *
 * @property {number} [x=0] - The x coordinate of the RenderTexture's position.
 * @property {number} [y=0] - The y coordinate of the RenderTexture's position.
 * @property {number} [width=32] - The width of the RenderTexture.
 * @property {number} [height=32] - The height of the RenderTexture.
 */

/**
 * Creates a new Render Texture Game Object and returns it.
 *
 * Note: This method will only be available if the Render Texture Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#renderTexture
 * @since 3.2.0
 *
 * @param {RenderTextureConfig} config - The configuration object this Game Object will use to create itself.
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
