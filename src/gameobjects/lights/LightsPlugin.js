/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var LightsManager = require('./LightsManager');
var PluginCache = require('../../plugins/PluginCache');
var SceneEvents = require('../../scene/events');

/**
 * @classdesc
 * A Scene plugin that provides a {@link Phaser.GameObjects.LightsManager} for rendering objects with dynamic lighting.
 *
 * Available from within a Scene via `this.lights`.
 *
 * Add Lights using the {@link Phaser.GameObjects.LightsManager#addLight} method:
 *
 * ```javascript
 * // Enable the Lights Manager because it is disabled by default
 * this.lights.enable();
 *
 * // Create a Light at [400, 300] with a radius of 200
 * this.lights.addLight(400, 300, 200);
 * ```
 *
 * For Game Objects to be affected by the Lights when rendered, you will need to set them to use lighting like so:
 *
 * ```javascript
 * sprite.setLighting(true);
 * ```
 *
 * @class LightsPlugin
 * @extends Phaser.GameObjects.LightsManager
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that this Lights Plugin belongs to.
 */
var LightsPlugin = class extends LightsManager {

    constructor(scene)
    {
        /**
         * A reference to the Scene that this Lights Plugin belongs to.
         *
         * @name Phaser.GameObjects.LightsPlugin#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene's systems.
         *
         * @name Phaser.GameObjects.LightsPlugin#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        }

        super();
    }

    /**
     * Boot the Lights Plugin.
     *
     * @method Phaser.GameObjects.LightsPlugin#boot
     * @since 3.0.0
     */
    boot()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.SHUTDOWN, this.shutdown, this);
        eventEmitter.on(SceneEvents.DESTROY, this.destroy, this);
    }

    /**
     * Destroy the Lights Plugin.
     *
     * Cleans up all references.
     *
     * @method Phaser.GameObjects.LightsPlugin#destroy
     * @since 3.0.0
     */
    destroy()
    {
        this.shutdown();

        this.scene = undefined;
        this.systems = undefined;
    }

};

PluginCache.register('LightsPlugin', LightsPlugin, 'lights');

module.exports = LightsPlugin;
