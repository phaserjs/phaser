/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DynamicBitmapText = require('./DynamicBitmapText');
var GameObjectFactory = require('../../GameObjectFactory');

/**
 * Creates a new Dynamic Bitmap Text Game Object and adds it to the Scene.
 * 
 * BitmapText objects work by taking a texture file and an XML or JSON file that describes the font structure.
 * 
 * During rendering for each letter of the text is rendered to the display, proportionally spaced out and aligned to
 * match the font structure.
 * 
 * Dynamic Bitmap Text objects are different from Static Bitmap Text in that they invoke a callback for each
 * letter being rendered during the render pass. This callback allows you to manipulate the properties of
 * each letter being rendered, such as its position, scale or tint, allowing you to create interesting effects
 * like jiggling text, which can't be done with Static text. This means that Dynamic Text takes more processing
 * time, so only use them if you require the callback ability they have.
 *
 * BitmapText objects are less flexible than Text objects, in that they have less features such as shadows, fills and the ability
 * to use Web Fonts, however you trade this flexibility for rendering speed. You can also create visually compelling BitmapTexts by
 * processing the font texture in an image editor, applying fills and any other effects required.
 *
 * To create multi-line text insert \r, \n or \r\n escape codes into the text string.
 *
 * To create a BitmapText data files you need a 3rd party app such as:
 *
 * BMFont (Windows, free): http://www.angelcode.com/products/bmfont/
 * Glyph Designer (OS X, commercial): http://www.71squared.com/en/glyphdesigner
 * Littera (Web-based, free): http://kvazars.com/littera/
 *
 * For most use cases it is recommended to use XML. If you wish to use JSON, the formatting should be equal to the result of
 * converting a valid XML file through the popular X2JS library. An online tool for conversion can be found here: http://codebeautify.org/xmltojson
 *
 * Note: This method will only be available if the Dynamic Bitmap Text Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#dynamicBitmapText
 * @since 3.0.0
 *
 * @param {number} x - The x position of the Game Object.
 * @param {number} y - The y position of the Game Object.
 * @param {string} font - The key of the font to use from the BitmapFont cache.
 * @param {(string|string[])} [text] - The string, or array of strings, to be set as the content of this Bitmap Text.
 * @param {number} [size] - The font size to set.
 *
 * @return {Phaser.GameObjects.DynamicBitmapText} The Game Object that was created.
 */
GameObjectFactory.register('dynamicBitmapText', function (x, y, font, text, size)
{
    return this.displayList.add(new DynamicBitmapText(this.scene, x, y, font, text, size));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
