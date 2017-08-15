
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../components');
var Render = require('./LightLayerRender');
var Light = require('./Light');
var SpriteNormalPair = require('./SpriteNormalPair');
var WebGLSupportedExtensions = require('../../renderer/webgl/WebGLSupportedExtensions');
var TexturedAndNormalizedTintedShader = require('../../renderer/webgl/shaders/TexturedAndNormalizedTintedShader');
var Const = require('./Const');
var Matrix = require('../components/TransformMatrix');
var TempMatrix = new Matrix();

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
        GameObject.call(this, scene, 'LightLayer');

        var resourceManager = scene.game.renderer.resourceManager;
        this._isDeferred = WebGLSupportedExtensions.has('WEBGL_draw_buffers');

        this.renderer = scene.game.renderer;
        this.passShader = null;
        this.gl = null;
        this.ambientLightColorR = 0.0;
        this.ambientLightColorG = 0.0;
        this.ambientLightColorB = 0.0;
        this.lightPool = [];
        this.spritePool = [];
        this.lights = [];
        this.sprites = [];
        this.lightsLocations = [];
        this._z = 0;

        if (resourceManager !== undefined && !this._isDeferred)
        {
            this.gl = scene.game.renderer.gl;
            this.passShader = resourceManager.createShader('Phong2DShaderForward', {vert: TexturedAndNormalizedTintedShader.vert, frag: `
                precision mediump float;

                struct Light
                {
                    vec3 position;
                    vec3 color;
                    float attenuation;
                    float radius;
                };

                uniform vec4 uCamera; /* x, y, rotation, zoom */
                uniform vec2 uResolution;
                uniform sampler2D uMainTexture;
                uniform sampler2D uNormTexture;
                uniform vec3 uAmbientLightColor;
                uniform Light uLights[` + Const.MAX_LIGHTS + `];

                varying vec2 v_tex_coord;
                varying vec3 v_color;
                varying float v_alpha;
                
                void main()
                {
                    vec3 finalColor = vec3(0.0, 0.0, 0.0);
                    vec4 spriteColor = texture2D(uMainTexture, v_tex_coord) * vec4(v_color, v_alpha);
                    vec3 spriteNormal = texture2D(uNormTexture, v_tex_coord).rgb;
                    vec3 normal = normalize(vec3(spriteNormal * 2.0 - 1.0));
                    vec2 res = vec2(min(uResolution.x, uResolution.y)) * uCamera.w;

                    for (int index = 0; index < ` + Const.MAX_LIGHTS + `; ++index)
                    {
                        Light light = uLights[index];
                        vec3 lightDir = vec3((light.position.xy / res) - (gl_FragCoord.xy / res), light.position.z); 
                        vec3 lightNormal = normalize(lightDir);
                        float distToSurf = length(lightDir) * uCamera.w;
                        float diffuseFactor = max(dot(normal, lightNormal), 0.0);
                        float radius = (light.radius / res.x * uCamera.w) * uCamera.w;
                        float attenuation = clamp(1.0 - distToSurf * distToSurf / (radius * radius), 0.0, 1.0); 
                        vec3 diffuse = light.color * spriteColor.rgb * diffuseFactor;
                        finalColor += attenuation * diffuse;
                    }

                    gl_FragColor = vec4(uAmbientLightColor + finalColor, spriteColor.a);
                }                
            `});
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
            var gl = this.gl = scene.game.renderer.gl;
            this.ext = scene.game.renderer.getExtension('WEBGL_draw_buffers');
            this.gBufferShaderPass = resourceManager.createShader('GBufferShader', { vert: TexturedAndNormalizedTintedShader.vert, frag: `
                #extension GL_EXT_draw_buffers : require 

                precision mediump float;

                uniform sampler2D uMainTexture;
                uniform sampler2D uNormTexture;

                varying vec2 v_tex_coord;
                varying vec3 v_color;
                varying float v_alpha;
                
                void main()
                {
                    vec4 spriteColor = texture2D(uMainTexture, v_tex_coord) * vec4(v_color, v_alpha);
                    vec3 spriteNormal = texture2D(uNormTexture, v_tex_coord).rgb;
                    
                    gl_FragData[0] = spriteColor;
                    gl_FragData[1] = vec4(spriteNormal, spriteColor.a);
                }                
            `});
            this.lightPassShader = resourceManager.createShader('Phong2DShaderDeferred', {
                vert: `
                precision mediump float;
                attribute vec2 vertexPosition;
                void main()
                {
                    gl_Position = vec4(vertexPosition, 0.0, 1.0);
                }
                `, 
                frag: `
                precision mediump float;

                struct Light
                {
                    vec3 position;
                    vec3 color;
                    float attenuation;
                    float radius;
                };

                uniform vec4 uCamera; /* x, y, rotation, zoom */
                uniform vec2 uResolution;
                uniform sampler2D uGbufferColor;
                uniform sampler2D uGbufferNormal;
                uniform vec3 uAmbientLightColor;
                uniform Light uLights[` + Const.DEFERRED_MAX_LIGHTS + `];
                
                void main()
                {
                    vec2 uv = vec2(gl_FragCoord.xy / uResolution);
                    vec3 finalColor = vec3(0.0, 0.0, 0.0);
                    vec4 gbColor = texture2D(uGbufferColor, uv);
                    vec3 gbNormal = texture2D(uGbufferNormal, uv).rgb;
                    vec3 normal = normalize(vec3(gbNormal * 2.0 - 1.0));
                    vec2 res = vec2(min(uResolution.x, uResolution.y)) * uCamera.w;

                    for (int index = 0; index < ` + Const.DEFERRED_MAX_LIGHTS + `; ++index)
                    {                
                        Light light = uLights[index];
                        vec3 lightDir = vec3((light.position.xy / res) - (gl_FragCoord.xy / res), light.position.z); 
                        vec3 lightNormal = normalize(lightDir);
                        float distToSurf = length(lightDir) * uCamera.w;
                        float diffuseFactor = max(dot(normal, lightNormal), 0.0);
                        float radius = (light.radius / res.x * uCamera.w) * uCamera.w;
                        float attenuation = clamp(1.0 - distToSurf * distToSurf / (radius * radius), 0.0, 1.0); 
                        vec3 diffuse = light.color * gbColor.rgb * diffuseFactor;
                        finalColor += attenuation * diffuse;
                    }

                    gl_FragColor = vec4(uAmbientLightColor + finalColor, gbColor.a);
                }                
            `});
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
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, scene.game.renderer.width, scene.game.renderer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.bindTexture(gl.TEXTURE_2D, this.gBufferNormalTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, scene.game.renderer.width, scene.game.renderer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
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
        }

        this.setOrigin(0, 0);
    },

    forEachLight: function (callback)
    {
        if (!callback)
            return;

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
            shader.setConstantFloat4(this.uCameraLoc, camera.x, camera.y, camera.rotation, camera.zoom);
            shader.setConstantFloat2(this.uResolutionLoc, renderer.width, renderer.height);
            shader.setConstantFloat3(this.ambientLightColorLoc, this.ambientLightColorR, this.ambientLightColorG, this.ambientLightColorB);

            for (var index = 0; index < length; ++index)
            {
                var light = lights[index];
                cameraMatrix.transformPoint(light.x, light.y, point);
                shader.setConstantFloat3(locations[index].position, point.x - (camera.scrollX * light.scrollFactorX * camera.zoom), height - (point.y - (camera.scrollY * light.scrollFactorY) * camera.zoom), light.z);
                shader.setConstantFloat3(locations[index].color, light.r, light.g, light.b);
                shader.setConstantFloat1(locations[index].attenuation, light.attenuation);
                shader.setConstantFloat1(locations[index].radius, light.radius);
            }
        }
    }

});

module.exports = LightLayer;
