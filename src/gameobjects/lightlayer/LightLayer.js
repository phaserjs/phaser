
var Class = require('../../utils/Class');
var Components = require('../components');
var Const = require('./Const');
var GameObject = require('../GameObject');
var GBufferShader = require('../../renderer/webgl/shaders/GBufferShader');
var Light = require('./Light');
var LightFragmentShader = require('../../renderer/webgl/shaders/LightFragmentShader');
var Phong2DShaderDeferred = require('../../renderer/webgl/shaders/Phong2DShaderDeferred');
var Render = require('./LightLayerRender');
var SpriteNormalPair = require('./SpriteNormalPair');
var TexturedAndNormalizedTintedShader = require('../../renderer/webgl/shaders/TexturedAndNormalizedTintedShader');
var VertexBuffer = require('../../renderer/webgl/resources/VertexBuffer');
var WebGLSupportedExtensions = require('../../renderer/webgl/WebGLSupportedExtensions');

// http://cpetry.github.io/NormalMap-Online/

var LightLayer = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Origin,
        Components.RenderTarget,
        Components.ScrollFactor,
        Components.Visible,
        Render
    ],

    initialize:

    function LightLayer (scene)
    {
        var _this = this;

        GameObject.call(this, scene, 'LightLayer');

        this.passShader = null;
        this.gl = null;
        this.ambientLightColorR = 0.0;
        this.ambientLightColorG = 0.0;
        this.ambientLightColorB = 0.0;
        this.lightPool = [];
        this.spritePool = [];
        this.lights = [];
        this.sprites = [];
        this._z = 0;
        this.setOrigin(0, 0);

        scene.sys.game.renderer.addContextRestoredCallback(function (renderer) {
            _this.onContextRestored(renderer);
        });

        this.init(scene.sys.game.renderer, WebGLSupportedExtensions.has('WEBGL_draw_buffers'));
    },

    onContextRestored: function (renderer)
    {
        /* It won't allow the use of drawBuffers on restored context */
        this.init(renderer, false); 
        this.renderWebGL = require('./ForwardRenderer');
        this.lights.length = Math.min(this.lights.length, Const.MAX_LIGHTS);
    },

    init: function (renderer, deferred)
    {
        var resourceManager = renderer.resourceManager;
        
        this._isDeferred = deferred;
        this.renderer = renderer;
        this.lightsLocations = [];

        if (resourceManager !== undefined && !this._isDeferred)
        {
            this.gl = renderer.gl;

            this.passShader = resourceManager.createShader('Phong2DShaderForward', {
                vert: TexturedAndNormalizedTintedShader.vert,
                frag: LightFragmentShader(Const.MAX_LIGHTS)
            });

            this.ambientLightColorLoc = this.passShader.getUniformLocation('uAmbientLightColor');
            this.uMainTextureLoc = this.passShader.getUniformLocation('uMainTexture');
            this.uNormTextureLoc = this.passShader.getUniformLocation('uNormTexture');
            this.uResolutionLoc = this.passShader.getUniformLocation('uResolution');
            this.uCameraLoc = this.passShader.getUniformLocation('uCamera');

            this.passShader.setConstantInt1(this.uMainTextureLoc, 0);
            this.passShader.setConstantInt1(this.uNormTextureLoc, 1);

            for (var index = 0; index < Const.MAX_LIGHTS; ++index)
            {
                this.lightsLocations[index] = {
                    position: this.passShader.getUniformLocation('uLights[' + index + '].position'),
                    color: this.passShader.getUniformLocation('uLights[' + index + '].color'),
                    attenuation: this.passShader.getUniformLocation('uLights[' + index + '].attenuation'),
                    radius: this.passShader.getUniformLocation('uLights[' + index + '].radius')
                };
            }
        }
        else
        {
            var gl = this.gl = renderer.gl;

            this.ext = renderer.getExtension('WEBGL_draw_buffers');

            this.gBufferShaderPass = resourceManager.createShader('GBufferShader', {
                vert: TexturedAndNormalizedTintedShader.vert,
                frag: GBufferShader()
            });

            var phongShader = Phong2DShaderDeferred(Const.DEFERRED_MAX_LIGHTS);

            this.lightPassShader = resourceManager.createShader('Phong2DShaderDeferred', {
                vert: phongShader.vert,
                frag: phongShader.frag
            });

            this.lightPassVBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.lightPassVBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ -1, 7, -1, -1, 7, -1 ]), gl.STATIC_DRAW);
            
            this.uMainTextureLoc = this.gBufferShaderPass.getUniformLocation('uMainTexture');
            this.uNormTextureLoc = this.gBufferShaderPass.getUniformLocation('uNormTexture');

            this.gBufferShaderPass.setConstantInt1(this.uMainTextureLoc, 0);
            this.gBufferShaderPass.setConstantInt1(this.uNormTextureLoc, 1);

            this.ambientLightColorLoc = this.lightPassShader.getUniformLocation('uAmbientLightColor');
            this.uResolutionLoc = this.lightPassShader.getUniformLocation('uResolution');
            this.uGbufferColorLoc = this.lightPassShader.getUniformLocation('uGbufferColor');
            this.uGbufferNormalLoc = this.lightPassShader.getUniformLocation('uGbufferNormal');
            this.uCameraLoc = this.lightPassShader.getUniformLocation('uCamera');

            this.lightPassShader.setConstantInt1(this.uGbufferColorLoc, 0);
            this.lightPassShader.setConstantInt1(this.uGbufferNormalLoc, 1);

            this.gBufferShaderPass.bindAttribLocation(0, 'v_tex_coord');
            this.gBufferShaderPass.bindAttribLocation(1, 'v_color');
            this.gBufferShaderPass.bindAttribLocation(2, 'v_alpha');
            this.lightPassShader.bindAttribLocation(0, 'vertexPosition');

            for (var index = 0; index < Const.DEFERRED_MAX_LIGHTS; ++index)
            {
                this.lightsLocations[index] = {
                    position: this.lightPassShader.getUniformLocation('uLights[' + index + '].position'),
                    color: this.lightPassShader.getUniformLocation('uLights[' + index + '].color'),
                    attenuation: this.lightPassShader.getUniformLocation('uLights[' + index + '].attenuation'),
                    radius: this.lightPassShader.getUniformLocation('uLights[' + index + '].radius')
                };
            }

            /* Setup render targets */
            this.gBufferFbo = gl.createFramebuffer();
            this.gBufferColorTex = gl.createTexture();
            this.gBufferNormalTex = gl.createTexture();

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.gBufferFbo);
            gl.bindTexture(gl.TEXTURE_2D, this.gBufferColorTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, renderer.width, renderer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.bindTexture(gl.TEXTURE_2D, this.gBufferNormalTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, renderer.width, renderer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT0_WEBGL, gl.TEXTURE_2D, this.gBufferColorTex, 0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT1_WEBGL, gl.TEXTURE_2D, this.gBufferNormalTex, 0);

            this.ext.drawBuffersWEBGL([ this.ext.COLOR_ATTACHMENT0_WEBGL, this.ext.COLOR_ATTACHMENT1_WEBGL ]);

            var complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

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

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            VertexBuffer.SetDirty();
        }
    },

    forEachLight: function (callback)
    {
        if (!callback)
        {
            return;
        }

        var lights = this.lights;
        var length = lights.length;
        
        for (var index = 0; index < length; ++index)
        {
            callback(lights[index]);
        }
    },

    get z ()
    {
        return this._z;
    },

    set z (newZ)
    {
        this._z = newZ;
    },

    setAmbientLightColor: function (r, g, b)
    {
        this.ambientLightColorR = r;
        this.ambientLightColorG = g;
        this.ambientLightColorB = b;
    },

    getMaxLights: function ()
    {
        return (this._isDeferred) ? Const.DEFERRED_MAX_LIGHTS : Const.MAX_LIGHTS;
    },

    getLightCount: function ()
    {
        return this.lights.length;
    },

    isDeferred: function ()
    {
        return this._isDeferred;
    },

    /* This will probably be removed later */ 
    addSprite: function (sprite, normalTexture)
    {
        var spriteNormalPair;

        if (this.spritePool.length > 0)
        {
            spriteNormalPair = this.spritePool.pop();
            spriteNormalPair.set(sprite, normalTexture);
        }
        else
        {
            spriteNormalPair = new SpriteNormalPair(sprite, normalTexture);
        }
        this.scene.sys.displayList.remove(sprite);
        this.sprites.push(spriteNormalPair);
    },

    removeSprite: function (sprite)
    {
        var length = this.sprites.length;
        for (var index = 0; index < length; ++index)
        {
            if (this.sprites[index].spriteRef === sprite)
            {
                this.spritePool.push(this.sprites[index]);
                this.sprites.splice(index, 1);
                break;
            }
        }
        return sprite;
    },

    addLight: function (x, y, z, radius, r, g, b, attenuation)
    {
        if (this.lights.length < this.getMaxLights())
        {
            var light = null;
            if (this.lightPool.length > 0)
            {
                light = this.lightPool.pop();
                light.set(x, y, z, radius, r, g, b, attenuation);
            }
            else
            {
                light = new Light(x, y, z, radius, r, g, b, attenuation);
            }
            this.lights.push(light);
            return light;
        }
        return null;
    },

    removeLight: function (light)
    {
        var index = this.lights.indexOf(light);

        if (index >= 0)
        {
            this.lightPool.push(light);
            this.lights.splice(index, 1);
        }
    },

    updateLights: function (renderer, camera, shader)
    {
        if (this.gl !== null)
        {
            var locations = this.lightsLocations;
            var lights = this.lights;
            var length = lights.length;
            var point = {x: 0, y: 0};
            var height = renderer.height;
            var cameraMatrix = camera.matrix;
            var gl = this.gl;

            shader.bind();

            gl.uniform2f(this.uResolutionLoc, renderer.width, renderer.height);
            gl.uniform3f(this.ambientLightColorLoc, this.ambientLightColorR, this.ambientLightColorG, this.ambientLightColorB);
            gl.uniform4f(this.uCameraLoc, camera.x, camera.y, camera.rotation, camera.zoom);

            for (var index = 0; index < length; ++index)
            {
                var light = lights[index];
                cameraMatrix.transformPoint(light.x, light.y, point);
                gl.uniform1f(locations[index].attenuation, light.attenuation);
                gl.uniform1f(locations[index].radius, light.radius);
                gl.uniform3f(locations[index].position, point.x - (camera.scrollX * light.scrollFactorX * camera.zoom), height - (point.y - (camera.scrollY * light.scrollFactorY) * camera.zoom), light.z);
                gl.uniform3f(locations[index].color, light.r, light.g, light.b);
            }
        }
    }

});

module.exports = LightLayer;
