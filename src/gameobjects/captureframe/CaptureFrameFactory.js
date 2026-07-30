/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CaptureFrame = require('./CaptureFrame');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new CaptureFrame Game Object and adds it to the Scene.
 *
 * A CaptureFrame captures the current state of the WebGL framebuffer at the point it is rendered
 * in the display list, storing the result as a texture identified by the given key. Other Game Objects
 * can then reference this key to display or process the captured image. This is useful for
 * full-scene post-processing effects such as water reflections or screen-space distortions.
 *
 * This is a WebGL only feature and will not work in Canvas mode. The Camera must have
 * `forceComposite` enabled, or the CaptureFrame must be rendered within a framebuffer context
 * (such as a Filter, DynamicTexture, or a Camera with a non-default alpha value).
 *
 * Note: This method will only be available if the CaptureFrame Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#captureFrame
 * @since 4.0.0
 *
 * @param {string} key - The key under which the captured texture will be stored. Other Game Objects can use this key to reference the captured frame.
 *
 * @return {Phaser.GameObjects.CaptureFrame} The Game Object that was created.
 */
GameObjectFactory.register('captureFrame', function (key)
{
    return this.displayList.add(new CaptureFrame(this.scene, key));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
