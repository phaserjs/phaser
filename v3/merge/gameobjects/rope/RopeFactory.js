/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.Rope.FACTORY_KEY = 'rope';

/**
* Creates a new Rope object.
*
* Example usage: https://github.com/codevinsky/phaser-rope-demo/blob/master/dist/demo.js
*
* @method Phaser.GameObject.Factory#rope
* @param {number} [x=0] - The x coordinate of the Rope. The coordinate is relative to any parent container this rope may be in.
* @param {number} [y=0] - The y coordinate of the Rope. The coordinate is relative to any parent container this rope may be in.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - The image used as a texture by this display object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
* @param {string|number} [frame] - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. Use either an integer for a Frame ID or a string for a frame name.
* @param {Array} [points] - An array of {Phaser.Point}.
* @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
* @return {Phaser.Rope} The newly created Rope object.
*/
Phaser.GameObject.Rope.FACTORY_ADD = function (x, y, key, frame, points, group)
{
    if (group === undefined) { group = this.world; }

    return group.add(new Phaser.GameObject.Rope(this.game, x, y, key, frame, points));
};

/**
* Creates a new Rope object.
*
* @method Phaser.GameObjectCreator#rope
* @param {number} [x=0] - The x coordinate of the Rope. The coordinate is relative to any parent container this rope may be in.
* @param {number} [y=0] - The y coordinate of the Rope. The coordinate is relative to any parent container this rope may be in.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - The image used as a texture by this display object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
* @param {string|number} [frame] - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. Use either an integer for a Frame ID or a string for a frame name.
* @param {Array} [points] - An array of {Phaser.Point}.
* @return {Phaser.Rope} The newly created rope object.
*/
Phaser.GameObject.Rope.FACTORY_MAKE = function (x, y, key, frame, points)
{
    return new Phaser.GameObject.Rope(this.game, x, y, key, frame, points);
};
