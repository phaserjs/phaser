/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.PixelField.FACTORY_KEY = 'pixelField';

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
* @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
* @return {Phaser.Image} The newly created Image object.
*/
Phaser.GameObject.PixelField.FACTORY_ADD = function (x, y, pixelSize, group)
{
    if (group === undefined) { group = this.state; }

    return group.children.add(new Phaser.GameObject.PixelField(this.state, x, y, pixelSize));
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
* @return {Phaser.Image} the newly created sprite object.
*/
Phaser.GameObject.PixelField.FACTORY_MAKE = function (x, y, pixelSize)
{
    return new Phaser.GameObject.PixelField(this.state, x, y, pixelSize);
};
