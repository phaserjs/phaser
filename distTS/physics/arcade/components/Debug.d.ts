/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Debug
 * @since 3.0.0
 */
declare var Debug: {
    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Debug#setDebug
     * @since 3.0.0
     *
     * @param {boolean} showBody - [description]
     * @param {boolean} showVelocity - [description]
     * @param {number} bodyColor - [description]
     *
     * @return {this} This Game Object.
     */
    setDebug: (showBody: any, showVelocity: any, bodyColor: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Debug#setDebugBodyColor
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {this} This Game Object.
     */
    setDebugBodyColor: (value: any) => any;
    /**
     * [description]
     *
     * @name Phaser.Physics.Arcade.Components.Debug#debugShowBody
     * @type {boolean}
     * @since 3.0.0
     */
    debugShowBody: {
        get: () => any;
        set: (value: any) => void;
    };
    /**
     * [description]
     *
     * @name Phaser.Physics.Arcade.Components.Debug#debugShowVelocity
     * @type {boolean}
     * @since 3.0.0
     */
    debugShowVelocity: {
        get: () => any;
        set: (value: any) => void;
    };
    /**
     * [description]
     *
     * @name Phaser.Physics.Arcade.Components.Debug#debugBodyColor
     * @type {number}
     * @since 3.0.0
     */
    debugBodyColor: {
        get: () => any;
        set: (value: any) => void;
    };
};
