/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Body: any;
/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Force
 * @since 3.0.0
 */
declare var Force: {
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Force#applyForce
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} force - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    applyForce: (force: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Force#applyForceFrom
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} position - [description]
     * @param {Phaser.Math.Vector2} force - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    applyForceFrom: (position: any, force: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Force#thrust
     * @since 3.0.0
     *
     * @param {number} speed - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    thrust: (speed: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Force#thrustLeft
     * @since 3.0.0
     *
     * @param {number} speed - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    thrustLeft: (speed: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Force#thrustRight
     * @since 3.0.0
     *
     * @param {number} speed - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    thrustRight: (speed: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Force#thrustBack
     * @since 3.0.0
     *
     * @param {number} speed - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    thrustBack: (speed: any) => any;
};
