/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Camera = require('./Camera');
var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var PluginCache = require('../../plugins/PluginCache');
var RectangleContains = require('../../geom/rectangle/Contains');
var ScaleEvents = require('../../scale/events');
var SceneEvents = require('../../scene/events');

/**
 * @classdesc
 * The Camera Manager is a plugin that belongs to a Scene and is responsible for managing all of the Scene Cameras.
 * 
 * By default you can access the Camera Manager from within a Scene using `this.cameras`, although this can be changed
 * in your game config.
 * 
 * Create new Cameras using the `add` method. Or extend the Camera class with your own addition code and then add
 * the new Camera in using the `addExisting` method.
 * 
 * Cameras provide a view into your game world, and can be positioned, rotated, zoomed and scrolled accordingly.
 *
 * A Camera consists of two elements: The viewport and the scroll values.
 *
 * The viewport is the physical position and size of the Camera within your game. Cameras, by default, are
 * created the same size as your game, but their position and size can be set to anything. This means if you
 * wanted to create a camera that was 320x200 in size, positioned in the bottom-right corner of your game,
 * you'd adjust the viewport to do that (using methods like `setViewport` and `setSize`).
 *
 * If you wish to change where the Camera is looking in your game, then you scroll it. You can do this
 * via the properties `scrollX` and `scrollY` or the method `setScroll`. Scrolling has no impact on the
 * viewport, and changing the viewport has no impact on the scrolling.
 *
 * By default a Camera will render all Game Objects it can see. You can change this using the `ignore` method,
 * allowing you to filter Game Objects out on a per-Camera basis. The Camera Manager can manage up to 31 unique 
 * 'Game Object ignore capable' Cameras. Any Cameras beyond 31 that you create will all be given a Camera ID of
 * zero, meaning that they cannot be used for Game Object exclusion. This means if you need your Camera to ignore
 * Game Objects, make sure it's one of the first 31 created.
 *
 * A Camera also has built-in special effects including Fade, Flash, Camera Shake, Pan and Zoom.
 *
 * @class CameraManager
 * @memberof Phaser.Cameras.Scene2D
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that owns the Camera Manager plugin.
 */
var CameraManager = new Class({

    initialize:

    function CameraManager (scene)
    {
        /**
         * The Scene that owns the Camera Manager plugin.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene.Systems handler for the Scene that owns the Camera Manager.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        /**
         * All Cameras created by, or added to, this Camera Manager, will have their `roundPixels`
         * property set to match this value. By default it is set to match the value set in the
         * game configuration, but can be changed at any point. Equally, individual cameras can
         * also be changed as needed.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#roundPixels
         * @type {boolean}
         * @since 3.11.0
         */
        this.roundPixels = scene.sys.game.config.roundPixels;

        /**
         * An Array of the Camera objects being managed by this Camera Manager.
         * The Cameras are updated and rendered in the same order in which they appear in this array.
         * Do not directly add or remove entries to this array. However, you can move the contents
         * around the array should you wish to adjust the display order.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#cameras
         * @type {Phaser.Cameras.Scene2D.Camera[]}
         * @since 3.0.0
         */
        this.cameras = [];

        /**
         * A handy reference to the 'main' camera. By default this is the first Camera the
         * Camera Manager creates. You can also set it directly, or use the `makeMain` argument
         * in the `add` and `addExisting` methods. It allows you to access it from your game:
         * 
         * ```javascript
         * var cam = this.cameras.main;
         * ```
         * 
         * Also see the properties `camera1`, `camera2` and so on.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#main
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @since 3.0.0
         */
        this.main;

        /**
         * A default un-transformed Camera that doesn't exist on the camera list and doesn't
         * count towards the total number of cameras being managed. It exists for other
         * systems, as well as your own code, should they require a basic un-transformed
         * camera instance from which to calculate a view matrix.
         *
         * @name Phaser.Cameras.Scene2D.CameraManager#default
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @since 3.17.0
         */
        this.default;

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        scene.sys.events.on(SceneEvents.START, this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#boot
     * @private
     * @listens Phaser.Scenes.Events#DESTROY
     * @since 3.5.1
     */
    boot: function ()
    {
        var sys = this.systems;

        if (sys.settings.cameras)
        {
            //  We have cameras to create
            this.fromJSON(sys.settings.cameras);
        }
        else
        {
            //  Make one
            this.add();
        }

        this.main = this.cameras[0];

        //  Create a default camera
        this.default = new Camera(0, 0, sys.scale.width, sys.scale.height).setScene(this.scene);

        sys.game.scale.on(ScaleEvents.RESIZE, this.onResize, this);

        this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#start
     * @private
     * @listens Phaser.Scenes.Events#UPDATE
     * @listens Phaser.Scenes.Events#SHUTDOWN
     * @since 3.5.0
     */
    start: function ()
    {
        if (!this.main)
        {
            var sys = this.systems;

            if (sys.settings.cameras)
            {
                //  We have cameras to create
                this.fromJSON(sys.settings.cameras);
            }
            else
            {
                //  Make one
                this.add();
            }
    
            this.main = this.cameras[0];
        }

        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.UPDATE, this.update, this);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * Adds a new Camera into the Camera Manager. The Camera Manager can support up to 31 different Cameras.
     * 
     * Each Camera has its own viewport, which controls the size of the Camera and its position within the canvas.
     * 
     * Use the `Camera.scrollX` and `Camera.scrollY` properties to change where the Camera is looking, or the
     * Camera methods such as `centerOn`. Cameras also have built in special effects, such as fade, flash, shake,
     * pan and zoom.
     * 
     * By default Cameras are transparent and will render anything that they can see based on their `scrollX`
     * and `scrollY` values. Game Objects can be set to be ignored by a Camera by using the `Camera.ignore` method.
     * 
     * The Camera will have its `roundPixels` property set to whatever `CameraManager.roundPixels` is. You can change
     * it after creation if required.
     * 
     * See the Camera class documentation for more details.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#add
     * @since 3.0.0
     *
     * @param {integer} [x=0] - The horizontal position of the Camera viewport.
     * @param {integer} [y=0] - The vertical position of the Camera viewport.
     * @param {integer} [width] - The width of the Camera viewport. If not given it'll be the game config size.
     * @param {integer} [height] - The height of the Camera viewport. If not given it'll be the game config size.
     * @param {boolean} [makeMain=false] - Set this Camera as being the 'main' camera. This just makes the property `main` a reference to it.
     * @param {string} [name=''] - The name of the Camera.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} The newly created Camera.
     */
    add: function (x, y, width, height, makeMain, name)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.scene.sys.scale.width; }
        if (height === undefined) { height = this.scene.sys.scale.height; }
        if (makeMain === undefined) { makeMain = false; }
        if (name === undefined) { name = ''; }

        var camera = new Camera(x, y, width, height);

        camera.setName(name);
        camera.setScene(this.scene);
        camera.setRoundPixels(this.roundPixels);

        camera.id = this.getNextID();

        this.cameras.push(camera);

        if (makeMain)
        {
            this.main = camera;
        }

        return camera;
    },

    /**
     * Adds an existing Camera into the Camera Manager.
     * 
     * The Camera should either be a `Phaser.Cameras.Scene2D.Camera` instance, or a class that extends from it.
     * 
     * The Camera will have its `roundPixels` property set to whatever `CameraManager.roundPixels` is. You can change
     * it after addition if required.
     * 
     * The Camera will be assigned an ID, which is used for Game Object exclusion and then added to the
     * manager. As long as it doesn't already exist in the manager it will be added then returned.
     * 
     * If this method returns `null` then the Camera already exists in this Camera Manager.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#addExisting
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to be added to the Camera Manager.
     * @param {boolean} [makeMain=false] - Set this Camera as being the 'main' camera. This just makes the property `main` a reference to it.
     *
     * @return {?Phaser.Cameras.Scene2D.Camera} The Camera that was added to the Camera Manager, or `null` if it couldn't be added.
     */
    addExisting: function (camera, makeMain)
    {
        if (makeMain === undefined) { makeMain = false; }

        var index = this.cameras.indexOf(camera);

        if (index === -1)
        {
            camera.id = this.getNextID();

            camera.setRoundPixels(this.roundPixels);

            this.cameras.push(camera);

            if (makeMain)
            {
                this.main = camera;
            }
    
            return camera;
        }

        return null;
    },

    /**
     * Gets the next available Camera ID number.
     * 
     * The Camera Manager supports up to 31 unique cameras, after which the ID returned will always be zero.
     * You can create additional cameras beyond 31, but they cannot be used for Game Object exclusion.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#getNextID
     * @private
     * @since 3.11.0
     *
     * @return {number} The next available Camera ID, or 0 if they're all already in use.
     */
    getNextID: function ()
    {
        var cameras = this.cameras;

        var testID = 1;

        //  Find the first free camera ID we can use

        for (var t = 0; t < 32; t++)
        {
            var found = false;

            for (var i = 0; i < cameras.length; i++)
            {
                var camera = cameras[i];

                if (camera && camera.id === testID)
                {
                    found = true;
                    continue;
                }
            }

            if (found)
            {
                testID = testID << 1;
            }
            else
            {
                return testID;
            }
        }

        return 0;
    },

    /**
     * Gets the total number of Cameras in this Camera Manager.
     * 
     * If the optional `isVisible` argument is set it will only count Cameras that are currently visible.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#getTotal
     * @since 3.11.0
     * 
     * @param {boolean} [isVisible=false] - Set the `true` to only include visible Cameras in the total.
     *
     * @return {integer} The total number of Cameras in this Camera Manager.
     */
    getTotal: function (isVisible)
    {
        if (isVisible === undefined) { isVisible = false; }

        var total = 0;

        var cameras = this.cameras;

        for (var i = 0; i < cameras.length; i++)
        {
            var camera = cameras[i];

            if (!isVisible || (isVisible && camera.visible))
            {
                total++;
            }
        }

        return total;
    },

    /**
     * Populates this Camera Manager based on the given configuration object, or an array of config objects.
     * 
     * See the `Phaser.Types.Cameras.Scene2D.CameraConfig` documentation for details of the object structure.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#fromJSON
     * @since 3.0.0
     *
     * @param {(Phaser.Types.Cameras.Scene2D.CameraConfig|Phaser.Types.Cameras.Scene2D.CameraConfig[])} config - A Camera configuration object, or an array of them, to be added to this Camera Manager.
     *
     * @return {Phaser.Cameras.Scene2D.CameraManager} This Camera Manager instance.
     */
    fromJSON: function (config)
    {
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        var gameWidth = this.scene.sys.scale.width;
        var gameHeight = this.scene.sys.scale.height;

        for (var i = 0; i < config.length; i++)
        {
            var cameraConfig = config[i];

            var x = GetFastValue(cameraConfig, 'x', 0);
            var y = GetFastValue(cameraConfig, 'y', 0);
            var width = GetFastValue(cameraConfig, 'width', gameWidth);
            var height = GetFastValue(cameraConfig, 'height', gameHeight);

            var camera = this.add(x, y, width, height);

            //  Direct properties
            camera.name = GetFastValue(cameraConfig, 'name', '');
            camera.zoom = GetFastValue(cameraConfig, 'zoom', 1);
            camera.rotation = GetFastValue(cameraConfig, 'rotation', 0);
            camera.scrollX = GetFastValue(cameraConfig, 'scrollX', 0);
            camera.scrollY = GetFastValue(cameraConfig, 'scrollY', 0);
            camera.roundPixels = GetFastValue(cameraConfig, 'roundPixels', false);
            camera.visible = GetFastValue(cameraConfig, 'visible', true);

            // Background Color

            var backgroundColor = GetFastValue(cameraConfig, 'backgroundColor', false);

            if (backgroundColor)
            {
                camera.setBackgroundColor(backgroundColor);
            }

            //  Bounds

            var boundsConfig = GetFastValue(cameraConfig, 'bounds', null);

            if (boundsConfig)
            {
                var bx = GetFastValue(boundsConfig, 'x', 0);
                var by = GetFastValue(boundsConfig, 'y', 0);
                var bwidth = GetFastValue(boundsConfig, 'width', gameWidth);
                var bheight = GetFastValue(boundsConfig, 'height', gameHeight);

                camera.setBounds(bx, by, bwidth, bheight);
            }
        }

        return this;
    },

    /**
     * Gets a Camera based on its name.
     * 
     * Camera names are optional and don't have to be set, so this method is only of any use if you
     * have given your Cameras unique names.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#getCamera
     * @since 3.0.0
     *
     * @param {string} name - The name of the Camera.
     *
     * @return {?Phaser.Cameras.Scene2D.Camera} The first Camera with a name matching the given string, otherwise `null`.
     */
    getCamera: function (name)
    {
        var cameras = this.cameras;

        for (var i = 0; i < cameras.length; i++)
        {
            if (cameras[i].name === name)
            {
                return cameras[i];
            }
        }

        return null;
    },

    /**
     * Returns an array of all cameras below the given Pointer.
     * 
     * The first camera in the array is the top-most camera in the camera list.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#getCamerasBelowPointer
     * @since 3.10.0
     *
     * @param {Phaser.Input.Pointer} pointer - The Pointer to check against.
     *
     * @return {Phaser.Cameras.Scene2D.Camera[]} An array of cameras below the Pointer.
     */
    getCamerasBelowPointer: function (pointer)
    {
        var cameras = this.cameras;

        var x = pointer.x;
        var y = pointer.y;

        var output = [];

        for (var i = 0; i < cameras.length; i++)
        {
            var camera = cameras[i];

            if (camera.visible && camera.inputEnabled && RectangleContains(camera, x, y))
            {
                //  So the top-most camera is at the top of the search array
                output.unshift(camera);
            }
        }

        return output;
    },

    /**
     * Removes the given Camera, or an array of Cameras, from this Camera Manager.
     * 
     * If found in the Camera Manager it will be immediately removed from the local cameras array.
     * If also currently the 'main' camera, 'main' will be reset to be camera 0.
     * 
     * The removed Cameras are automatically destroyed if the `runDestroy` argument is `true`, which is the default.
     * If you wish to re-use the cameras then set this to `false`, but know that they will retain their references
     * and internal data until destroyed or re-added to a Camera Manager.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#remove
     * @since 3.0.0
     *
     * @param {(Phaser.Cameras.Scene2D.Camera|Phaser.Cameras.Scene2D.Camera[])} camera - The Camera, or an array of Cameras, to be removed from this Camera Manager.
     * @param {boolean} [runDestroy=true] - Automatically call `Camera.destroy` on each Camera removed from this Camera Manager.
     * 
     * @return {integer} The total number of Cameras removed.
     */
    remove: function (camera, runDestroy)
    {
        if (runDestroy === undefined) { runDestroy = true; }

        if (!Array.isArray(camera))
        {
            camera = [ camera ];
        }

        var total = 0;
        var cameras = this.cameras;

        for (var i = 0; i < camera.length; i++)
        {
            var index = cameras.indexOf(camera[i]);

            if (index !== -1)
            {
                if (runDestroy)
                {
                    cameras[index].destroy();
                }

                cameras.splice(index, 1);

                total++;
            }
        }

        if (!this.main && cameras[0])
        {
            this.main = cameras[0];
        }

        return total;
    },

    /**
     * The internal render method. This is called automatically by the Scene and should not be invoked directly.
     * 
     * It will iterate through all local cameras and render them in turn, as long as they're visible and have
     * an alpha level > 0.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#render
     * @protected
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The Renderer that will render the children to this camera.
     * @param {Phaser.GameObjects.GameObject[]} children - An array of renderable Game Objects.
     * @param {number} interpolation - Interpolation value. Reserved for future use.
     */
    render: function (renderer, children, interpolation)
    {
        var scene = this.scene;
        var cameras = this.cameras;

        for (var i = 0; i < this.cameras.length; i++)
        {
            var camera = cameras[i];

            if (camera.visible && camera.alpha > 0)
            {
                //  Hard-coded to 1 for now
                camera.preRender(1);

                renderer.render(scene, children, interpolation, camera);
            }
        }
    },

    /**
     * Resets this Camera Manager.
     * 
     * This will iterate through all current Cameras, destroying them all, then it will reset the
     * cameras array, reset the ID counter and create 1 new single camera using the default values.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#resetAll
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Scene2D.Camera} The freshly created main Camera.
     */
    resetAll: function ()
    {
        for (var i = 0; i < this.cameras.length; i++)
        {
            this.cameras[i].destroy();
        }

        this.cameras = [];

        this.main = this.add();

        return this.main;
    },

    /**
     * The main update loop. Called automatically when the Scene steps.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#update
     * @protected
     * @since 3.0.0
     *
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    update: function (time, delta)
    {
        for (var i = 0; i < this.cameras.length; i++)
        {
            this.cameras[i].update(time, delta);
        }
    },

    /**
     * The event handler that manages the `resize` event dispatched by the Scale Manager.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#onResize
     * @since 3.18.0
     *
     * @param {Phaser.Structs.Size} gameSize - The default Game Size object. This is the un-modified game dimensions.
     * @param {Phaser.Structs.Size} baseSize - The base Size object. The game dimensions multiplied by the resolution. The canvas width / height values match this.
     */
    onResize: function (gameSize, baseSize, displaySize, resolution, previousWidth, previousHeight)
    {
        for (var i = 0; i < this.cameras.length; i++)
        {
            var cam = this.cameras[i];

            //  if camera is at 0x0 and was the size of the previous game size, then we can safely assume it
            //  should be updated to match the new game size too

            if (cam._x === 0 && cam._y === 0 && cam._width === previousWidth && cam._height === previousHeight)
            {
                cam.setSize(baseSize.width, baseSize.height);
            }
        }
    },

    /**
     * Resizes all cameras to the given dimensions.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#resize
     * @since 3.2.0
     *
     * @param {number} width - The new width of the camera.
     * @param {number} height - The new height of the camera.
     */
    resize: function (width, height)
    {
        for (var i = 0; i < this.cameras.length; i++)
        {
            this.cameras[i].setSize(width, height);
        }
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.main = undefined;

        for (var i = 0; i < this.cameras.length; i++)
        {
            this.cameras[i].destroy();
        }

        this.cameras = [];

        var eventEmitter = this.systems.events;

        eventEmitter.off(SceneEvents.UPDATE, this.update, this);
        eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Cameras.Scene2D.CameraManager#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.default.destroy();

        this.scene.sys.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
    }

});

PluginCache.register('CameraManager', CameraManager, 'cameras');

module.exports = CameraManager;
