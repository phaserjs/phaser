/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObjects.BitmapText.FACTORY_KEY = 'bitmapText';

/**
* Create a new BitmapText object.
*
* BitmapText objects work by taking a texture file and an XML file that describes the font structure.
* It then generates a new Sprite object for each letter of the text, proportionally spaced out and aligned to 
* match the font structure.
* 
* BitmapText objects are less flexible than Text objects, in that they have less features such as shadows, fills and the ability 
* to use Web Fonts. However you trade this flexibility for pure rendering speed. You can also create visually compelling BitmapTexts by 
* processing the font texture in an image editor first, applying fills and any other effects required.
*
* To create multi-line text insert \r, \n or \r\n escape codes into the text string.
*
* To create a BitmapText data files you can use:
*
* BMFont (Windows, free): http://www.angelcode.com/products/bmfont/
* Glyph Designer (OS X, commercial): http://www.71squared.com/en/glyphdesigner
* Littera (Web-based, free): http://kvazars.com/littera/
*
* @method Phaser.GameObjects.Factory#bitmapText
* @param {number} x - X coordinate to display the BitmapText object at.
* @param {number} y - Y coordinate to display the BitmapText object at.
* @param {string} font - The key of the BitmapText as stored in Phaser.Cache.
* @param {string} [text=''] - The text that will be rendered. This can also be set later via BitmapText.text.
* @param {number} [size=32] - The size the font will be rendered at in pixels.
* @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
* @return {Phaser.BitmapText} The newly created bitmapText object.
*/
Phaser.GameObjects.BitmapText.FACTORY_ADD = function (x, y, font, text, size, group) {

    if (group === undefined) { group = this.world; }

    return group.add(new Phaser.GameObjects.BitmapText(this.game, x, y, font, text, size));

};

Phaser.GameObjects.BitmapText.FACTORY_MAKE = function (x, y, font, text, size) {

    return new Phaser.GameObjects.BitmapText(this.game, x, y, font, text, size));

};
