/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.Sprite.FACTORY_KEY = 'sprite';

/**
* Create a new Sprite with specific position and sprite sheet key.
*
* At its most basic a Sprite consists of a set of coordinates and a texture that is used when rendered.
* They also contain additional properties allowing for physics motion (via Sprite.body), input handling (via Sprite.input),
* events (via Sprite.events), animation (via Sprite.animations), camera culling and more. Please see the Examples for use cases.
*
* @method Phaser.GameObject.Factory#sprite
* @param {number} [x=0] - The x coordinate of the sprite. The coordinate is relative to any parent container this sprite may be in.
* @param {number} [y=0] - The y coordinate of the sprite. The coordinate is relative to any parent container this sprite may be in.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - The image used as a texture by this display object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
* @param {string|number} [frame] - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. Use either an integer for a Frame ID or a string for a frame name.
* @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
* @return {Phaser.Sprite} The newly created Sprite object.
*/
Phaser.GameObject.Sprite.FACTORY_ADD = function (x, y, key, frame, group)
{
    if (group === undefined) { group = this.state; }

    return group.children.add(new Phaser.GameObject.Sprite(this.state, x, y, key, frame));
};

/**
* Create a new Sprite with specific position and sprite sheet key.
*
* At its most basic a Sprite consists of a set of coordinates and a texture that is used when rendered.
* They also contain additional properties allowing for physics motion (via Sprite.body), input handling (via Sprite.input),
* events (via Sprite.events), animation (via Sprite.animations), camera culling and more. Please see the Examples for use cases.
*
* @method Phaser.GameObject.Factory#sprite
* @param {number} [x=0] - The x coordinate of the sprite. The coordinate is relative to any parent container this sprite may be in.
* @param {number} [y=0] - The y coordinate of the sprite. The coordinate is relative to any parent container this sprite may be in.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - The image used as a texture by this display object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
* @param {string|number} [frame] - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. Use either an integer for a Frame ID or a string for a frame name.
* @return {Phaser.Sprite} The newly created Sprite object.
*/
Phaser.GameObject.Sprite.FACTORY_MAKE = function (x, y, key, frame)
{
    return new Phaser.GameObject.Sprite(this.state, x, y, key, frame);
};
