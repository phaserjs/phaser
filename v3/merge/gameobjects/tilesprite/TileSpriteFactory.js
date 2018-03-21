/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.TileSprite.FACTORY_KEY = 'tileSprite';

/**
* Creates a new TileSprite object.
*
* @method Phaser.GameObject.Factory#tileSprite
* @param {number} x - The x coordinate of the TileSprite. The coordinate is relative to any parent container this TileSprite may be in.
* @param {number} y - The y coordinate of the TileSprite. The coordinate is relative to any parent container this TileSprite may be in.
* @param {number} width - The width of the TileSprite.
* @param {number} height - The height of the TileSprite.
* @param {string|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the TileSprite during rendering. It can be a string which is a reference to the Phaser Image Cache entry, or an instance of a PIXI.Texture or BitmapData.
* @param {string|number} [frame] - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. Use either an integer for a Frame ID or a string for a frame name.
* @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
* @return {Phaser.TileSprite} The newly created TileSprite object.
*/
Phaser.GameObject.TileSprite.FACTORY_ADD = function (x, y, width, height, key, frame, group)
{
    if (group === undefined) { group = this.world; }

    return group.add(new Phaser.GameObject.TileSprite(this.game, x, y, width, height, key, frame));
};

/**
* Creates a new TileSprite object.
*
* @method Phaser.GameObject.Factory#tileSprite
* @param {number} x - The x coordinate of the TileSprite. The coordinate is relative to any parent container this TileSprite may be in.
* @param {number} y - The y coordinate of the TileSprite. The coordinate is relative to any parent container this TileSprite may be in.
* @param {number} width - The width of the TileSprite.
* @param {number} height - The height of the TileSprite.
* @param {string|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the TileSprite during rendering. It can be a string which is a reference to the Phaser Image Cache entry, or an instance of a PIXI.Texture or BitmapData.
* @param {string|number} [frame] - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. Use either an integer for a Frame ID or a string for a frame name.
* @return {Phaser.TileSprite} The newly created TileSprite object.
*/
Phaser.GameObject.TileSprite.FACTORY_MAKE = function (x, y, width, height, key, frame)
{
    return new Phaser.GameObject.TileSprite(this.game, x, y, width, height, key, frame);
};
