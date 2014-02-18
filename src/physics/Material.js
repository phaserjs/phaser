/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* \o/ ~ "Because I'm a Material girl"
*
* @class Phaser.Physics.Material
* @classdesc Physics Material Constructor
* @constructor
*/
Phaser.Physics.Material = function () {

    p2.Material.call(this);

}

Phaser.Physics.Material.prototype = Object.create(p2.Material.prototype);
Phaser.Physics.Material.prototype.constructor = Phaser.Physics.Material;
