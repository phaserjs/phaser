/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Camera = require('../../cameras/2d/BaseCamera');
var Vector2 = require('../../math/Vector2');
var ShaderQuad = require('../../renderer/webgl/renderNodes/ShaderQuad');
var DrawingContext = require('../../renderer/webgl/DrawingContext');
var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var Components = require('../components');
var GameObject = require('../GameObject');
var ShaderRender = require('./ShaderRender');

/**
 * @classdesc
 * A Shader Game Object.
 *
 * This Game Object allows you to easily add a quad with its own shader
 * into the display list, and manipulate it as you would any other Game Object,
 * including scaling, rotating, positioning and adding to Containers.
 * The Shader can be made interactive and used for input events.
 * It can also be used in filters to create visually stunning effects.
 *
 * It works by creating a custom RenderNode which runs a custom shader program
 * to draw a quad. The shader program can be loaded from the Shader Cache,
 * or provided in-line as strings.
 *
 * Please see the Phaser 3 Examples GitHub repo for several examples
 * of loading and creating shaders dynamically.
 *
 * Due to the way in which they work, you cannot directly change the alpha
 * of a Shader. It should be handled via uniforms in the shader code itself.
 *
 * By default, a Shader has a uniform called `uProjectionMatrix`
 * which is set automatically.
 * You can control additional uniforms using the `setupUniforms` method
 * in the Shader configuration object, which runs every time the shader renders.
 *
 * Shaders are stand-alone renders: they finish any current render batch
 * and run once by themselves. As this costs a draw call, you should use them sparingly.
 * If you need to have a fully batched custom shader, then please look at using
 * a custom RenderNode instead. However, for background or special masking effects,
 * they are extremely effective.
 *
 * Note: be careful when using texture coordinates in shader code.
 * The built-in variable `gl_FragCoord` and the default uniform `outTexCoord`
 * both use WebGL coordinates, which are `0,0` in the bottom-left.
 * Additionally, `gl_FragCoord` says it's in "window relative" coordinates.
 * But this is actually relative to the framebuffer size.
 *
 * @example
 * // Loading a shader from the cache (good for simple shaders)
 * function preload ()
 * {
 *     this.load.glsl('fire', 'shaders/fire.glsl.js');
 * }
 *
 * function create ()
 * {
 *     this.add.shader('fire', 400, 300, 512, 512);
 * }
 *
 * @example
 * // Using a configuration object (good for more control)
 * function create ()
 * {
 *    this.add.shader({
 *        fragmentKey: 'fire', // This will be overridden by fragmentSource
 *        fragmentSource: '// your fragment shader source',
 *        setupUniforms: (setUniform, drawingContext) => {
 *            setUniform('time', this.game.loop.getDuration());
 *        }
 *    }, 400, 300, 512, 512);
 * }
 *
 * @class Shader
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.17.0
 *
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {string|Phaser.Types.GameObjects.Shader.ShaderQuadConfig} config - The configuration object this Shader will use. It can also be a key that corresponds to a shader in the shader cache, which will be used as `fragmentKey` in a new config object.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object.
 * @param {number} [height=128] - The height of the Game Object.
 * @param {string[]|Phaser.Textures.Texture[]} [textures] - The textures that the shader uses, if any. If you intend to define the textures later, use `'__DEFAULT'` as a placeholder, to avoid initialization errors.
 */
var Shader = new Class({
    Extends: GameObject,

    Mixins: [
        Components.BlendMode,
        Components.ComputedSize,
        Components.Depth,
        Components.GetBounds,
        Components.Origin,
        Components.ScrollFactor,
        Components.Transform,
        Components.Visible,
        ShaderRender
    ],

    initialize: function Shader (scene, config, x, y, width, height, textures)
    {
        if (config === undefined) { config = {}; }
        if (typeof config === 'string')
        {
            config = { fragmentKey: config };
        }
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 128; }
        if (height === undefined) { height = 128; }

        GameObject.call(this, scene, 'Shader');

        var renderer = scene.sys.renderer;

        /**
         * The textures that the shader uses.
         * These will be assigned to texture units 0 to N when the shader is
         * rendered, where N is `textures.length - 1`.
         *
         * @name Phaser.GameObjects.Shader#textures
         * @type {Phaser.Textures.Texture[]}
         * @since 4.0.0
         */
        this.textures = [];

        /**
         * The underlying RenderNode object that the shader uses to render with.
         *
         * @name Phaser.GameObjects.Shader#renderNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.ShaderQuad}
         * @since 4.0.0
         */
        this.renderNode = new ShaderQuad(renderer.renderNodes, config);

        this.setupUniforms = GetFastValue(config, 'setupUniforms', function () {});

        if (config.updateShaderConfig)
        {
            this.renderNode.updateShaderConfig = config.updateShaderConfig;
        }

        var initialUniforms = GetFastValue(config, 'initialUniforms', {});
        Object.entries(initialUniforms).forEach(function (entry)
        {
            this.setUniform(entry[0], entry[1]);
        }, this);

        /**
         * The drawing context containing the framebuffer and texture that the shader is rendered to.
         * This is only set if the shader is rendering to a texture.
         *
         * @name Phaser.GameObjects.Shader#drawingContext
         * @type {?Phaser.Renderer.WebGL.DrawingContext}
         * @since 4.0.0
         */
        this.drawingContext = null;

        /**
         * A reference to the WebGLTextureWrapper this Shader is rendering to.
         * This property is only set if you have called `Shader.setRenderToTexture`.
         *
         * @name Phaser.GameObjects.Shader#glTexture
         * @type {?Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @since 3.19.0
         */
        this.glTexture = null;

        /**
         * A flag that indicates if this Shader has been set to render to a texture instead of the display list.
         *
         * This property is `true` if you have called `Shader.setRenderToTexture`, otherwise it's `false`.
         *
         * A Shader that is rendering to a texture _does not_ appear on the display list.
         *
         * @name Phaser.GameObjects.Shader#renderToTexture
         * @type {boolean}
         * @readonly
         * @since 3.19.0
         */
        this.renderToTexture = false;

        /**
         * A reference to the Phaser.Textures.Texture that has been stored in the Texture Manager for this Shader.
         *
         * This property is only set if you have called `Shader.setRenderToTexture` with a key, otherwise it is `null`.
         *
         * @name Phaser.GameObjects.Shader#texture
         * @type {Phaser.Textures.Texture}
         * @since 3.19.0
         */
        this.texture = null;

        /**
         * The top-left texture coordinate of the shader.
         * This is set to 0,1 by default. It uses WebGL texture coordinates.
         *
         * @name Phaser.GameObjects.Shader#textureCoordinateTopLeft
         * @type {Phaser.Math.Vector2}
         * @since 4.0.0
         */
        this.textureCoordinateTopLeft = new Vector2(0, 1);

        /**
         * The top-right texture coordinate of the shader.
         * This is set to 1,1 by default. It uses WebGL texture coordinates.
         *
         * @name Phaser.GameObjects.Shader#textureCoordinateTopRight
         * @type {Phaser.Math.Vector2}
         * @since 4.0.0
         */
        this.textureCoordinateTopRight = new Vector2(1, 1);

        /**
         * The bottom-left texture coordinate of the shader.
         * This is set to 0,0 by default. It uses WebGL texture coordinates.
         *
         * @name Phaser.GameObjects.Shader#textureCoordinateBottomLeft
         * @type {Phaser.Math.Vector2}
         * @since 4.0.0
         */
        this.textureCoordinateBottomLeft = new Vector2(0, 0);

        /**
         * The bottom-right texture coordinate of the shader.
         * This is set to 1,0 by default. It uses WebGL texture coordinates.
         *
         * @name Phaser.GameObjects.Shader#textureCoordinateBottomRight
         * @type {Phaser.Math.Vector2}
         * @since 4.0.0
         */
        this.textureCoordinateBottomRight = new Vector2(1, 0);

        this.setTextures(textures);
        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0.5, 0.5);
    },

    /**
     * Returns the current value of a uniform from the render node.
     * This value is actually copied to all shaders that use it.
     * Modifications to non-primitive values such as arrays and objects
     * will modify the original.
     *
     * It's generally better to use the `setupUniforms` function in the
     * shader configuration object to set uniform values on changing uniforms.
     * This method is provided in the spirit of reading back the values.
     *
     * @method Phaser.GameObjects.Shader#getUniform
     * @since 4.0.0
     * @param {string} name - The name of the uniform to get.
     * @return {any} The value of the uniform.
     */
    getUniform: function (name)
    {
        return this.renderNode.programManager.uniforms[name];
    },

    /**
     * Set the value of a uniform in the shader.
     * This value is actually copied to all shaders that use it.
     *
     * It's generally better to use the `setupUniforms` function in the
     * shader configuration object to set uniform values on changing uniforms.
     * Use this method to set uniforms just once.
     *
     * @method Phaser.GameObjects.Shader#setUniform
     * @since 4.0.0
     * @param {string} name - The name of the uniform to set.
     * @param {any} value - The value to set the uniform to.
     * @return {this}
     */
    setUniform: function (name, value)
    {
        this.renderNode.programManager.setUniform(name, value);
        return this;
    },

    /**
     * Set the textures that the shader uses.
     *
     * Some shaders don't use any textures. Some may use one or more.
     * The textures are assigned to texture units 0 to N when the shader is rendered,
     * where N is `textures.length - 1`.
     * You must set the uniforms in your shader to match these texture units.
     *
     * Calling this method will replace the existing textures array with the new one.
     *
     * @example
     * // In the shader source, use the `sampler2D` type.
     * sampler2D uMainSampler;
     * sampler2D uNormalSampler;
     *
     * // When creating the shader, set the textures.
     * var shader = this.add.shader({
     *    fragmentKey: 'myShader',
     *    setupUniforms: (setUniform) => {
     *        // In the `setupUniforms` function, set the texture to its array position.
     *        setUniform('uMainSampler', 0);
     *        setUniform('uNormalSampler', 1);
     *    }
     * }, x, y, width, height, ['metal', 'normal']);
     *
     * @method Phaser.GameObjects.Shader#setTextures
     * @since 4.0.0
     * @param {string[]|Phaser.Textures.Texture[]} [textures] - The textures that the shader uses.
     */
    setTextures: function (textures)
    {
        if (textures === undefined) { textures = []; }

        this.textures.length = 0;

        for (var i = 0; i < textures.length; i++)
        {
            var texture = textures[i];
            if (typeof texture === 'string')
            {
                texture = this.scene.textures.get(texture);
            }
            this.textures.push(texture);
        }

        return this;
    },

    /**
     * Changes this Shader so instead of rendering to the display list
     * it renders to a WebGL Framebuffer and Texture instead.
     * This allows you to use the output of this shader as a texture.
     *
     * After calling this method the following properties are populated:
     * - `Shader.drawingContext`
     * - `Shader.glTexture`
     *
     * Additionally, you can provide a key to this method.
     * Doing so will create a Phaser Texture from this Shader,
     * store it in `Shader.texture`,
     * and save it into the Texture Manager, allowing you to then use it for
     * any texture-based Game Object, such as a Sprite or Image:
     *
     * ```javascript
     * var shader = this.add.shader('myShader', x, y, width, height);
     *
     * shader.setRenderToTexture('doodle');
     *
     * this.add.image(400, 300, 'doodle');
     * ```
     *
     * Note that it stores an active reference to this Shader. That means as this shader updates,
     * so does the texture and any object using it to render with. Also, if you destroy this
     * shader, be sure to clear any objects that may have been using it as a texture too.
     *
     * By default it will create a single base texture. You can add frames to the texture
     * by using the `Texture.add` method. After doing this, you can then allow Game Objects
     * to use a specific frame from a Render Texture.
     *
     * If you want to update a texture only sporadically, don't use this method.
     * Instead, use a DynamicTexture:
     *
     * ```javascript
     * var shader = this.add.shader('myShader', x, y, width, height);
     *
     * var dynamic = this.textures.addDynamicTexture('myTexture', shader.width, shader.height);
     * 
     * // To update the texture:
     * dynamic.clear().draw(shader).render();
     * ```
     *
     * @method Phaser.GameObjects.Shader#setRenderToTexture
     * @since 3.19.0
     *
     * @param {string} [key] - The unique key to store the texture as within the global Texture Manager.
     *
     * @return {this} This Shader instance.
     */
    setRenderToTexture: function (key)
    {
        if (this.renderToTexture)
        {
            return this;
        }

        var width = this.width;
        var height = this.height;
        var renderer = this.scene.sys.renderer;
        var scene = this.scene;

        var camera = new Camera(0, 0, width, height).setScene(scene.game.scene.systemScene, false);

        this.drawingContext = new DrawingContext(renderer, {
            width: width,
            height: height,
            camera: camera
        });

        this.glTexture = this.drawingContext.texture;

        if (key)
        {
            this.texture = scene.sys.textures.addGLTexture(key, this.glTexture);
        }

        this.renderToTexture = true;

        // Render at least once, so our texture isn't blank on the first update
        this.renderWebGLStep(renderer, this, this.drawingContext);

        return this;
    },

    /**
     * The function which sets uniforms for the shader.
     * This is called automatically during rendering.
     * It is set from the `config` object passed in the constructor.
     * You should use this function to set any uniform values you need for your shader to run.
     *
     * You can set this function directly after object creation,
     * but it's recommended to use the `config` object
     * to keep your logic encapsulated.
     *
     * The function is invoked with two arguments: `setUniform` and `drawingContext`.
     * `setUniform` is a function that takes two arguments: a string (the name of the uniform) and a value.
     * Ensure that the value matches the expected type in the shader.
     * You don't need to be too precise, as the system will convert
     * e.g. Array and Float32Array types as needed.
     * To set an array in a shader, append `[0]` to the uniform name.
     * `drawingContext` is a reference to the current drawing context,
     * which may be useful if you need to query the camera or similar.
     *
     * Note that `uProjectionMatrix`is set for you automatically.
     *
     * @method Phaser.GameObjects.Shader#setupUniforms
     * @since 4.0.0
     * @param {function} setUniform - The function which sets uniforms. `(name: string, value: any) => void`.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - A reference to the current drawing context.
     */
    setupUniforms: function (setUniform, drawingContext)
    {
        // NOOP
    },

    /**
     * A NOOP method so you can pass a Shader to a Container.
     * Calling this method will do nothing. It is intentionally empty.
     *
     * @method Phaser.GameObjects.Shader#setAlpha
     * @private
     * @since 3.17.0
     * @return {this} This Shader instance.
     */
    setAlpha: function ()
    {
        return this;
    },

    /**
     * Set the texture coordinates of the shader.
     * These values are used to provide texture mapping to the shader,
     * and are commonly used to drive generative output.
     *
     * By default, the shader uses the whole texture, the range 0-1.
     * The coordinates are in WebGL texture space, which is 0,0 in the bottom-left.
     * This method allows you to specify a region of the texture to use,
     * or even go outside the 0-1 bounds.
     * This can be useful if you want to use a single frame from a texture,
     * repeat the shader's texture, use a larger numeric range,
     * or distort the shader.
     *
     * Note that a quad is made of two triangles, divided by the diagonal
     * from the top-left to the bottom-right. This means that some permutations
     * of coordinates may affect just one or the other triangle.
     * This can cause abrupt warping along the diagonal.
     * Keep an eye on your output. Rectangles and parallelograms are safe bets.
     * So are rotation and scaling transforms. Moving a single point is risky.
     *
     * Call this method with no arguments to reset the shader to use the whole texture.
     *
     * @method Phaser.GameObjects.Shader#setTextureCoordinates
     * @since 4.0.0
     * @param {number} [topLeftX=0] - The top-left x coordinate of the texture.
     * @param {number} [topLeftY=1] - The top-left y coordinate of the texture.
     * @param {number} [topRightX=1] - The top-right x coordinate of the texture.
     * @param {number} [topRightY=1] - The top-right y coordinate of the texture.
     * @param {number} [bottomLeftX=0] - The bottom-left x coordinate of the texture.
     * @param {number} [bottomLeftY=0] - The bottom-left y coordinate of the texture.
     * @param {number} [bottomRightX=1] - The bottom-right x coordinate of the texture.
     * @param {number} [bottomRightY=0] - The bottom-right y coordinate of the texture.
     * @return {this} This Shader instance
     */
    setTextureCoordinates: function (
        topLeftX, topLeftY,
        topRightX, topRightY,
        bottomLeftX, bottomLeftY,
        bottomRightX, bottomRightY
    )
    {
        if (topLeftX === undefined) { topLeftX = 0; }
        if (topLeftY === undefined) { topLeftY = 1; }
        if (topRightX === undefined) { topRightX = 1; }
        if (topRightY === undefined) { topRightY = 1; }
        if (bottomLeftX === undefined) { bottomLeftX = 0; }
        if (bottomLeftY === undefined) { bottomLeftY = 0; }
        if (bottomRightX === undefined) { bottomRightX = 1; }
        if (bottomRightY === undefined) { bottomRightY = 0; }

        this.textureCoordinateTopLeft.set(topLeftX, topLeftY);
        this.textureCoordinateTopRight.set(topRightX, topRightY);
        this.textureCoordinateBottomLeft.set(bottomLeftX, bottomLeftY);
        this.textureCoordinateBottomRight.set(bottomRightX, bottomRightY);

        return this;
    },

    /**
     * Set the texture coordinates of the shader from a frame.
     * This is a convenience method that sets the texture coordinates
     * to match a frame from a texture.
     *
     * @method Phaser.GameObjects.Shader#setTextureCoordinatesFromFrame
     * @since 4.0.0
     * @param {Phaser.Textures.Frame|string} frame - The frame to set the texture coordinates from. If a string is given, it will be used to look up the frame in the texture.
     * @param {Phaser.Textures.Texture|string} [texture] - The texture that the frame is from. This is only used if `frame` is a string. If a string is given, it will be used to look up the texture in the Texture Manager. If not given, the first member of `Shader.textures` is used. If `Shader.textures` is empty, an error will occur.
     */
    setTextureCoordinatesFromFrame: function (frame, texture)
    {
        if (typeof frame === 'string')
        {
            if (!texture)
            {
                texture = this.textures[0];
            }
            else if (typeof texture === 'string')
            {
                texture = this.scene.textures.get(texture);
            }
            frame = texture.get(frame);
        }

        var u0 = frame.u0;
        var v0 = frame.v0;
        var u1 = frame.u1;
        var v1 = frame.v1;

        this.setTextureCoordinates(u0, v0, u1, v0, u0, v1, u1, v1);
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.Shader#preDestroy
     * @protected
     * @since 3.17.0
     */
    preDestroy: function ()
    {
        this.renderNode = null;

        this.textures.length = 0;

        if (this.drawingContext)
        {
            this.drawingContext.destroy();
            if (this.texture)
            {
                this.texture.destroy();
            }

            this.drawingContext = null;
            this.glTexture = null;
            this.texture = null;
        }
    }
});

module.exports = Shader;
