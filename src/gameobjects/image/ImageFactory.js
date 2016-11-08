/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.Image.FACTORY_KEY = 'image';

/**
* Create a new `Image` object.
*
* An Image is a light-weight object you can use to display anything that doesn't need physics or animation.
*
* It can still rotate, scale, crop and receive input events.
* This makes it perfect for logos, backgrounds, simple buttons and other non-Sprite graphics.
*
* @method Phaser.GameObject.Factory#image
* @param {number} [x=0] - The x coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
* @param {number} [y=0] - The y coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - The image used as a texture by this display object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
* @param {string|number} [frame] - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. Use either an integer for a Frame ID or a string for a frame name.
* @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
* @return {Phaser.Image} The newly created Image object.
*/
Phaser.GameObject.Image.FACTORY_ADD = function (x, y, key, frame, group, name)
{
    if (group === undefined) { group = this.state; }

    return group.children.add(new Phaser.GameObject.Image(this.state, x, y, key, frame, name));
};

/**
* Create a new Image object.
*
* An Image is a light-weight object you can use to display anything that doesn't need physics or animation.
* It can still rotate, scale, crop and receive input events. This makes it perfect for logos, backgrounds, simple buttons and other non-Sprite graphics.
*
* @method Phaser.GameObjectCreator#image
* @param {number} x - X position of the image.
* @param {number} y - Y position of the image.
* @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
* @return {Phaser.Image} the newly created sprite object.
*/
Phaser.GameObject.Image.FACTORY_MAKE = function (x, y, key, frame)
{
    return new Phaser.GameObject.Image(this.state, x, y, key, frame);
};
