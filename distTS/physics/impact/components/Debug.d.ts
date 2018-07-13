/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * [description]
 *
 * @name Phaser.Physics.Impact.Components.Debug
 * @since 3.0.0
 */
declare var Debug: {
    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Debug#setDebug
     * @since 3.0.0
     *
     * @param {boolean} showBody - [description]
     * @param {boolean} showVelocity - [description]
     * @param {number} bodyColor - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setDebug: (showBody: any, showVelocity: any, bodyColor: any) => any;
    setDebugBodyColor: (value: any) => any;
    debugShowBody: {
        get: () => any;
        set: (value: any) => void;
    };
    debugShowVelocity: {
        get: () => any;
        set: (value: any) => void;
    };
    debugBodyColor: {
        get: () => any;
        set: (value: any) => void;
    };
};
