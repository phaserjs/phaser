/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Scene consts.
 *
 * @ignore
 */

var CONST = {

    /**
     * Scene has been added to the Scene Manager but has not yet been started or initialized.
     *
     * @name Phaser.Scenes.PENDING
     * @readonly
     * @type {number}
     * @since 3.0.0
     */
    PENDING: 0,

    /**
     * Scene is currently being initialized by the Scene Manager. The init method is being called.
     *
     * @name Phaser.Scenes.INIT
     * @readonly
     * @type {number}
     * @since 3.0.0
     */
    INIT: 1,

    /**
     * Scene is starting up. The create method has not yet been called.
     *
     * @name Phaser.Scenes.START
     * @readonly
     * @type {number}
     * @since 3.0.0
     */
    START: 2,

    /**
     * Scene is loading assets via its Loader Plugin. The create method will be called after loading completes.
     *
     * @name Phaser.Scenes.LOADING
     * @readonly
     * @type {number}
     * @since 3.0.0
     */
    LOADING: 3,

    /**
     * Scene is executing its create method.
     *
     * @name Phaser.Scenes.CREATING
     * @readonly
     * @type {number}
     * @since 3.0.0
     */
    CREATING: 4,

    /**
     * Scene is fully running. Both the update and render methods are being called each frame.
     *
     * @name Phaser.Scenes.RUNNING
     * @readonly
     * @type {number}
     * @since 3.0.0
     */
    RUNNING: 5,

    /**
     * Scene has been paused via the Scene Manager or Scene Plugin. The update method is not being called, but the scene is still rendering.
     *
     * @name Phaser.Scenes.PAUSED
     * @readonly
     * @type {number}
     * @since 3.0.0
     */
    PAUSED: 6,

    /**
     * Scene has been put to sleep. Neither the update nor the render methods are being called, but the scene is not shut down.
     *
     * @name Phaser.Scenes.SLEEPING
     * @readonly
     * @type {number}
     * @since 3.0.0
     */
    SLEEPING: 7,

    /**
     * Scene is being shut down. All Game Objects and plugins belonging to it are being destroyed.
     *
     * @name Phaser.Scenes.SHUTDOWN
     * @readonly
     * @type {number}
     * @since 3.0.0
     */
    SHUTDOWN: 8,

    /**
     * Scene has been fully destroyed. It can no longer be started or used.
     *
     * @name Phaser.Scenes.DESTROYED
     * @readonly
     * @type {number}
     * @since 3.0.0
     */
    DESTROYED: 9

};

module.exports = CONST;
