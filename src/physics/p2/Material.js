/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* \o/ ~ "Because I'm a Material girl"
*
* @class Phaser.Physics.P2.Material
* @classdesc Physics Material Constructor
* @constructor
*/
Phaser.Physics.P2.Material = function (name) {

    /**
    * @property {string} name - The user defined name given to this Material.
    * @default
    */
    this.name = name;

    p2.Material.call(this);

};

Phaser.Physics.P2.Material.prototype = Object.create(p2.Material.prototype);
Phaser.Physics.P2.Material.prototype.constructor = Phaser.Physics.P2.Material;
