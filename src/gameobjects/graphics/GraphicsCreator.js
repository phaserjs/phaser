/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectCreator = require('../GameObjectCreator');
var Graphics = require('./Graphics');

/**
 * Creates a new Graphics Game Object and returns it.
 *
 * Note: This method will only be available if the Graphics Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#graphics
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Graphics.Options} [config] - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Graphics} The Game Object that was created.
 */
GameObjectCreator.register('graphics', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    var graphics = new Graphics(this.scene, config);

    if (config.add)
    {
        this.scene.sys.displayList.add(graphics);
    }

    return graphics;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
