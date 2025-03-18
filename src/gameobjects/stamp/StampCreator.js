/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Stamp = require('./Stamp');

/**
 * Creates a new Stamp Game Object and returns it.
 *
 * Note: This method will only be available if the Stamp Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#stamp
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Stamp} The Game Object that was created.
 */
GameObjectCreator.register('stamp', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var stamp = new Stamp(this.scene, 0, 0, key, frame);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, stamp, config);

    return stamp;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
