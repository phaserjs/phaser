/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Enable
 * @since 3.0.0
 */
declare var Enable: {
    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Enable#enableBody
     * @since 3.0.0
     *
     * @param {boolean} reset - [description]
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {boolean} enableGameObject - [description]
     * @param {boolean} showGameObject - [description]
     *
     * @return {this} This Game Object.
     */
    enableBody: (reset: any, x: any, y: any, enableGameObject: any, showGameObject: any) => any;
    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Enable#disableBody
     * @since 3.0.0
     *
     * @param {boolean} [disableGameObject=false] - [description]
     * @param {boolean} [hideGameObject=false] - [description]
     *
     * @return {this} This Game Object.
     */
    disableBody: (disableGameObject: any, hideGameObject: any) => any;
    /**
     * Syncs the Bodies position and size with its parent Game Object.
     * You don't need to call this for Dynamic Bodies, as it happens automatically.
     * But for Static bodies it's a useful way of modifying the position of a Static Body
     * in the Physics World, based on its Game Object.
     *
     * @method Phaser.Physics.Arcade.Components.Enable#refreshBody
     * @since 3.1.0
     *
     * @return {this} This Game Object.
     */
    refreshBody: () => any;
};
