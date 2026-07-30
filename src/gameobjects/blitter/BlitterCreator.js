/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Blitter = require('./Blitter');
var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');

/**
 * Creates a new Blitter Game Object and returns it.
 *
 * A Blitter is a highly efficient Game Object for rendering large numbers of Bob objects, all of which
 * share the same texture. Unlike using individual Game Objects, a Blitter batches all of its Bobs into
 * a single draw call, making it ideal for particle-like effects, crowds, bullet pools, or any scenario
 * where you need many instances of the same image rendered with minimal overhead.
 *
 * Note: This method will only be available if the Blitter Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#blitter
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} config - The configuration object this Game Object will use to create itself. The `key` property identifies the texture to use, and the optional `frame` property identifies a specific frame within that texture.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Blitter} The Game Object that was created.
 */
GameObjectCreator.register('blitter', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var blitter = new Blitter(this.scene, 0, 0, key, frame);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, blitter, config);

    return blitter;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
