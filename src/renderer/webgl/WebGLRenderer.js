var Class = require('../../utils/Class');
var CONST = require('../../const');
var WebGLSnapshot = require('../snapshot/WebGLSnapshot');
var IsSizePowerOfTwo = require('../../math/pow2/IsSizePowerOfTwo');
var Utils = require('./Utils');

// Default Pipelines
var TextureTintPipeline = require('./pipelines/TextureTintPipeline');
var FlatTintPipeline = require('./pipelines/FlatTintPipeline');
var BitmapMaskPipeline = require('./pipelines/BitmapMaskPipeline');
var ForwardDiffuseLightPipeline = require('./pipelines/ForwardDiffuseLightPipeline');

/**
 * @namespace Phaser.Renderer.WebGLRenderer
 */

var WebGLRenderer = new Class({

    initialize:

    function WebGLRenderer (game)
    {
        var renderer = this;
        var contextCreationConfig = {
            alpha: game.config.transparent,
            depth: false, // enable when 3D is added in the future
            antialias: game.config.antialias,
            premultipliedAlpha: game.config.transparent,
            stencil: true,
            preserveDrawingBuffer: game.config.preserveDrawingBuffer,
            failIfMajorPerformanceCaveat: false,
            powerPreference: game.config.powerPreference
        };

        this.config = {
            clearBeforeRender: game.config.clearBeforeRender,
            pixelArt: game.config.pixelArt,
            backgroundColor: game.config.backgroundColor,
            contextCreation: contextCreationConfig,
            resolution: game.config.resolution
        };
        this.game = game;
        this.type = CONST.WEBGL;
        this.width = game.config.width * game.config.resolution;
        this.height = game.config.height * game.config.resolution;
        this.canvas = game.canvas;
        this.lostContextCallbacks = [];
        this.restoredContextCallbacks = [];
        this.blendModes = [];
        this.nativeTextures = [];
        this.contextLost = false;
        this.autoResize = false;
        this.pipelines = null;
        this.snapshotState = {
            callback: null,
            type: null,
            encoder: null
        };

        for (var i = 0; i <= 16; i++)
        {
            this.blendModes.push({ func: [ WebGLRenderingContext.ONE, WebGLRenderingContext.ONE_MINUS_SRC_ALPHA ], equation: WebGLRenderingContext.FUNC_ADD });
        }

        this.blendModes[1].func = [ WebGLRenderingContext.ONE,          WebGLRenderingContext.DST_ALPHA ];
        this.blendModes[2].func = [ WebGLRenderingContext.DST_COLOR,    WebGLRenderingContext.ONE_MINUS_SRC_ALPHA ];
        this.blendModes[3].func = [ WebGLRenderingContext.ONE,          WebGLRenderingContext.ONE_MINUS_SRC_COLOR ];

        // Intenal Renderer State (Textures, Framebuffers, Pipelines, Buffers, etc)
        this.currentTextures = new Array(16);
        this.currentFramebuffer = null;
        this.currentPipeline = null;
        this.currentProgram = null;
        this.currentVertexBuffer = null;
        this.currentIndexBuffer = null;
        this.currentBlendMode = Infinity;
        this.currentScissorEnabled = false;
        this.currentScissor = new Uint32Array([0, 0, this.width, this.height]);
        this.currentScissorIdx = 0;
        this.scissorStack = new Uint32Array(4 *  1000);

        // Setup context lost and restore event listeners
        this.canvas.addEventListener('webglcontextlost', function (event) {
            renderer.contextLost = true;
            event.preventDefault();

            for (var index = 0; index < renderer.lostContextCallbacks.length; ++index)
            {
                var callback = renderer.lostContextCallbacks[index];
                callback[0].call(callback[1], renderer);
            }
        }, false);

        this.canvas.addEventListener('webglcontextrestored', function (event) {
            renderer.contextLost = false;
            renderer.init(renderer.config);
            for (var index = 0; index < renderer.restoredContextCallbacks.length; ++index)
            {
                var callback = renderer.restoredContextCallbacks[index];
                callback[0].call(callback[1], renderer);
            }
        }, false);

        // This are initialized post context creation
        this.gl = null;
        this.supportedExtensions = null;
        this.extensions = {};

        this.init(this.config);
    },

    init: function (config)
    {
        var canvas = this.canvas;
        var clearColor = config.backgroundColor;
        var gl = canvas.getContext('webgl', config.contextCreation) || canvas.getContext('experimental-webgl', config.contextCreation);
    
        if (!gl)
        {
            this.contextLost = true;
            throw new Error('This browser does not support WebGL. Try using the Canvas pipeline.');
        }

        this.gl = gl;

        // Load supported extensions
        this.supportedExtensions = gl.getSupportedExtensions();

        // Setup initial WebGL state
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.SCISSOR_TEST);
        gl.enable(gl.BLEND);
        gl.clearColor(clearColor.redGL, clearColor.greenGL, clearColor.blueGL, 1.0);

        // Initialize all textures to null
        for (var index = 0; index < this.currentTextures.length; ++index)
        {
            this.currentTextures[index] = null;
        }

        // Clear previous pipelines and reload default ones
        this.pipelines = {};

        this.addPipeline('TextureTintPipeline', new TextureTintPipeline(this.game, gl, this));
        this.addPipeline('FlatTintPipeline', new FlatTintPipeline(this.game, gl, this));
        this.addPipeline('BitmapMaskPipeline', new BitmapMaskPipeline(this.game, gl, this));
        this.addPipeline('Light2D', new ForwardDiffuseLightPipeline(this.game, gl, this));
        
        this.setBlendMode(CONST.BlendModes.NORMAL);
        this.resize(this.width, this.height, config.resolution);
    
        return this;
    },

    resize: function (width, height, resolution)
    {
        var gl = this.gl;
        var pipelines = this.pipelines;

        this.width = width * resolution;
        this.height = height * resolution;
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        if (this.autoResize)
        {
            this.canvas.style.width = (this.width / resolution) + 'px';
            this.canvas.style.height = (this.height / resolution) + 'px';
        }

        gl.viewport(0, 0, this.width, this.height);

        // Update all registered pipelines
        for (var pipelineName in pipelines)
        {
            pipelines[pipelineName].resize(width, height, resolution);
        }

        return this;
    },

    onContextRestored: function (callback, target)
    {
        this.restoredContextCallbacks.push([callback, target]);
        return this;
    },

    onContextLost: function (callback, target)
    {
        this.lostContextCallbacks.push([callback, target]);
        return this;
    },

    hasExtension: function (extensionName)
    {
        return this.supportedExtensions ? this.supportedExtensions.indexOf(extensionName) : false;
    },

    getExtension: function (extensionName)
    {
        if (!this.hasExtension(extensionName)) return null;

        if (!(extensionName in this.extensions))
        {
            this.extensions[extensionName] = this.gl.getExtension(extensionName);
        }

        return this.extensions[extensionName];
    },

    flush: function ()
    {
        if (this.currentPipeline)
        {
            this.currentPipeline.flush();
        }
    },

    /* Renderer State Manipulation Functions */

    hasPipeline: function (pipelineName)
    {
        return (pipelineName in this.pipelines);
    },

    getPipeline: function (pipelineName)
    {
        if (this.hasPipeline(pipelineName)) return this.pipelines[pipelineName];
        return null;
    },

    removePipeline: function (pipelineName)
    {
        delete this.pipelines[pipelineName];
        return this;
    },

    addPipeline: function (pipelineName, pipelineInstance)
    {
        if (!this.hasPipeline(pipelineName)) this.pipelines[pipelineName] = pipelineInstance;
        else console.warn('Pipeline', pipelineName, ' already exists.');

        pipelineInstance.name = pipelineName;
        this.pipelines[pipelineName].resize(this.width, this.height, this.config.resolution);

        return this;
    },

    setScissor: function (x, y, w, h)
    {
        var gl = this.gl;
        var currentScissor = this.currentScissor;
        var enabled = (x == 0 && y == 0 && w == gl.canvas.width && h == gl.canvas.height && w >= 0 && h >= 0);

        if (currentScissor[0] !== x || 
            currentScissor[1] !== y || 
            currentScissor[2] !== w || 
            currentScissor[3] !== h)
        {
            this.flush();
        }

        currentScissor[0] = x;
        currentScissor[1] = y;
        currentScissor[2] = w;
        currentScissor[3] = h;

        this.currentScissorEnabled = enabled;

        if (enabled)
        {
            gl.disable(gl.SCISSOR_TEST);
            return;
        }

        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(x, (gl.drawingBufferHeight - y - h), w, h);

        return this;
    },

    pushScissor: function (x, y, w, h)
    {
        var scissorStack = this.scissorStack;
        var stackIndex = this.currentScissorIdx;
        var currentScissor = this.currentScissor;

        scissorStack[stackIndex + 0] = currentScissor[0];
        scissorStack[stackIndex + 1] = currentScissor[1];
        scissorStack[stackIndex + 2] = currentScissor[2];
        scissorStack[stackIndex + 3] = currentScissor[3];
        
        this.currentScissorIdx += 4;
        this.setScissor(x, y, w, h);

        return this;
    },

    popScissor: function ()
    {
        var scissorStack = this.scissorStack;
        var stackIndex = this.currentScissorIdx - 4;
        
        var x = scissorStack[stackIndex + 0];
        var y = scissorStack[stackIndex + 1];
        var w = scissorStack[stackIndex + 2];
        var h = scissorStack[stackIndex + 3];

        this.currentScissorIdx = stackIndex;
        this.setScissor(x, y, w, h); 
        
        return this;
    },

    setPipeline: function (pipelineInstance)
    {
        if (this.currentPipeline !== pipelineInstance ||
            this.currentPipeline.vertexBuffer !== this.currentVertexBuffer ||
            this.currentPipeline.program !== this.currentProgram)
        {
            this.flush();
            this.currentPipeline = pipelineInstance;
            this.currentPipeline.bind();
        }

        this.currentPipeline.onBind();

        return this.currentPipeline;
    },

    setBlendMode: function (blendModeId)
    {
        var gl = this.gl;
        var blendMode = this.blendModes[blendModeId];

        if (blendModeId !== CONST.BlendModes.SKIP_CHECK &&
            this.currentBlendMode !== blendModeId)
        {
            this.flush();

            gl.enable(gl.BLEND);
            gl.blendEquation(blendMode.equation);

            if (blendMode.func.length > 2)
            {
                gl.blendFuncSeparate(blendMode.func[0], blendMode.func[1], blendMode.func[2], blendMode.func[3]);
            }
            else
            {
                gl.blendFunc(blendMode.func[0], blendMode.func[1]);
            }

            this.currentBlendMode = blendModeId;
        }

        return this;
    },

    setTexture2D: function (texture, textureUnit)
    {
        var gl = this.gl;

        if (texture !== this.currentTextures[textureUnit])
        {
            this.flush();

            gl.activeTexture(gl.TEXTURE0 + textureUnit);
            gl.bindTexture(gl.TEXTURE_2D, texture);

            this.currentTextures[textureUnit] = texture;
        }

        return this;
    },

    setFramebuffer: function (framebuffer)
    {
        var gl = this.gl;

        if (framebuffer !== this.currentFramebuffer)
        {
            this.flush();

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            this.currentFramebuffer = framebuffer;
        }

        return this;
    },

    setProgram: function (program)
    {
        var gl = this.gl;

        if (program !== this.currentProgram)
        {
            this.flush();

            gl.useProgram(program);
            this.currentProgram = program;
        }

        return this;
    },

    setVertexBuffer: function (vertexBuffer)
    {
        var gl = this.gl;

        if (vertexBuffer !== this.currentVertexBuffer)
        {
            this.flush();

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            this.currentVertexBuffer = vertexBuffer;
        }

        return this;
    },

    setIndexBuffer: function (indexBuffer)
    {
        var gl = this.gl;

        if (indexBuffer !== this.currentIndexBuffer)
        {
            this.flush();
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            this.currentIndexBuffer = indexBuffer;
        }

        return this;
    },

    /* Renderer Resource Creation Functions */
    createTextureFromSource: function (source, width, height, scaleMode)
    {   
        var gl = this.gl;
        var filter = gl.NEAREST;
        var wrap = gl.CLAMP_TO_EDGE;
        var texture = null;

        width = source ? source.width : width;
        height = source ? source.height : height;

        if (IsSizePowerOfTwo(width, height))
        {
            wrap = gl.REPEAT;
        }

        if (scaleMode === CONST.ScaleModes.LINEAR)
        {
            filter = gl.LINEAR;
        }
        else if (scaleMode === CONST.ScaleModes.NEAREST || this.config.pixelArt)
        {
            filter = gl.NEAREST;
        }

        if (!source && typeof width === 'number' && typeof height === 'number')
        {
            texture = this.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
        }
        else
        {
            texture = this.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, source);
        }

        return texture;
    },

    createTexture2D: function (mipLevel, minFilter, magFilter, wrapT, wrapS, format, pixels, width, height, pma)
    {
        var gl = this.gl;
        var texture = gl.createTexture();

        pma = (pma === undefined ||  pma === null) ? true : pma;

        this.setTexture2D(texture, 0);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, pma);

        if (pixels === null || pixels === undefined)
        {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, width, height, 0, format, gl.UNSIGNED_BYTE, null);
        }
        else
        {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, format, gl.UNSIGNED_BYTE, pixels);
            width = pixels.width;
            height = pixels.height;
        }

        this.setTexture2D(null, 0);

        texture.isAlphaPremultiplied = pma;
        texture.isRenderTexture = false;
        texture.width = width;
        texture.height = height;

        this.nativeTextures.push(texture);

        return texture;
    },

    createFramebuffer: function (width, height, renderTexture, addDepthStencilBuffer)
    {
        var gl = this.gl;
        var framebuffer = gl.createFramebuffer();
        var complete = 0;

        this.setFramebuffer(framebuffer);

        if (addDepthStencilBuffer)
        {
            var depthStencilBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencilBuffer);
        }

        renderTexture.isRenderTexture = true;
        renderTexture.isAlphaPremultiplied = false;

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderTexture, 0);

        complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (complete !== gl.FRAMEBUFFER_COMPLETE)
        {
            var errors = {
                36054: 'Incomplete Attachment',
                36055: 'Missing Attachment',
                36057: 'Incomplete Dimensions',
                36061: 'Framebuffer Unsupported'
            };
            throw new Error('Framebuffer incomplete. Framebuffer status: ' + errors[complete]);
        }

        framebuffer.renderTexture = renderTexture;

        this.setFramebuffer(null);

        return framebuffer;
    },

    createProgram: function (vertexShader, fragmentShader)
    {
        var gl = this.gl;
        var program = gl.createProgram();
        var vs = gl.createShader(gl.VERTEX_SHADER);
        var fs = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vs, vertexShader);
        gl.shaderSource(fs, fragmentShader);
        gl.compileShader(vs);
        gl.compileShader(fs);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
        {
            throw new Error('Failed to compile Vertex Shader:\n' + gl.getShaderInfoLog(vs));
        }
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
        {
            throw new Error('Failed to compile Fragment Shader:\n' + gl.getShaderInfoLog(fs));
        }

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            throw new Error('Failed to link program:\n' + gl.getProgramInfoLog(program));
        }

        return program;
    },

    createVertexBuffer: function (initialDataOrSize, bufferUsage)
    {
        var gl = this.gl;
        var vertexBuffer = gl.createBuffer();

        this.setVertexBuffer(vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, initialDataOrSize, bufferUsage);
        this.setVertexBuffer(null);

        return vertexBuffer;
    },

    createIndexBuffer: function (initialDataOrSize, bufferUsage)
    {
        var gl = this.gl;
        var indexBuffer = gl.createBuffer();

        this.setIndexBuffer(indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, initialDataOrSize, bufferUsage);
        this.setIndexBuffer(null);

        return indexBuffer;
    },

    deleteTexture: function (texture)
    {
        return this;
    },

    deleteFramebuffer: function (framebuffer)
    {
        return this;
    },

    deleteProgram: function (program)
    {
        return this;
    },

    deleteBuffer: function (vertexBuffer)
    {
        return this;
    },

    /* Rendering Functions */
    preRenderCamera: function (camera)
    {
        this.pushScissor(camera.x, camera.y, camera.width, camera.height);
        
        if (camera.backgroundColor.alphaGL > 0)
        {
            var color = camera.backgroundColor;
            var FlatTintPipeline = this.pipelines.FlatTintPipeline;

            FlatTintPipeline.batchFillRect(
                0, 0, 1, 1, 0, 
                camera.x, camera.y, camera.width, camera.height, 
                Utils.getTintFromFloats(color.redGL, color.greenGL, color.blueGL, 1.0),
                color.alphaGL,
                1, 0, 0, 1, 0, 0,
                [1, 0, 0, 1, 0, 0]
            );

            FlatTintPipeline.flush();
        }
    },

    postRenderCamera: function (camera)
    {
        if (camera._fadeAlpha > 0 || camera._flashAlpha > 0)
        {
            var FlatTintPipeline = this.pipelines.FlatTintPipeline;

            // Fade
            FlatTintPipeline.batchFillRect(
                0, 0, 1, 1, 0, 
                camera.x, camera.y, camera.width, camera.height, 
                Utils.getTintFromFloats(camera._fadeRed, camera._fadeGreen, camera._fadeBlue, 1.0),
                camera._fadeAlpha,
                1, 0, 0, 1, 0, 0,
                [1, 0, 0, 1, 0, 0]
            );

            // Flash
            FlatTintPipeline.batchFillRect(
                0, 0, 1, 1, 0, 
                camera.x, camera.y, camera.width, camera.height, 
                Utils.getTintFromFloats(camera._flashRed, camera._flashGreen, camera._flashBlue, 1.0),
                camera._flashAlpha,
                1, 0, 0, 1, 0, 0,
                [1, 0, 0, 1, 0, 0]
            );

            FlatTintPipeline.flush();
        }

        this.popScissor();
    },

    preRender: function ()
    {
        if (this.contextLost) return;

        var gl = this.gl;
        var color = this.config.backgroundColor;
        var pipelines = this.pipelines;

        // Bind custom framebuffer here
        gl.clearColor(color.redGL, color.greenGL, color.blueGL, color.alphaGL);

        if (this.config.clearBeforeRender)
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

        for (var key in pipelines)
        {
            pipelines[key].onPreRender();
        }
    },

    render: function (scene, children, interpolationPercentage, camera)
    {
        if (this.contextLost) return;

        var gl = this.gl;
        var list = children.list;
        var childCount = list.length;
        var pipelines = this.pipelines;

        for (var key in pipelines)
        {
            pipelines[key].onRender(scene, camera);
        }

        this.preRenderCamera(camera);

        for (var index = 0; index < childCount; ++index)
        {
            var child = list[index];

            if (!child.willRender())
            {
                continue;
            }

            if (child.blendMode !== this.currentBlendMode)
            {
                this.setBlendMode(child.blendMode);
            }

            if (child.mask)
            {
                child.mask.preRenderWebGL(this, child, camera);
            }

            child.renderWebGL(this, child, interpolationPercentage, camera);

            if (child.mask)
            {
                child.mask.postRenderWebGL(this, child);
            }
        }

        this.flush();
        this.setBlendMode(CONST.BlendModes.NORMAL);
        this.postRenderCamera(camera);
    },

    postRender: function ()
    {
        if (this.contextLost) return;

        // Unbind custom framebuffer here

        if (this.snapshotState.callback)
        {
            this.snapshotState.callback(WebGLSnapshot(this.canvas, this.snapshotState.type, this.snapshotState.encoder));
            this.snapshotState.callback = null;
        }

        var pipelines = this.pipelines;

        for (var key in pipelines)
        {
            pipelines[key].onPostRender();
        }
    },

    snapshot: function (callback, type, encoderOptions)
    {
        this.snapshotState.callback = callback;
        this.snapshotState.type = type;
        this.snapshotState.encoder = encoderOptions;
        return this;
    },

    canvasToTexture: function (srcCanvas, dstTexture, shouldReallocate, scaleMode)
    {
        var gl = this.gl;

        if (!dstTexture)
        {
            var wrapping = gl.CLAMP_TO_EDGE;

            if (IsSizePowerOfTwo(srcCanvas.width, srcCanvas.height))
            {
                wrapping = gl.REPEAT;
            }

            dstTexture = this.createTexture2D(0, gl.NEAREST, gl.NEAREST, wrapping, wrapping, gl.RGBA, srcCanvas, srcCanvas.width, srcCanvas.height, true);
        }
        else
        {
            this.setTexture2D(dstTexture, 0);

            if (!shouldReallocate)
            {
                gl.texSubImage2D(0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvas);
            }
            else
            {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvas);
                dstTexture.width = srcCanvas.width;
                dstTexture.height = srcCanvas.height;
            }

            this.setTexture2D(null, 0);
        }

        return dstTexture;
    },

    setTextureFilter: function (texture, filter)
    {
        var gl = this.gl;
        var glFilter = [ gl.LINEAR, gl.NEAREST ][filter];

        this.setTexture2D(texture, 0);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter);

        this.setTexture2D(null, 0);

        return this;
    },

    setFloat1: function (program, name, x)
    {
        this.setProgram(program);
        this.gl.uniform1f(this.gl.getUniformLocation(program, name), x);
        return this;
    },

    setFloat2: function (program, name, x, y)
    {
        this.setProgram(program);
        this.gl.uniform2f(this.gl.getUniformLocation(program, name), x, y);
        return this;
    },

    setFloat3: function (program, name, x, y, z)
    {
        this.setProgram(program);
        this.gl.uniform3f(this.gl.getUniformLocation(program, name), x, y, z);
        return this;
    },

    setFloat4: function (program, name, x, y, z, w)
    {
        this.setProgram(program);
        this.gl.uniform4f(this.gl.getUniformLocation(program, name), x, y, z, w);
        return this;
    },

    setInt1: function (program, name, x)
    {
        this.setProgram(program);
        this.gl.uniform1i(this.gl.getUniformLocation(program, name), x);
        return this;
    },

    setInt2: function (program, name, x, y)
    {
        this.setProgram(program);
        this.gl.uniform2i(this.gl.getUniformLocation(program, name), x, y);
        return this;
    },

    setInt3: function (program, name, x, y, z)
    {
        this.setProgram(program);
        this.gl.uniform3i(this.gl.getUniformLocation(program, name), x, y, z);
        return this;
    },

    setInt4: function (program, name, x, y, z, w)
    {
        this.setProgram(program);
        this.gl.uniform4i(this.gl.getUniformLocation(program, name), x, y, z, w);
        return this;
    },

    setMatrix2: function (program, name, transpose, matrix)
    {
        this.setProgram(program);
        this.gl.uniformMatrix2fv(this.gl.getUniformLocation(program, name), transpose, matrix);
        return this;
    },

    setMatrix3: function (program, name, transpose, matrix)
    {
        this.setProgram(program);
        this.gl.uniformMatrix3fv(this.gl.getUniformLocation(program, name), transpose, matrix);
        return this;
    },

    setMatrix4: function (program, name, transpose, matrix)
    {
        this.setProgram(program);
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(program, name), transpose, matrix);
        return this;
    },

    destroy: function ()
    {
        var gl = this.gl;

        //  Clear-up anything that should be cleared :)
        for (var key in this.pipelines)
        {
            this.pipelines[key].destroy();
            delete this.pipelines[key];
        }

        for (var index = 0; index < this.nativeTextures.length; ++index)
        {
            this.deleteTexture(this.nativeTextures[index]);
            delete this.nativeTextures[index];                
        }

        if (this.hasExtension('WEBGL_lose_context'))
        {
            this.getExtension('WEBGL_lose_context').loseContext();
        }
        
        delete this.gl;
        delete this.game;

        this.contextLost = true;
        this.extensions = {};
        this.nativeTextures.length = 0;
    }

});

module.exports = WebGLRenderer;
