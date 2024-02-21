/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = require('../../animations/AnimationState');
var Class = require('../../utils/Class');
var GenerateGridVerts = require('../../geom/mesh/GenerateGridVerts');
var IntegerToRGB = require('../../display/color/IntegerToRGB');
var Mesh = require('../mesh/Mesh');
var UUID = require('../../utils/string/UUID');

/**
 * @classdesc
 * A Plane Game Object.
 *
 * The Plane Game Object is a helper class that takes the Mesh Game Object and extends it,
 * allowing for fast and easy creation of Planes. A Plane is a one-sided grid of cells,
 * where you specify the number of cells in each dimension. The Plane can have a texture
 * that is either repeated (tiled) across each cell, or applied to the full Plane.
 *
 * The Plane can then be manipulated in 3D space, with rotation across all 3 axis.
 *
 * This allows you to create effects not possible with regular Sprites, such as perspective
 * distortion. You can also adjust the vertices on a per-vertex basis. Plane data becomes
 * part of the WebGL batch, just like standard Sprites, so doesn't introduce any additional
 * shader overhead. Because the Plane just generates vertices into the WebGL batch, like any
 * other Sprite, you can use all of the common Game Object components on a Plane too,
 * such as a custom pipeline, mask, blend mode or texture.
 *
 * You can use the `uvScroll` and `uvScale` methods to adjust the placement and scaling
 * of the texture if this Plane is using a single texture, and not a frame from a texture
 * atlas or sprite sheet.
 *
 * The Plane Game Object also has the Animation component, allowing you to play animations
 * across the Plane just as you would with a Sprite. The animation frame size must be fixed
 * as the first frame will be the size of the entire animation, for example use a `SpriteSheet`.
 *
 * Note that the Plane object is WebGL only and does not have a Canvas counterpart.
 *
 * The Plane origin is always 0.5 x 0.5 and cannot be changed.
 *
 * @class Plane
 * @extends Phaser.GameObjects.Mesh
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Plane belongs. A Plane can only belong to one Scene at a time.
 * @param {number} [x] - The horizontal position of this Plane in the world.
 * @param {number} [y] - The vertical position of this Plane in the world.
 * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this Plane will use to render with, as stored in the Texture Manager.
 * @param {string|number} [frame] - An optional frame from the Texture this Plane is rendering with.
 * @param {number} [width=8] - The width of this Plane, in cells, not pixels.
 * @param {number} [height=8] - The height of this Plane, in cells, not pixels.
 * @param {boolean} [tile=false] - Is the texture tiled? I.e. repeated across each cell.
 */
var Plane = new Class({

    Extends: Mesh,

    initialize:

    function Plane (scene, x, y, texture, frame, width, height, tile)
    {
        if (!texture) { texture = '__DEFAULT'; }

        Mesh.call(this, scene, x, y, texture, frame);

        this.type = 'Plane';

        /**
         * The Animation State component of this Sprite.
         *
         * This component provides features to apply animations to this Sprite.
         * It is responsible for playing, loading, queuing animations for later playback,
         * mixing between animations and setting the current animation frame to this Sprite.
         *
         * @name Phaser.GameObjects.Plane#anims
         * @type {Phaser.Animations.AnimationState}
         * @since 3.60.0
         */
        this.anims = new AnimationState(this);

        /**
         * The width of this Plane in cells, not pixels.
         *
         * This value is read-only. To adjust it, see the `setGridSize` method.
         *
         * @name Phaser.GameObjects.Plane#gridWidth
         * @type {number}
         * @readonly
         * @since 3.60.0
         */
        this.gridWidth;

        /**
         * The height of this Plane in cells, not pixels.
         *
         * This value is read-only. To adjust it, see the `setGridSize` method.
         *
         * @name Phaser.GameObjects.Plane#gridHeight
         * @type {number}
         * @readonly
         * @since 3.60.0
         */
        this.gridHeight;

        /**
         * Is the texture of this Plane tiled across all cells, or not?
         *
         * This value is read-only. To adjust it, see the `setGridSize` method.
         *
         * @name Phaser.GameObjects.Plane#isTiled
         * @type {boolean}
         * @readonly
         * @since 3.60.0
         */
        this.isTiled;

        /**
         * If this Plane has a checkboard texture, this is a reference to
         * the WebGLTexture being used. Otherwise, it's null.
         *
         * @name Phaser.GameObjects.Plane#_checkerboard
         * @type {?WebGLTexture}
         * @private
         * @since 3.60.0
         */
        this._checkerboard = null;

        this.hideCCW = false;

        this.setGridSize(width, height, tile);
        this.setSizeToFrame(false);
        this.setViewHeight();
    },

    /**
     * Do not change this value. It has no effect other than to break things.
     *
     * @name Phaser.GameObjects.Plane#originX
     * @type {number}
     * @readonly
     * @override
     * @since 3.70.0
     */
    originX: {

        get: function ()
        {
            return 0.5;
        }

    },

    /**
     * Do not change this value. It has no effect other than to break things.
     *
     * @name Phaser.GameObjects.Plane#originY
     * @type {number}
     * @readonly
     * @override
     * @since 3.70.0
     */
    originY: {

        get: function ()
        {
            return 0.5;
        }

    },

    /**
     * Modifies the layout of this Plane by adjusting the grid dimensions to the
     * given width and height. The values are given in cells, not pixels.
     *
     * The `tile` parameter allows you to control if the texture is tiled, or
     * applied across the entire Plane? A tiled texture will repeat with one
     * iteration per cell. A non-tiled texture will be applied across the whole
     * Plane.
     *
     * Note that if this Plane is using a single texture, not from a texture atlas
     * or sprite sheet, then you can use the `Plane.uvScale` method to have much
     * more fine-grained control over the texture tiling.
     *
     * @method Phaser.GameObjects.Plane#preDestroy
     * @since 3.60.0
     *
     * @param {number} [width=8] - The width of this Plane, in cells, not pixels.
     * @param {number} [height=8] - The height of this Plane, in cells, not pixels.
     * @param {boolean} [tile=false] - Is the texture tiled? I.e. repeated across each cell.
     */
    setGridSize: function (width, height, tile)
    {
        if (width === undefined) { width = 8; }
        if (height === undefined) { height = 8; }
        if (tile === undefined) { tile = false; }

        var flipY = false;

        if (tile)
        {
            flipY = true;
        }

        this.gridWidth = width;
        this.gridHeight = height;
        this.isTiled = tile;

        this.clear();

        GenerateGridVerts({
            mesh: this,
            widthSegments: width,
            heightSegments: height,
            isOrtho: false,
            tile: tile,
            flipY: flipY
        });

        return this;
    },

    /**
     * An internal method that resets the perspective projection for this Plane
     * when it changes texture or frame, and also resets the cell UV coordinates,
     * if required.
     *
     * @method Phaser.GameObjects.Plane#setSizeToFrame
     * @since 3.60.0
     * @override
     *
     * @param {boolean} [resetUV=true] - Reset all of the cell UV coordinates?
     *
     * @return {this} This Game Object instance.
     */
    setSizeToFrame: function (resetUV)
    {
        if (resetUV === undefined) { resetUV = true; }

        var frame = this.frame;

        this.setPerspective(this.width / frame.width, this.height / frame.height);

        if (this._checkerboard && this._checkerboard !== this.texture)
        {
            this.removeCheckerboard();
        }

        if (!resetUV)
        {
            return this;
        }

        //  Reset UV coordinates if frame has changed

        var gridX = this.gridWidth;
        var gridY = this.gridHeight;

        var verts = this.vertices;

        var frameU0 = frame.u0;
        var frameU1 = frame.u1;
        var frameV0 = frame.v0;
        var frameV1 = frame.v1;

        var x;
        var y;
        var i = 0;

        if (this.isTiled)
        {
            //  flipY
            frameV0 = frame.v1;
            frameV1 = frame.v0;

            for (y = 0; y < gridY; y++)
            {
                for (x = 0; x < gridX; x++)
                {
                    verts[i++].setUVs(frameU0, frameV1);
                    verts[i++].setUVs(frameU0, frameV0);
                    verts[i++].setUVs(frameU1, frameV1);
                    verts[i++].setUVs(frameU0, frameV0);
                    verts[i++].setUVs(frameU1, frameV0);
                    verts[i++].setUVs(frameU1, frameV1);
                }
            }
        }
        else
        {
            var gridX1 = gridX + 1;
            var gridY1 = gridY + 1;

            var frameU = frameU1 - frameU0;
            var frameV = frameV1 - frameV0;

            var uvs = [];

            for (y = 0; y < gridY1; y++)
            {
                for (x = 0; x < gridX1; x++)
                {
                    var tu = frameU0 + frameU * (x / gridX);
                    var tv = frameV0 + frameV * (y / gridY);

                    uvs.push(tu, tv);
                }
            }

            for (y = 0; y < gridY; y++)
            {
                for (x = 0; x < gridX; x++)
                {
                    var a = (x + gridX1 * y) * 2;
                    var b = (x + gridX1 * (y + 1)) * 2;
                    var c = ((x + 1) + gridX1 * (y + 1)) * 2;
                    var d = ((x + 1) + gridX1 * y) * 2;

                    verts[i++].setUVs(uvs[a], uvs[a + 1]);
                    verts[i++].setUVs(uvs[b], uvs[b + 1]);
                    verts[i++].setUVs(uvs[d], uvs[d + 1]);
                    verts[i++].setUVs(uvs[b], uvs[b + 1]);
                    verts[i++].setUVs(uvs[c], uvs[c + 1]);
                    verts[i++].setUVs(uvs[d], uvs[d + 1]);
                }
            }
        }

        return this;
    },

    /**
     * Sets the height of this Plane to match the given value, in pixels.
     *
     * This adjusts the `Plane.viewPosition.z` value to achieve this.
     *
     * If no `value` parameter is given, it will set the view height to match
     * that of the current texture frame the Plane is using.
     *
     * @method Phaser.GameObjects.Plane#setViewHeight
     * @since 3.60.0
     *
     * @param {number} [value] - The height, in pixels, to set this Plane view height to.
     */
    setViewHeight: function (value)
    {
        if (value === undefined) { value = this.frame.height; }

        var vFOV = this.fov * (Math.PI / 180);

        this.viewPosition.z = (this.height / value) / (Math.tan(vFOV / 2));

        this.dirtyCache[10] = 1;
    },

    /**
     * Creates a checkerboard style texture, based on the given colors and alpha
     * values and applies it to this Plane, replacing any current texture it may
     * have.
     *
     * The colors are used in an alternating pattern, like a chess board.
     *
     * Calling this method generates a brand new 16x16 pixel WebGLTexture internally
     * and applies it to this Plane. While quite fast to do, you should still be
     * mindful of calling this method either extensively, or in tight parts of
     * your game.
     *
     * @method Phaser.GameObjects.Plane#createCheckerboard
     * @since 3.60.0
     *
     * @param {number} [color1=0xffffff] - The odd cell color, specified as a hex value.
     * @param {number} [color2=0x0000ff] - The even cell color, specified as a hex value.
     * @param {number} [alpha1=255] - The odd cell alpha value, specified as a number between 0 and 255.
     * @param {number} [alpha2=255] - The even cell alpha value, specified as a number between 0 and 255.
     * @param {number} [height=128] - The view height of the Plane after creation, in pixels.
     */
    createCheckerboard: function (color1, color2, alpha1, alpha2, height)
    {
        if (color1 === undefined) { color1 = 0xffffff; }
        if (color2 === undefined) { color2 = 0x0000ff; }
        if (alpha1 === undefined) { alpha1 = 255; }
        if (alpha2 === undefined) { alpha2 = 255; }
        if (height === undefined) { height = 128; }

        //  Let's assume 16x16 for our texture size and 8x8 cell size

        var c1 = IntegerToRGB(color1);
        var c2 = IntegerToRGB(color2);

        var colors = [];

        for (var h = 0; h < 16; h++)
        {
            for (var w = 0; w < 16; w++)
            {
                if ((h < 8 && w < 8) || (h > 7 && w > 7))
                {
                    colors.push(c1.r, c1.g, c1.b, alpha1);
                }
                else
                {
                    colors.push(c2.r, c2.g, c2.b, alpha2);
                }
            }
        }

        var texture = this.scene.sys.textures.addUint8Array(UUID(), new Uint8Array(colors), 16, 16);

        this.removeCheckerboard();

        this.setTexture(texture);

        this.setSizeToFrame();

        this.setViewHeight(height);

        return this;
    },

    /**
     * If this Plane has a Checkerboard Texture, this method will destroy it
     * and reset the internal flag for it.
     *
     * @method Phaser.GameObjects.Plane#removeCheckerboard
     * @since 3.60.0
     */
    removeCheckerboard: function ()
    {
        if (this._checkerboard)
        {
            this._checkerboard.destroy();

            this._checkerboard = null;
        }
    },

    /**
     * Start playing the given animation on this Plane.
     *
     * Animations in Phaser can either belong to the global Animation Manager, or specifically to this Plane.
     *
     * The benefit of a global animation is that multiple Game Objects can all play the same animation, without
     * having to duplicate the data. You can just create it once and then play it on any animating Game Object.
     *
     * The following code shows how to create a global repeating animation. The animation will be created
     * from all of the frames within the sprite sheet that was loaded with the key 'muybridge':
     *
     * ```javascript
     * var config = {
     *     key: 'run',
     *     frames: 'muybridge',
     *     frameRate: 15,
     *     repeat: -1
     * };
     *
     * //  This code should be run from within a Scene:
     * this.anims.create(config);
     * ```
     *
     * However, if you wish to create an animation that is unique to this Plane, and this Plane alone,
     * you can call the `Animation.create` method instead. It accepts the exact same parameters as when
     * creating a global animation, however the resulting data is kept locally in this Plane.
     *
     * With the animation created, either globally or locally, you can now play it on this Plane:
     *
     * ```javascript
     * const plane = this.add.plane(...);
     * plane.play('run');
     * ```
     *
     * Alternatively, if you wish to run it at a different frame rate for example, you can pass a config
     * object instead:
     *
     * ```javascript
     * const plane = this.add.plane(...);
     * plane.play({ key: 'run', frameRate: 24 });
     * ```
     *
     * When playing an animation on a Plane it will first check to see if it can find a matching key
     * locally within the Plane. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * If you need a Plane to be able to play both local and global animations, make sure they don't
     * have conflicting keys.
     *
     * See the documentation for the `PlayAnimationConfig` config object for more details about this.
     *
     * Also, see the documentation in the Animation Manager for further details on creating animations.
     *
     * @method Phaser.GameObjects.Plane#play
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.60.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     *
     * @return {this} This Game Object.
     */
    play: function (key, ignoreIfPlaying)
    {
        return this.anims.play(key, ignoreIfPlaying);
    },

    /**
     * Start playing the given animation on this Plane, in reverse.
     *
     * Animations in Phaser can either belong to the global Animation Manager, or specifically to a Game Object.
     *
     * The benefit of a global animation is that multiple Game Objects can all play the same animation, without
     * having to duplicate the data. You can just create it once and then play it on any animating Game Object.
     *
     * The following code shows how to create a global repeating animation. The animation will be created
     * from all of the frames within the sprite sheet that was loaded with the key 'muybridge':
     *
     * ```javascript
     * var config = {
     *     key: 'run',
     *     frames: 'muybridge',
     *     frameRate: 15,
     *     repeat: -1
     * };
     *
     * //  This code should be run from within a Scene:
     * this.anims.create(config);
     * ```
     *
     * However, if you wish to create an animation that is unique to this Game Object, and this Game Object alone,
     * you can call the `Animation.create` method instead. It accepts the exact same parameters as when
     * creating a global animation, however the resulting data is kept locally in this Game Object.
     *
     * With the animation created, either globally or locally, you can now play it on this Game Object:
     *
     * ```javascript
     * const plane = this.add.plane(...);
     * plane.playReverse('run');
     * ```
     *
     * Alternatively, if you wish to run it at a different frame rate, for example, you can pass a config
     * object instead:
     *
     * ```javascript
     * const plane = this.add.plane(...);
     * plane.playReverse({ key: 'run', frameRate: 24 });
     * ```
     *
     * When playing an animation on a Game Object it will first check to see if it can find a matching key
     * locally within the Game Object. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * If you need a Game Object to be able to play both local and global animations, make sure they don't
     * have conflicting keys.
     *
     * See the documentation for the `PlayAnimationConfig` config object for more details about this.
     *
     * Also, see the documentation in the Animation Manager for further details on creating animations.
     *
     * @method Phaser.GameObjects.Plane#playReverse
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.60.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     *
     * @return {this} This Game Object.
     */
    playReverse: function (key, ignoreIfPlaying)
    {
        return this.anims.playReverse(key, ignoreIfPlaying);
    },

    /**
     * Waits for the specified delay, in milliseconds, then starts playback of the given animation.
     *
     * If the animation _also_ has a delay value set in its config, it will be **added** to the delay given here.
     *
     * If an animation is already running and a new animation is given to this method, it will wait for
     * the given delay before starting the new animation.
     *
     * If no animation is currently running, the given one begins after the delay.
     *
     * When playing an animation on a Game Object it will first check to see if it can find a matching key
     * locally within the Game Object. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * @method Phaser.GameObjects.Plane#playAfterDelay
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.60.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {number} delay - The delay, in milliseconds, to wait before starting the animation playing.
     *
     * @return {this} This Game Object.
     */
    playAfterDelay: function (key, delay)
    {
        return this.anims.playAfterDelay(key, delay);
    },

    /**
     * Waits for the current animation to complete the `repeatCount` number of repeat cycles, then starts playback
     * of the given animation.
     *
     * You can use this to ensure there are no harsh jumps between two sets of animations, i.e. going from an
     * idle animation to a walking animation, by making them blend smoothly into each other.
     *
     * If no animation is currently running, the given one will start immediately.
     *
     * When playing an animation on a Game Object it will first check to see if it can find a matching key
     * locally within the Game Object. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * @method Phaser.GameObjects.Plane#playAfterRepeat
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.60.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {number} [repeatCount=1] - How many times should the animation repeat before the next one starts?
     *
     * @return {this} This Game Object.
     */
    playAfterRepeat: function (key, repeatCount)
    {
        return this.anims.playAfterRepeat(key, repeatCount);
    },

    /**
     * Immediately stops the current animation from playing and dispatches the `ANIMATION_STOP` events.
     *
     * If no animation is playing, no event will be dispatched.
     *
     * If there is another animation queued (via the `chain` method) then it will start playing immediately.
     *
     * @method Phaser.GameObjects.Plane#stop
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.60.0
     *
     * @return {this} This Game Object.
     */
    stop: function ()
    {
        return this.anims.stop();
    },

    /**
     * Stops the current animation from playing after the specified time delay, given in milliseconds.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.GameObjects.Plane#stopAfterDelay
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.60.0
     *
     * @param {number} delay - The number of milliseconds to wait before stopping this animation.
     *
     * @return {this} This Game Object.
     */
    stopAfterDelay: function (delay)
    {
        return this.anims.stopAfterDelay(delay);
    },

    /**
     * Stops the current animation from playing after the given number of repeats.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.GameObjects.Plane#stopAfterRepeat
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.60.0
     *
     * @param {number} [repeatCount=1] - How many times should the animation repeat before stopping?
     *
     * @return {this} This Game Object.
     */
    stopAfterRepeat: function (repeatCount)
    {
        return this.anims.stopAfterRepeat(repeatCount);
    },

    /**
     * Stops the current animation from playing when it next sets the given frame.
     * If this frame doesn't exist within the animation it will not stop it from playing.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.GameObjects.Plane#stopOnFrame
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.60.0
     *
     * @param {Phaser.Animations.AnimationFrame} frame - The frame to check before stopping this animation.
     *
     * @return {this} This Game Object.
     */
    stopOnFrame: function (frame)
    {
        return this.anims.stopOnFrame(frame);
    },

    /**
     * Runs the preUpdate for this Plane, which will check its Animation State,
     * if one is playing, and refresh view / model matrices, if updated.
     *
     * @method Phaser.GameObjects.Plane#preUpdate
     * @protected
     * @since 3.60.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function (time, delta)
    {
        Mesh.prototype.preUpdate.call(this, time, delta);

        this.anims.update(time, delta);
    },

    /**
     * Handles the pre-destroy step for the Plane, which removes the vertices and debug callbacks.
     *
     * @method Phaser.GameObjects.Plane#preDestroy
     * @private
     * @since 3.60.0
     */
    preDestroy: function ()
    {
        this.clear();
        this.removeCheckerboard();

        this.anims.destroy();

        this.anims = undefined;

        this.debugCallback = null;
        this.debugGraphic = null;
    }

});

module.exports = Plane;
