/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.Creature.FACTORY_KEY = 'creature';

/**
* Create a new Creature Animation object.
*
* Creature is a custom Game Object used in conjunction with the Creature Runtime libraries by Kestrel Moon Studios.
* 
* It allows you to display animated Game Objects that were created with the [Creature Automated Animation Tool](http://www.kestrelmoon.com/creature/).
* 
* Note 1: You can only use Phaser.Creature objects in WebGL enabled games. They do not work in Canvas mode games.
*
* Note 2: You must use a build of Phaser that includes the CreatureMeshBone.js runtime and gl-matrix.js, or have them
* loaded before your Phaser game boots.
* 
* See the Phaser custom build process for more details.
*
* @method Phaser.GameObject.Factory#creature
* @param {number} [x=0] - The x coordinate of the creature. The coordinate is relative to any parent container this creature may be in.
* @param {number} [y=0] - The y coordinate of the creature. The coordinate is relative to any parent container this creature may be in.
* @param {string|PIXI.Texture} [key] - The image used as a texture by this creature object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a PIXI.Texture.
* @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
* @return {Phaser.Creature} The newly created Sprite object.
*/
Phaser.GameObject.Creature.FACTORY_ADD = function (x, y, key, mesh, group)
{
    if (group === undefined) { group = this.world; }

    var obj = new Phaser.GameObject.Creature(this.game, x, y, key, mesh);

    group.add(obj);

    return obj;
};

/**
* Create a new Creature Animation object.
*
* Creature is a custom Game Object used in conjunction with the Creature Runtime libraries by Kestrel Moon Studios.
* 
* It allows you to display animated Game Objects that were created with the [Creature Automated Animation Tool](http://www.kestrelmoon.com/creature/).
* 
* Note 1: You can only use Phaser.Creature objects in WebGL enabled games. They do not work in Canvas mode games.
*
* Note 2: You must use a build of Phaser that includes the CreatureMeshBone.js runtime and gl-matrix.js, or have them
* loaded before your Phaser game boots.
* 
* See the Phaser custom build process for more details.
*
* @method Phaser.GameObject.Factory#creature
* @param {number} [x=0] - The x coordinate of the creature. The coordinate is relative to any parent container this creature may be in.
* @param {number} [y=0] - The y coordinate of the creature. The coordinate is relative to any parent container this creature may be in.
* @param {string|PIXI.Texture} [key] - The image used as a texture by this creature object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a PIXI.Texture.
* @return {Phaser.Creature} The newly created Sprite object.
*/
Phaser.GameObject.Creature.FACTORY_MAKE = function (x, y, key, mesh)
{
    return new Phaser.GameObject.Creature(this.game, x, y, key, mesh);
};
