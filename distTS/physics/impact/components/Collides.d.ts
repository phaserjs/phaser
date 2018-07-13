/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var COLLIDES: any;
/**
 * @callback CollideCallback
 *
 * @param {Phaser.Physics.Impact.Body} body - [description]
 * @param {Phaser.Physics.Impact.Body} other - [description]
 * @param {string} axis - [description]
 */
/**
 * [description]
 *
 * @name Phaser.Physics.Impact.Components.Collides
 * @since 3.0.0
 */
declare var Collides: {
    _collideCallback: any;
    _callbackScope: any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setCollideCallback
     * @since 3.0.0
     *
     * @param {CollideCallback} callback - [description]
     * @param {*} scope - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCollideCallback: (callback: any, scope: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setCollidesNever
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCollidesNever: () => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setLiteCollision
     * @since 3.6.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setLiteCollision: () => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setPassiveCollision
     * @since 3.6.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setPassiveCollision: () => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setActiveCollision
     * @since 3.6.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setActiveCollision: () => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setFixedCollision
     * @since 3.6.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setFixedCollision: () => any;
    /**
     * [description]
     *
     * @name Phaser.Physics.Impact.Components.Collides#collides
     * @type {number}
     * @since 3.0.0
     */
    collides: {
        get: () => any;
        set: (value: any) => void;
    };
};
