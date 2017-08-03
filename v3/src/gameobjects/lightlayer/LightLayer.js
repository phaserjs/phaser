
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../components');
var Render = require('./LightLayerRender');
var Light = require('./Light');
var SpriteNormalPair = require('./SpriteNormalPair');
var WebGLSupportedExtensions = require('../../renderer/webgl/WebGLSupportedExtensions');
var Const = require('./Const');

var LightLayer = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.RenderTarget,
        Components.ScaleMode,
        Components.ScrollFactor,
        Components.Size,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function LightLayer (scene, x, y, width, height)
    {
        GameObject.call(this, scene, 'LightLayer');

        var resourceManager = scene.game.renderer.resourceManager;

        this.renderer = scene.game.renderer;
        this.passShader = null;
        this.gl = null;
        this.deferred = WebGLSupportedExtensions.has('WEBGL_draw_buffers');
        this.ambientLightColorR = 0.0;
        this.ambientLightColorG = 0.0;
        this.ambientLightColorB = 0.0;
        this.lightPool = [];
        this.spritePool = [];
        this.lights = [];
        this.sprites = [];
        this.lightsLocations = [];

        if (resourceManager !== undefined && !this.deferred)
        {
            this.gl = scene.game.renderer.gl;
            this.passShader = resourceManager.createShader('Phong2DShaderForward', {vert: `
                precision mediump float;

                uniform mat4 uProjection;

                attribute vec2 vertPosition;
                attribute vec2 vertTexCoord;
                attribute vec3 vertColor;
                attribute float vertAlpha;

                varying vec2 fragTexCoord;
                varying vec3 fragColor;
                varying float fragAlpha;

                void main()
                {
                    fragTexCoord = vertTexCoord;
                    fragColor = vertColor;
                    fragAlpha = vertAlpha;

                    gl_Position = uProjection * vec4(vertPosition, 0.0, 1.0);
                }
            `, frag: `
                precision mediump float;

                struct Light
                {
                    vec3 position;
                    vec3 color;
                    float attenuation;
                };

                uniform sampler2D uMainTexture;
                uniform sampler2D uNormTexture;
                uniform vec3 uAmbientLightColor;
                uniform Light uLights[` + Const.MAX_LIGHTS + `];

                varying vec2 fragTexCoord;
                varying vec3 fragColor;
                varying float fragAlpha;
                
                void main()
                {
                    /* Just Pass through for now */
                    gl_FragColor = texture2D(uMainTexture, fragTexCoord) * vec4(fragColor, fragAlpha);
                }                
            `});
            this.ambientLightColorLoc = this.passShader.getUniformLocation('uAmbientLightColor');
            for (var index = 0; index < Const.MAX_LIGHTS; ++index)
            {
                this.lightsLocations[index] = {
                    position: this.passShader.getUniformLocation('uLights[' + index + '].position'),
                    color: this.passShader.getUniformLocation('uLights[' + index + '].color'),
                    attenuation: this.passShader.getUniformLocation('uLights[' + index + '].attenuation')
                };
            }
        }

        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0, 0);
    },

    setAmbientLightColor: function (r, g, b) 
    {
        this.ambientLightColorR = r; 
        this.ambientLightColorG = g; 
        this.ambientLightColorB = b; 
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

    addLight: function (x, y, z, r, g, b, attenuation)
    {
        if (this.lights.length < Const.MAX_LIGHTS)
        {
            var light = null;
            if (this.lightPool.length > 0)
            {
                light = this.lightPool.pop();
                light.set(x, y, z, r, g, b, attenuation);
            }
            else
            {
                light = new Light(x, y, z, r, g, b, attenuation);
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

    updateLights: function()
    {
        if (this.gl !== null)
        {
            var locations = this.lightsLocations;
            var lights = this.lights;
            var length = lights.length;
            var gl = this.gl;
            var passShader = this.passShader;

            passShader.setConstantFloat3(this.ambientLightColorLoc, this.ambientLightColorR, this.ambientLightColorG, this.ambientLightColorB);

            for (var index = 0; index < length; ++index)
            {
                var light = lights[index];
                passShader.setConstantFloat3(locations[index].position, light.x, light.y, light.z);
                passShader.setConstantFloat3(locations[index].color, light.r, light.g, light.b);
                passShader.setConstantFloat3(locations[index].attenuation, light.attenuation);
            }
        }
    }

});

module.exports = LightLayer;
