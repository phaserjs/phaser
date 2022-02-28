/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BitmapText = require('./BitmapText');
var GameObjectFactory = require('../../GameObjectFactory');

/**
 * Creates a new Bitmap Text Game Object and adds it to the Scene.
 * 
 * BitmapText objects work by taking a texture file and an XML or JSON file that describes the font structure.
 * 
 * During rendering for each letter of the text is rendered to the display, proportionally spaced out and aligned to
 * match the font structure.
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
 * Note: This method will only be available if the Bitmap Text Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#bitmapText
 * @since 3.0.0
 *
 * @param {number} x - The x position of the Game Object.
 * @param {number} y - The y position of the Game Object.
 * @param {string} font - The key of the font to use from the BitmapFont cache.
 * @param {(string|string[])} [text] - The string, or array of strings, to be set as the content of this Bitmap Text.
 * @param {number} [size] - The font size to set.
 * @param {number} [align=0] - The alignment of the text in a multi-line BitmapText object.
 *
 * @return {Phaser.GameObjects.BitmapText} The Game Object that was created.
 */
GameObjectFactory.register('bitmapText', function (x, y, font, text, size, align)
{
    return this.displayList.add(new BitmapText(this.scene, x, y, font, text, size, align));
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
