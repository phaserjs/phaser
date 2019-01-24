/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Text = require('./Text');
var GameObjectFactory = require('../../GameObjectFactory');

/**
 * Creates a new Text Game Object and adds it to the Scene.
 * 
 * A Text Game Object.
 * 
 * Text objects work by creating their own internal hidden Canvas and then renders text to it using
 * the standard Canvas `fillText` API. It then creates a texture from this canvas which is rendered
 * to your game during the render pass.
 * 
 * Because it uses the Canvas API you can take advantage of all the features this offers, such as
 * applying gradient fills to the text, or strokes, shadows and more. You can also use custom fonts
 * loaded externally, such as Google or TypeKit Web fonts.
 *
 * You can only display fonts that are currently loaded and available to the browser: therefore fonts must
 * be pre-loaded. Phaser does not do ths for you, so you will require the use of a 3rd party font loader,
 * or have the fonts ready available in the CSS on the page in which your Phaser game resides.
 *
 * See {@link http://www.jordanm.co.uk/tinytype this compatibility table} for the available default fonts
 * across mobile browsers.
 * 
 * A note on performance: Every time the contents of a Text object changes, i.e. changing the text being
 * displayed, or the style of the text, it needs to remake the Text canvas, and if on WebGL, re-upload the
 * new texture to the GPU. This can be an expensive operation if used often, or with large quantities of
 * Text objects in your game. If you run into performance issues you would be better off using Bitmap Text
 * instead, as it benefits from batching and avoids expensive Canvas API calls.
 *
 * Note: This method will only be available if the Text Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#text
 * @since 3.0.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|string[])} text - The text this Text object will display.
 * @param {object} [style] - The Text style configuration object.
 *
 * @return {Phaser.GameObjects.Text} The Game Object that was created.
 */
GameObjectFactory.register('text', function (x, y, text, style)
{
    return this.displayList.add(new Text(this.scene, x, y, text, style));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
