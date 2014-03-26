/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Defines a physics material
*
* @class Phaser.Physics.P2.ContactMaterial
* @classdesc Physics ContactMaterial Constructor
* @constructor
* @param {Phaser.Physics.P2.Material} materialA
* @param {Phaser.Physics.P2.Material} materialB
* @param {object} [options]
*/
Phaser.Physics.P2.ContactMaterial = function (materialA, materialB, options) {

	/**
	* @property {number} id - The contact material identifier.
	*/

	/**
	* @property {Phaser.Physics.P2.Material} materialA - First material participating in the contact material.
	*/

	/**
	* @property {Phaser.Physics.P2.Material} materialB - First second participating in the contact material.
	*/

	/**
	* @property {number} [friction=0.3] - Friction to use in the contact of these two materials.
	*/

	/**
	* @property {number} [restitution=0.0] - Restitution to use in the contact of these two materials.
	*/

	/**
	* @property {number} [stiffness=1e7] - Stiffness of the resulting ContactEquation that this ContactMaterial generate.
	*/

	/**
	* @property {number} [relaxation=3] - Relaxation of the resulting ContactEquation that this ContactMaterial generate.
	*/

	/**
	* @property {number} [frictionStiffness=1e7] - Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
	*/

	/**
	* @property {number} [frictionRelaxation=3] - Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
	*/

	/**
	* @property {number} [surfaceVelocity=0] - Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
	*/

    p2.ContactMaterial.call(this, materialA, materialB, options);

};

Phaser.Physics.P2.ContactMaterial.prototype = Object.create(p2.ContactMaterial.prototype);
Phaser.Physics.P2.ContactMaterial.prototype.constructor = Phaser.Physics.P2.ContactMaterial;
