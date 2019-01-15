/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var BuildGameObjectAnimation = require('../BuildGameObjectAnimation');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Sprite = require('./Sprite');

/**
 * @typedef {object} SpriteConfig
 * @extends GameObjectConfig
 *
 * @property {string} [key] - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @property {(number|string)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */

/**
 * Creates a new Sprite Game Object and returns it.
 *
 * Note: This method will only be available if the Sprite Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#sprite
 * @since 3.0.0
 *
 * @param {SpriteConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Sprite} The Game Object that was created.
 */
GameObjectCreator.register('sprite', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var sprite = new Sprite(this.scene, 0, 0, key, frame);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, sprite, config);

    //  Sprite specific config options:

    BuildGameObjectAnimation(sprite, config);

    return sprite;
});
