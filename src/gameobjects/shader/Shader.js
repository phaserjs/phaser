/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var GetFastValue = require('../../utils/object/GetFastValue');
var Extend = require('../../utils/object/Extend');
var SetValue = require('../../utils/object/SetValue');
var ShaderRender = require('./ShaderRender');
var TransformMatrix = require('../components/TransformMatrix');
var ArrayEach = require('../../utils/array/Each');
var RenderEvents = require('../../renderer/events');

/**
 * @classdesc
 * A Shader Game Object.
 *
 * This Game Object allows you to easily add a quad with its own shader into the display list, and manipulate it
 * as you would any other Game Object, including scaling, rotating, positioning and adding to Containers. Shaders
 * can be masked with either Bitmap or Geometry masks and can also be used as a Bitmap Mask for a Camera or other
 * Game Object. They can also be made interactive and used for input events.
 *
 * It works by taking a reference to a `Phaser.Display.BaseShader` instance, as found in the Shader Cache. These can
 * be created dynamically at runtime, or loaded in via the GLSL File Loader:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.glsl('fire', 'shaders/fire.glsl.js');
 * }
 *
 * function create ()
 * {
 *     this.add.shader('fire', 400, 300, 512, 512);
 * }
 * ```
 *
 * Please see the Phaser 3 Examples GitHub repo for examples of loading and creating shaders dynamically.
 *
 * Due to the way in which they work, you cannot directly change the alpha or blend mode of a Shader. This should
 * be handled via exposed uniforms in the shader code itself.
 *
 * By default a Shader will be created with a standard set of uniforms. These were added to match those
 * found on sites such as ShaderToy or GLSLSandbox, and provide common functionality a shader may need,
 * such as the timestamp, resolution or pointer position. You can replace them by specifying your own uniforms
 * in the Base Shader.
 *
 * These Shaders work by halting the current pipeline during rendering, creating a viewport matched to the
 * size of this Game Object and then renders a quad using the bound shader. At the end, the pipeline is restored.
 *
 * Because it blocks the pipeline it means it will interrupt any batching that is currently going on, so you should
 * use these Game Objects sparingly. If you need to have a fully batched custom shader, then please look at using
 * a custom pipeline instead. However, for background or special masking effects, they are extremely effective.
 *
 * @class Shader
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @webglOnly
 * @since 3.17.0
 *
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {(string|Phaser.Display.BaseShader)} key - The key of the shader to use from the shader cache, or a BaseShader instance.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object.
 * @param {number} [height=128] - The height of the Game Object.
 * @param {string[]} [textures] - Optional array of texture keys to bind to the iChannel0...3 uniforms. The textures must already exist in the Texture Manager.
 * @param {any} [textureData] - Additional texture data if you want to create shader with none NPOT textures.
 */
var Shader = new Class({

    Extends: GameObject,

    Mixins: [
        Components.ComputedSize,
        Components.Depth,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.ScrollFactor,
        Components.Transform,
        Components.Visible,
        ShaderRender
    ],

    initialize:

    function Shader (scene, key, x, y, width, height, textures, textureData)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 128; }
        if (height === undefined) { height = 128; }

        GameObject.call(this, scene, 'Shader');

        /**
         * This Game Object cannot have a blend mode, so skip all checks.
         *
         * @name Phaser.GameObjects.Shader#blendMode
         * @type {number}
         * @private
         * @since 3.17.0
         */
        this.blendMode = -1;

        /**
         * The underlying shader object being used.
         * Empty by default and set during a call to the `setShader` method.
         *
         * @name Phaser.GameObjects.Shader#shader
         * @type {Phaser.Display.BaseShader}
         * @since 3.17.0
         */
        this.shader;

        var renderer = scene.sys.renderer;

        /**
         * A reference to the current renderer.
         * Shaders only work with the WebGL Renderer.
         *
         * @name Phaser.GameObjects.Shader#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.17.0
         */
        this.renderer = renderer;

        /**
         * The WebGL context belonging to the renderer.
         *
         * @name Phaser.GameObjects.Shader#gl
         * @type {WebGLRenderingContext}
         * @since 3.17.0
         */
        this.gl = renderer.gl;

        /**
         * Raw byte buffer of vertices this Shader uses.
         *
         * @name Phaser.GameObjects.Shader#vertexData
         * @type {ArrayBuffer}
         * @since 3.17.0
         */
        this.vertexData = new ArrayBuffer(6 * (Float32Array.BYTES_PER_ELEMENT * 2));

        /**
         * The WebGL vertex buffer object this shader uses.
         *
         * @name Phaser.GameObjects.Shader#vertexBuffer
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @since 3.17.0
         */
        this.vertexBuffer = renderer.createVertexBuffer(this.vertexData.byteLength, this.gl.STREAM_DRAW);

        /**
         * Internal property: whether the shader needs to be created,
         * and if so, the key and textures to use for the shader.
         *
         * @name Phaser.GameObjects.Shader#_deferSetShader
         * @type {?{ key: string, textures: string[]|undefined, textureData: any|undefined }}
         * @private
         * @since 3.80.0
         */
        this._deferSetShader = null;

        /**
         * Internal property: whether the projection matrix needs to be set,
         * and if so, the data to use for the orthographic projection.
         *
         * @name Phaser.GameObjects.Shader#_deferProjOrtho
         * @type {?{ left: number, right: number, bottom: number, top: number }}
         * @private
         * @since 3.80.0
         */
        this._deferProjOrtho = null;

        /**
         * The WebGL shader program this shader uses.
         *
         * @name Phaser.GameObjects.Shader#program
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper}
         * @since 3.17.0
         */
        this.program = null;

        /**
         * Uint8 view to the vertex raw buffer. Used for uploading vertex buffer resources to the GPU.
         *
         * @name Phaser.GameObjects.Shader#bytes
         * @type {Uint8Array}
         * @since 3.17.0
         */
        this.bytes = new Uint8Array(this.vertexData);

        /**
         * Float32 view of the array buffer containing the shaders vertices.
         *
         * @name Phaser.GameObjects.Shader#vertexViewF32
         * @type {Float32Array}
         * @since 3.17.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.GameObjects.Shader#_tempMatrix1
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix1 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.GameObjects.Shader#_tempMatrix2
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.GameObjects.Shader#_tempMatrix3
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix3 = new TransformMatrix();

        /**
         * The view matrix the shader uses during rendering.
         *
         * @name Phaser.GameObjects.Shader#viewMatrix
         * @type {Float32Array}
         * @readonly
         * @since 3.17.0
         */
        this.viewMatrix = new Float32Array([ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]);

        /**
         * The projection matrix the shader uses during rendering.
         *
         * @name Phaser.GameObjects.Shader#projectionMatrix
         * @type {Float32Array}
         * @readonly
         * @since 3.17.0
         */
        this.projectionMatrix = new Float32Array([ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]);

        /**
         * The default uniform mappings. These can be added to (or replaced) by specifying your own uniforms when
         * creating this shader game object. The uniforms are updated automatically during the render step.
         *
         * The defaults are:
         *
         * `resolution` (2f) - Set to the size of this shader.
         * `time` (1f) - The elapsed game time, in seconds.
         * `mouse` (2f) - If a pointer has been bound (with `setPointer`), this uniform contains its position each frame.
         * `date` (4fv) - A vec4 containing the year, month, day and time in seconds.
         * `sampleRate` (1f) - Sound sample rate. 44100 by default.
         * `iChannel0...3` (sampler2D) - Input channels 0 to 3. `null` by default.
         *
         * @name Phaser.GameObjects.Shader#uniforms
         * @type {any}
         * @since 3.17.0
         */
        this.uniforms = {};

        /**
         * The pointer bound to this shader, if any.
         * Set via the chainable `setPointer` method, or by modifying this property directly.
         *
         * @name Phaser.GameObjects.Shader#pointer
         * @type {Phaser.Input.Pointer}
         * @since 3.17.0
         */
        this.pointer = null;

        /**
         * The cached width of the renderer.
         *
         * @name Phaser.GameObjects.Shader#_rendererWidth
         * @type {number}
         * @private
         * @since 3.17.0
         */
        this._rendererWidth = renderer.width;

        /**
         * The cached height of the renderer.
         *
         * @name Phaser.GameObjects.Shader#_rendererHeight
         * @type {number}
         * @private
         * @since 3.17.0
         */
        this._rendererHeight = renderer.height;

        /**
         * Internal texture count tracker.
         *
         * @name Phaser.GameObjects.Shader#_textureCount
         * @type {number}
         * @private
         * @since 3.17.0
         */
        this._textureCount = 0;

        /**
         * A reference to the GL Frame Buffer this Shader is drawing to.
         * This property is only set if you have called `Shader.setRenderToTexture`.
         *
         * @name Phaser.GameObjects.Shader#framebuffer
         * @type {?Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper}
         * @since 3.19.0
         */
        this.framebuffer = null;

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

        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0.5, 0.5);
        this.setShader(key, textures, textureData);

        this.renderer.on(RenderEvents.RESTORE_WEBGL, this.onContextRestored, this);
    },

    /**
     * Compares the renderMask with the renderFlags to see if this Game Object will render or not.
     * Also checks the Game Object against the given Cameras exclusion list.
     *
     * @method Phaser.GameObjects.Shader#willRender
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to check against this Game Object.
     *
     * @return {boolean} True if the Game Object should be rendered, otherwise false.
     */
    willRender: function (camera)
    {
        if (this.renderToTexture)
        {
            return true;
        }
        else
        {
            return !(GameObject.RENDER_MASK !== this.renderFlags || (this.cameraFilter !== 0 && (this.cameraFilter & camera.id)));
        }
    },

    /**
     * Changes this Shader so instead of rendering to the display list it renders to a
     * WebGL Framebuffer and WebGL Texture instead. This allows you to use the output
     * of this shader as an input for another shader, by mapping a sampler2D uniform
     * to it.
     *
     * After calling this method the `Shader.framebuffer` and `Shader.glTexture` properties
     * are populated.
     *
     * Additionally, you can provide a key to this method. Doing so will create a Phaser Texture
     * from this Shader and save it into the Texture Manager, allowing you to then use it for
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
     * You can access the Phaser Texture that is created via the `Shader.texture` property.
     *
     * By default it will create a single base texture. You can add frames to the texture
     * by using the `Texture.add` method. After doing this, you can then allow Game Objects
     * to use a specific frame from a Render Texture.
     *
     * @method Phaser.GameObjects.Shader#setRenderToTexture
     * @since 3.19.0
     *
     * @param {string} [key] - The unique key to store the texture as within the global Texture Manager.
     * @param {boolean} [flipY=false] - Does this texture need vertically flipping before rendering? This should usually be set to `true` if being fed from a buffer.
     *
     * @return {this} This Shader instance.
     */
    setRenderToTexture: function (key, flipY)
    {
        if (flipY === undefined) { flipY = false; }

        if (!this.renderToTexture)
        {
            var width = this.width;
            var height = this.height;
            var renderer = this.renderer;

            this.glTexture = renderer.createTextureFromSource(null, width, height, 0);

            this.framebuffer = renderer.createFramebuffer(width, height, this.glTexture, false);

            this._rendererWidth = width;
            this._rendererHeight = height;

            this.renderToTexture = true;

            this.projOrtho(0, this.width, this.height, 0);

            if (key)
            {
                this.texture = this.scene.sys.textures.addGLTexture(key, this.glTexture);
            }
        }

        //  And now render at least once, so our texture isn't blank on the first update

        if (this.shader)
        {
            renderer.pipelines.clear();

            this.load();
            this.flush();

            renderer.pipelines.rebind();
        }

        return this;
    },

    /**
     * Sets the fragment and, optionally, the vertex shader source code that this Shader will use.
     * This will immediately delete the active shader program, if set, and then create a new one
     * with the given source. Finally, the shader uniforms are initialized.
     *
     * @method Phaser.GameObjects.Shader#setShader
     * @since 3.17.0
     *
     * @param {(string|Phaser.Display.BaseShader)} key - The key of the shader to use from the shader cache, or a BaseShader instance.
     * @param {string[]} [textures] - Optional array of texture keys to bind to the iChannel0...3 uniforms. The textures must already exist in the Texture Manager.
     * @param {any} [textureData] - Additional texture data.
     *
     * @return {this} This Shader instance.
     */
    setShader: function (key, textures, textureData)
    {
        if (this.renderer.contextLost)
        {
            this._deferSetShader = { key: key, textures: textures, textureData: textureData };
            return this;
        }

        if (textures === undefined) { textures = []; }

        if (typeof key === 'string')
        {
            var cache = this.scene.sys.cache.shader;

            if (!cache.has(key))
            {
                console.warn('Shader missing: ' + key);
                return this;
            }

            this.shader = cache.get(key);
        }
        else
        {
            this.shader = key;
        }

        var gl = this.gl;
        var renderer = this.renderer;

        if (this.program)
        {
            renderer.deleteProgram(this.program);
        }

        var program = renderer.createProgram(this.shader.vertexSrc, this.shader.fragmentSrc);

        //  The default uniforms available within the vertex shader
        gl.uniformMatrix4fv(gl.getUniformLocation(program.webGLProgram, 'uViewMatrix'), false, this.viewMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(program.webGLProgram, 'uProjectionMatrix'), false, this.projectionMatrix);
        gl.uniform2f(gl.getUniformLocation(program.webGLProgram, 'uResolution'), this.width, this.height);

        this.program = program;

        var d = new Date();

        //  The default uniforms available within the fragment shader
        var defaultUniforms = {
            resolution: { type: '2f', value: { x: this.width, y: this.height } },
            time: { type: '1f', value: 0 },
            mouse: { type: '2f', value: { x: this.width / 2, y: this.height / 2 } },
            date: { type: '4fv', value: [ d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds() ] },
            sampleRate: { type: '1f', value: 44100.0 },
            iChannel0: { type: 'sampler2D', value: null, textureData: { repeat: true } },
            iChannel1: { type: 'sampler2D', value: null, textureData: { repeat: true } },
            iChannel2: { type: 'sampler2D', value: null, textureData: { repeat: true } },
            iChannel3: { type: 'sampler2D', value: null, textureData: { repeat: true } }
        };

        if (this.shader.uniforms)
        {
            this.uniforms = Extend(true, {}, this.shader.uniforms, defaultUniforms);
        }
        else
        {
            this.uniforms = defaultUniforms;
        }

        for (var i = 0; i < 4; i++)
        {
            if (textures[i])
            {
                this.setSampler2D('iChannel' + i, textures[i], i, textureData);
            }
        }

        this.initUniforms();

        this.projOrtho(0, this._rendererWidth, this._rendererHeight, 0);

        return this;
    },

    /**
     * Binds a Phaser Pointer object to this Shader.
     *
     * The screen position of the pointer will be set in to the shaders `mouse` uniform
     * automatically every frame. Call this method with no arguments to unbind the pointer.
     *
     * @method Phaser.GameObjects.Shader#setPointer
     * @since 3.17.0
     *
     * @param {Phaser.Input.Pointer} [pointer] - The Pointer to bind to this shader.
     *
     * @return {this} This Shader instance.
     */
    setPointer: function (pointer)
    {
        this.pointer = pointer;

        return this;
    },

    /**
     * Sets this shader to use an orthographic projection matrix.
     * This matrix is stored locally in the `projectionMatrix` property,
     * as well as being bound to the `uProjectionMatrix` uniform.
     *
     * @method Phaser.GameObjects.Shader#projOrtho
     * @since 3.17.0
     *
     * @param {number} left - The left value.
     * @param {number} right - The right value.
     * @param {number} bottom - The bottom value.
     * @param {number} top - The top value.
     */
    projOrtho: function (left, right, bottom, top)
    {
        if (this.renderer.contextLost)
        {
            this._deferProjOrtho = { left: left, right: right, bottom: bottom, top: top };
            return;
        }

        var near = -1000;
        var far = 1000;

        var leftRight = 1 / (left - right);
        var bottomTop = 1 / (bottom - top);
        var nearFar = 1 / (near - far);

        var pm = this.projectionMatrix;

        pm[0] = -2 * leftRight;
        pm[5] = -2 * bottomTop;
        pm[10] = 2 * nearFar;
        pm[12] = (left + right) * leftRight;
        pm[13] = (top + bottom) * bottomTop;
        pm[14] = (far + near) * nearFar;

        var program = this.program;

        var gl = this.gl;
        var renderer = this.renderer;

        renderer.setProgram(program);

        gl.uniformMatrix4fv(gl.getUniformLocation(program.webGLProgram, 'uProjectionMatrix'), false, this.projectionMatrix);

        this._rendererWidth = right;
        this._rendererHeight = bottom;
    },

    // Uniforms are specified in the GLSL_ES Specification: http://www.khronos.org/registry/webgl/specs/latest/1.0/
    // http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf

    /**
     * Initializes all of the uniforms this shader uses.
     *
     * @method Phaser.GameObjects.Shader#initUniforms
     * @private
     * @since 3.17.0
     */
    initUniforms: function ()
    {
        var map = this.renderer.glFuncMap;
        var program = this.program;

        this._textureCount = 0;

        for (var key in this.uniforms)
        {
            var uniform = this.uniforms[key];

            var type = uniform.type;
            var data = map[type];

            uniform.uniformLocation = this.renderer.createUniformLocation(program, key);

            if (type !== 'sampler2D')
            {
                uniform.glMatrix = data.matrix;
                uniform.glValueLength = data.length;
                uniform.glFunc = data.func;
            }
        }
    },

    /**
     * Sets a sampler2D uniform on this shader where the source texture is a WebGLTextureBuffer.
     *
     * This allows you to feed the output from one Shader into another:
     *
     * ```javascript
     * let shader1 = this.add.shader(baseShader1, 0, 0, 512, 512).setRenderToTexture();
     * let shader2 = this.add.shader(baseShader2, 0, 0, 512, 512).setRenderToTexture('output');
     *
     * shader1.setSampler2DBuffer('iChannel0', shader2.glTexture, 512, 512);
     * shader2.setSampler2DBuffer('iChannel0', shader1.glTexture, 512, 512);
     * ```
     *
     * In the above code, the result of baseShader1 is fed into Shader2 as the `iChannel0` sampler2D uniform.
     * The result of baseShader2 is then fed back into shader1 again, creating a feedback loop.
     *
     * If you wish to use an image from the Texture Manager as a sampler2D input for this shader,
     * see the `Shader.setSampler2D` method.
     *
     * @method Phaser.GameObjects.Shader#setSampler2DBuffer
     * @since 3.19.0
     *
     * @param {string} uniformKey - The key of the sampler2D uniform to be updated, i.e. `iChannel0`.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} texture - A texture reference.
     * @param {number} width - The width of the texture.
     * @param {number} height - The height of the texture.
     * @param {number} [textureIndex=0] - The texture index.
     * @param {any} [textureData] - Additional texture data.
     *
     * @return {this} This Shader instance.
     */
    setSampler2DBuffer: function (uniformKey, texture, width, height, textureIndex, textureData)
    {
        if (textureIndex === undefined) { textureIndex = 0; }
        if (textureData === undefined) { textureData = {}; }

        var uniform = this.uniforms[uniformKey];

        uniform.value = texture;

        textureData.width = width;
        textureData.height = height;

        uniform.textureData = textureData;

        this._textureCount = textureIndex;

        this.initSampler2D(uniform);

        return this;
    },

    /**
     * Sets a sampler2D uniform on this shader.
     *
     * The textureKey given is the key from the Texture Manager cache. You cannot use a single frame
     * from a texture, only the full image. Also, lots of shaders expect textures to be power-of-two sized.
     *
     * If you wish to use another Shader as a sampler2D input for this shader, see the `Shader.setSampler2DBuffer` method.
     *
     * @method Phaser.GameObjects.Shader#setSampler2D
     * @since 3.17.0
     *
     * @param {string} uniformKey - The key of the sampler2D uniform to be updated, i.e. `iChannel0`.
     * @param {string} textureKey - The key of the texture, as stored in the Texture Manager. Must already be loaded.
     * @param {number} [textureIndex=0] - The texture index.
     * @param {any} [textureData] - Additional texture data.
     *
     * @return {this} This Shader instance.
     */
    setSampler2D: function (uniformKey, textureKey, textureIndex, textureData)
    {
        if (textureIndex === undefined) { textureIndex = 0; }

        var textureManager = this.scene.sys.textures;

        if (textureManager.exists(textureKey))
        {
            var frame = textureManager.getFrame(textureKey);

            if (frame.glTexture && frame.glTexture.isRenderTexture)
            {
                return this.setSampler2DBuffer(uniformKey, frame.glTexture, frame.width, frame.height, textureIndex, textureData);
            }

            var uniform = this.uniforms[uniformKey];
            var source = frame.source;

            uniform.textureKey = textureKey;
            uniform.source = source.image;
            uniform.value = frame.glTexture;

            if (source.isGLTexture)
            {
                if (!textureData)
                {
                    textureData = {};
                }

                textureData.width = source.width;
                textureData.height = source.height;
            }

            if (textureData)
            {
                uniform.textureData = textureData;
            }

            this._textureCount = textureIndex;

            this.initSampler2D(uniform);
        }

        return this;
    },

    /**
     * Sets a property of a uniform already present on this shader.
     *
     * To modify the value of a uniform such as a 1f or 1i use the `value` property directly:
     *
     * ```javascript
     * shader.setUniform('size.value', 16);
     * ```
     *
     * You can use dot notation to access deeper values, for example:
     *
     * ```javascript
     * shader.setUniform('resolution.value.x', 512);
     * ```
     *
     * The change to the uniform will take effect the next time the shader is rendered.
     *
     * @method Phaser.GameObjects.Shader#setUniform
     * @since 3.17.0
     *
     * @param {string} key - The key of the uniform to modify. Use dots for deep properties, i.e. `resolution.value.x`.
     * @param {any} value - The value to set into the uniform.
     *
     * @return {this} This Shader instance.
     */
    setUniform: function (key, value)
    {
        SetValue(this.uniforms, key, value);

        return this;
    },

    /**
     * Returns the uniform object for the given key, or `null` if the uniform couldn't be found.
     *
     * @method Phaser.GameObjects.Shader#getUniform
     * @since 3.17.0
     *
     * @param {string} key - The key of the uniform to return the value for.
     *
     * @return {any} A reference to the uniform object. This is not a copy, so modifying it will update the original object also.
     */
    getUniform: function (key)
    {
        return GetFastValue(this.uniforms, key, null);
    },

    /**
     * A short-cut method that will directly set the texture being used by the `iChannel0` sampler2D uniform.
     *
     * The textureKey given is the key from the Texture Manager cache. You cannot use a single frame
     * from a texture, only the full image. Also, lots of shaders expect textures to be power-of-two sized.
     *
     * @method Phaser.GameObjects.Shader#setChannel0
     * @since 3.17.0
     *
     * @param {string} textureKey - The key of the texture, as stored in the Texture Manager. Must already be loaded.
     * @param {any} [textureData] - Additional texture data.
     *
     * @return {this} This Shader instance.
     */
    setChannel0: function (textureKey, textureData)
    {
        return this.setSampler2D('iChannel0', textureKey, 0, textureData);
    },

    /**
     * A short-cut method that will directly set the texture being used by the `iChannel1` sampler2D uniform.
     *
     * The textureKey given is the key from the Texture Manager cache. You cannot use a single frame
     * from a texture, only the full image. Also, lots of shaders expect textures to be power-of-two sized.
     *
     * @method Phaser.GameObjects.Shader#setChannel1
     * @since 3.17.0
     *
     * @param {string} textureKey - The key of the texture, as stored in the Texture Manager. Must already be loaded.
     * @param {any} [textureData] - Additional texture data.
     *
     * @return {this} This Shader instance.
     */
    setChannel1: function (textureKey, textureData)
    {
        return this.setSampler2D('iChannel1', textureKey, 1, textureData);
    },

    /**
     * A short-cut method that will directly set the texture being used by the `iChannel2` sampler2D uniform.
     *
     * The textureKey given is the key from the Texture Manager cache. You cannot use a single frame
     * from a texture, only the full image. Also, lots of shaders expect textures to be power-of-two sized.
     *
     * @method Phaser.GameObjects.Shader#setChannel2
     * @since 3.17.0
     *
     * @param {string} textureKey - The key of the texture, as stored in the Texture Manager. Must already be loaded.
     * @param {any} [textureData] - Additional texture data.
     *
     * @return {this} This Shader instance.
     */
    setChannel2: function (textureKey, textureData)
    {
        return this.setSampler2D('iChannel2', textureKey, 2, textureData);
    },

    /**
     * A short-cut method that will directly set the texture being used by the `iChannel3` sampler2D uniform.
     *
     * The textureKey given is the key from the Texture Manager cache. You cannot use a single frame
     * from a texture, only the full image. Also, lots of shaders expect textures to be power-of-two sized.
     *
     * @method Phaser.GameObjects.Shader#setChannel3
     * @since 3.17.0
     *
     * @param {string} textureKey - The key of the texture, as stored in the Texture Manager. Must already be loaded.
     * @param {any} [textureData] - Additional texture data.
     *
     * @return {this} This Shader instance.
     */
    setChannel3: function (textureKey, textureData)
    {
        return this.setSampler2D('iChannel3', textureKey, 3, textureData);
    },

    /**
     * Internal method that takes a sampler2D uniform and prepares it for use by setting the
     * gl texture parameters.
     *
     * @method Phaser.GameObjects.Shader#initSampler2D
     * @private
     * @since 3.17.0
     *
     * @param {any} uniform - The sampler2D uniform to process.
     */
    initSampler2D: function (uniform)
    {
        if (!uniform.value)
        {
            return;
        }

        //  Extended texture data

        var data = uniform.textureData;

        if (data && !uniform.value.isRenderTexture)
        {
            var gl = this.gl;
            var wrapper = uniform.value;
            
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D

            //  mag / minFilter can be: gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR or gl.NEAREST
            //  wrapS/T can be: gl.CLAMP_TO_EDGE or gl.REPEAT
            //  format can be: gl.LUMINANCE or gl.RGBA

            var magFilter = gl[GetFastValue(data, 'magFilter', 'linear').toUpperCase()];
            var minFilter = gl[GetFastValue(data, 'minFilter', 'linear').toUpperCase()];
            var wrapS = gl[GetFastValue(data, 'wrapS', 'repeat').toUpperCase()];
            var wrapT = gl[GetFastValue(data, 'wrapT', 'repeat').toUpperCase()];
            var format = gl[GetFastValue(data, 'format', 'rgba').toUpperCase()];
            var flipY = GetFastValue(data, 'flipY', false);
            var width = GetFastValue(data, 'width', wrapper.width);
            var height = GetFastValue(data, 'height', wrapper.height);
            var source = GetFastValue(data, 'source', wrapper.pixels);

            if (data.repeat)
            {
                wrapS = gl.REPEAT;
                wrapT = gl.REPEAT;
            }

            if (data.width)
            {
                // If the uniform has resolution, use a blank texture.
                source = null;
            }

            wrapper.update(source, width, height, flipY, wrapS, wrapT, minFilter, magFilter, format);
        }

        this.renderer.setProgram(this.program);

        this._textureCount++;
    },

    /**
     * Synchronizes all of the uniforms this shader uses.
     * Each uniforms gl function is called in turn.
     *
     * @method Phaser.GameObjects.Shader#syncUniforms
     * @private
     * @since 3.17.0
     */
    syncUniforms: function ()
    {
        var gl = this.gl;

        var uniforms = this.uniforms;
        var uniform;
        var length;
        var glFunc;
        var location;
        var value;
        var textureCount = 0;

        for (var key in uniforms)
        {
            uniform = uniforms[key];

            glFunc = uniform.glFunc;
            length = uniform.glValueLength;
            location = uniform.uniformLocation;
            value = uniform.value;

            if (value === null)
            {
                continue;
            }

            if (length === 1)
            {
                if (uniform.glMatrix)
                {
                    glFunc.call(gl, location.webGLUniformLocation, uniform.transpose, value);
                }
                else
                {
                    glFunc.call(gl, location.webGLUniformLocation, value);
                }
            }
            else if (length === 2)
            {
                glFunc.call(gl, location.webGLUniformLocation, value.x, value.y);
            }
            else if (length === 3)
            {
                glFunc.call(gl, location.webGLUniformLocation, value.x, value.y, value.z);
            }
            else if (length === 4)
            {
                glFunc.call(gl, location.webGLUniformLocation, value.x, value.y, value.z, value.w);
            }
            else if (uniform.type === 'sampler2D')
            {
                gl.activeTexture(gl.TEXTURE0 + textureCount);

                gl.bindTexture(gl.TEXTURE_2D, value.webGLTexture);

                gl.uniform1i(location.webGLUniformLocation, textureCount);

                textureCount++;
            }
        }
    },

    /**
     * Called automatically during render.
     *
     * This method performs matrix ITRS and then stores the resulting value in the `uViewMatrix` uniform.
     * It then sets up the vertex buffer and shader, updates and syncs the uniforms ready
     * for flush to be called.
     *
     * @method Phaser.GameObjects.Shader#load
     * @since 3.17.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} [matrix2D] - The transform matrix to use during rendering.
     */
    load: function (matrix2D)
    {
        //  ITRS

        var gl = this.gl;
        var width = this.width;
        var height = this.height;
        var renderer = this.renderer;
        var program = this.program;
        var vm = this.viewMatrix;

        if (!this.renderToTexture)
        {
            var x = -this._displayOriginX;
            var y = -this._displayOriginY;

            vm[0] = matrix2D[0];
            vm[1] = matrix2D[1];
            vm[4] = matrix2D[2];
            vm[5] = matrix2D[3];
            vm[8] = matrix2D[4];
            vm[9] = matrix2D[5];
            vm[12] = vm[0] * x + vm[4] * y;
            vm[13] = vm[1] * x + vm[5] * y;
        }

        //  Update vertex shader uniforms

        gl.useProgram(program.webGLProgram);

        gl.uniformMatrix4fv(gl.getUniformLocation(program.webGLProgram, 'uViewMatrix'), false, vm);
        gl.uniformMatrix4fv(gl.getUniformLocation(program.webGLProgram, 'uProjectionMatrix'), false, this.projectionMatrix);
        gl.uniform2f(gl.getUniformLocation(program.webGLProgram, 'uResolution'), this.width, this.height);

        //  Update fragment shader uniforms

        var uniforms = this.uniforms;
        var res = uniforms.resolution;

        res.value.x = width;
        res.value.y = height;

        uniforms.time.value = renderer.game.loop.getDuration();

        var pointer = this.pointer;

        if (pointer)
        {
            var mouse = uniforms.mouse;

            var px = pointer.x / width;
            var py = 1 - pointer.y / height;

            mouse.value.x = px.toFixed(2);
            mouse.value.y = py.toFixed(2);
        }

        this.syncUniforms();
    },

    /**
     * Called automatically during render.
     *
     * Sets the active shader, loads the vertex buffer and then draws.
     *
     * @method Phaser.GameObjects.Shader#flush
     * @since 3.17.0
     */
    flush: function ()
    {
        //  Bind

        var width = this.width;
        var height = this.height;
        var program = this.program;

        var gl = this.gl;
        var vertexBuffer = this.vertexBuffer;
        var renderer = this.renderer;
        var vertexSize = Float32Array.BYTES_PER_ELEMENT * 2;

        if (this.renderToTexture)
        {
            renderer.setFramebuffer(this.framebuffer);

            gl.clearColor(0, 0, 0, 0);

            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.webGLBuffer);

        var location = gl.getAttribLocation(program.webGLProgram, 'inPosition');

        if (location !== -1)
        {
            gl.enableVertexAttribArray(location);

            gl.vertexAttribPointer(location, 2, gl.FLOAT, false, vertexSize, 0);
        }

        //  Draw

        var vf = this.vertexViewF32;

        vf[3] = height;
        vf[4] = width;
        vf[5] = height;
        vf[8] = width;
        vf[9] = height;
        vf[10] = width;

        //  Flush

        var vertexCount = 6;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));

        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

        if (this.renderToTexture)
        {
            renderer.setFramebuffer(null, false);
        }
    },

    /**
     * A NOOP method so you can pass a Shader to a Container.
     * Calling this method will do nothing. It is intentionally empty.
     *
     * @method Phaser.GameObjects.Shader#setAlpha
     * @private
     * @since 3.17.0
     */
    setAlpha: function ()
    {
    },

    /**
     * A NOOP method so you can pass a Shader to a Container.
     * Calling this method will do nothing. It is intentionally empty.
     *
     * @method Phaser.GameObjects.Shader#setBlendMode
     * @private
     * @since 3.17.0
     */
    setBlendMode: function ()
    {
    },

    /**
     * Run any logic that was deferred during context loss.
     * 
     * @method Phaser.GameObjects.Shader#onContextRestored
     * @since 3.80.0
     */
    onContextRestored: function ()
    {
        if (this._deferSetShader !== null)
        {
            var key = this._deferSetShader.key;
            var textures = this._deferSetShader.textures;
            var textureData = this._deferSetShader.textureData;
            this._deferSetShader = null;
            this.setShader(key, textures, textureData);
        }

        if (this._deferProjOrtho !== null)
        {
            var left = this._deferProjOrtho.left;
            var right = this._deferProjOrtho.right;
            var bottom = this._deferProjOrtho.bottom;
            var top = this._deferProjOrtho.top;
            this._deferProjOrtho = null;
            this.projOrtho(left, right, bottom, top);
        }
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
        var renderer = this.renderer;

        renderer.off(RenderEvents.RESTORE_WEBGL, this.onContextRestored, this);
        renderer.deleteProgram(this.program);
        renderer.deleteBuffer(this.vertexBuffer);

        if (this.renderToTexture)
        {
            renderer.deleteFramebuffer(this.framebuffer);

            this.texture.destroy();

            this.framebuffer = null;
            this.glTexture = null;
            this.texture = null;
        }

        ArrayEach(this.uniforms, function (uniform)
        {
            renderer.deleteUniformLocation(uniform.uniformLocation);
            uniform.uniformLocation = null;
        });
    }

});

module.exports = Shader;
