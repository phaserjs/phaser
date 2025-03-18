/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var CaptureFrame = require('./CaptureFrame');

/**
 * Creates a new CaptureFrame Game Object and returns it.
 *
 * Note: This method will only be available if the CaptureFrame Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#captureFrame
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} config - The configuration object this Game Object will use to create itself. CaptureFrame only uses the `key`, `visible`, `depth`, and `add` properties.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.CaptureFrame} The Game Object that was created.
 */
GameObjectCreator.register('captureFrame', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var depth = GetAdvancedValue(config, 'depth', 0);
    var key = GetAdvancedValue(config, 'key', null);
    var visible = GetAdvancedValue(config, 'visible', true);

    var captureFrame = new CaptureFrame(this.scene, key);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }
    
    // This method does not use BuildGameObject, because most of the properties
    // are not settable on a CaptureFrame, and it doesn't render.
    captureFrame
        .setDepth(depth)
        .setVisible(visible);
    if (config.add)
    {
        this.scene.sys.displayList.add(captureFrame);
    }

    return captureFrame;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
