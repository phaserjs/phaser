/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var CaptureFrame = require('./CaptureFrame');

/**
 * Creates a new CaptureFrame Game Object and returns it.
 *
 * A CaptureFrame is a special Game Object that captures the current state of the WebGL framebuffer
 * at the point it is rendered in the display list. Objects rendered before it are captured to a
 * named texture; objects rendered after it are not. This is useful for full-scene post-processing
 * effects such as a layer of water or a distortion overlay. The captured texture can then be
 * referenced by key and used on other Game Objects or filters.
 *
 * This is a WebGL-only feature and has no effect in Canvas mode. The Camera must have
 * `forceComposite` enabled, or the CaptureFrame must be used within a framebuffer context
 * (such as a Filter, DynamicTexture, or a Camera with alpha between 0 and 1).
 *
 * Note: This method will only be available if the CaptureFrame Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#captureFrame
 * @since 4.0.0
 *
 * @param {Phaser.Types.GameObjects.GameObjectConfig} config - The configuration object this Game Object will use to create itself. CaptureFrame only uses the `key`, `visible`, `depth`, and `add` properties.
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
