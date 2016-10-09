/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.RetroFont.FACTORY_KEY = 'retroFont';

/**
* Create a new RetroFont object.
*
* A RetroFont can be used as a texture for an Image or Sprite and optionally add it to the Cache.
* A RetroFont uses a bitmap which contains fixed with characters for the font set. You use character spacing to define the set.
* If you need variable width character support then use a BitmapText object instead. The main difference between a RetroFont and a BitmapText
* is that a RetroFont creates a single texture that you can apply to a game object, where-as a BitmapText creates one Sprite object per letter of text.
* The texture can be asssigned or one or multiple images/sprites, but note that the text the RetroFont uses will be shared across them all,
* i.e. if you need each Image to have different text in it, then you need to create multiple RetroFont objects.
*
* @method Phaser.GameObject.Factory#retroFont
* @param {string} font - The key of the image in the Game.Cache that the RetroFont will use.
* @param {number} characterWidth - The width of each character in the font set.
* @param {number} characterHeight - The height of each character in the font set.
* @param {string} chars - The characters used in the font set, in display order. You can use the TEXT_SET consts for common font set arrangements.
* @param {number} charsPerRow - The number of characters per row in the font set.
* @param {number} [xSpacing=0] - If the characters in the font set have horizontal spacing between them set the required amount here.
* @param {number} [ySpacing=0] - If the characters in the font set have vertical spacing between them set the required amount here.
* @param {number} [xOffset=0] - If the font set doesn't start at the top left of the given image, specify the X coordinate offset here.
* @param {number} [yOffset=0] - If the font set doesn't start at the top left of the given image, specify the Y coordinate offset here.
* @return {Phaser.RetroFont} The newly created RetroFont texture which can be applied to an Image or Sprite.
*/
Phaser.GameObject.RetroFont.FACTORY_ADD = function (font, characterWidth, characterHeight, chars, charsPerRow, xSpacing, ySpacing, xOffset, yOffset)
{
    return new Phaser.GameObject.RetroFont(this.game, font, characterWidth, characterHeight, chars, charsPerRow, xSpacing, ySpacing, xOffset, yOffset);
};

/**
* Create a new RetroFont object.
*
* A RetroFont can be used as a texture for an Image or Sprite and optionally add it to the Cache.
* A RetroFont uses a bitmap which contains fixed with characters for the font set. You use character spacing to define the set.
* If you need variable width character support then use a BitmapText object instead. The main difference between a RetroFont and a BitmapText
* is that a RetroFont creates a single texture that you can apply to a game object, where-as a BitmapText creates one Sprite object per letter of text.
* The texture can be asssigned or one or multiple images/sprites, but note that the text the RetroFont uses will be shared across them all,
* i.e. if you need each Image to have different text in it, then you need to create multiple RetroFont objects.
*
* @method Phaser.GameObjectCreator#retroFont
* @param {string} font - The key of the image in the Game.Cache that the RetroFont will use.
* @param {number} characterWidth - The width of each character in the font set.
* @param {number} characterHeight - The height of each character in the font set.
* @param {string} chars - The characters used in the font set, in display order. You can use the TEXT_SET consts for common font set arrangements.
* @param {number} charsPerRow - The number of characters per row in the font set.
* @param {number} [xSpacing=0] - If the characters in the font set have horizontal spacing between them set the required amount here.
* @param {number} [ySpacing=0] - If the characters in the font set have vertical spacing between them set the required amount here.
* @param {number} [xOffset=0] - If the font set doesn't start at the top left of the given image, specify the X coordinate offset here.
* @param {number} [yOffset=0] - If the font set doesn't start at the top left of the given image, specify the Y coordinate offset here.
* @return {Phaser.RetroFont} The newly created RetroFont texture which can be applied to an Image or Sprite.
*/
Phaser.GameObject.RetroFont.FACTORY_MAKE = function (font, characterWidth, characterHeight, chars, charsPerRow, xSpacing, ySpacing, xOffset, yOffset)
{
    return new Phaser.GameObject.RetroFont(this.game, font, characterWidth, characterHeight, chars, charsPerRow, xSpacing, ySpacing, xOffset, yOffset);
};
