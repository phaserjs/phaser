/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
 * @method Phaser.GameObjects.GameObjectCreator#renderTexture
 * @since 3.2.0
 *
 * @param {object} config - [description]
 *
 * @return {Phaser.GameObjects.RenderTexture} The Game Object that was created.
 */
GameObjectCreator.register('renderTexture', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 32);
    var height = GetAdvancedValue(config, 'height', 32);
    var renderTexture = new RenderTexture(this.scene, x, y, width, height);

    BuildGameObject(this.scene, renderTexture, config);

    return renderTexture;
});
