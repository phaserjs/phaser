/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var COLLIDES: any;
declare var SeperateX: (world: any, left: any, right: any, weak: any) => void;
declare var SeperateY: (world: any, top: any, bottom: any, weak: any) => void;
/**
 * Impact Physics Solver
 *
 * @function Phaser.Physics.Impact.Solver
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Impact.World} world - [description]
 * @param {Phaser.Physics.Impact.Body} bodyA - [description]
 * @param {Phaser.Physics.Impact.Body} bodyB - [description]
 */
declare var Solver: (world: any, bodyA: any, bodyB: any) => void;
