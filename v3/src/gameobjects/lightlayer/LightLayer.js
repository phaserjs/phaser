
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
        this._z = 0;

        if (resourceManager !== undefined && !this.deferred)
        {
            this.gl = scene.game.renderer.gl;
            this.passShader = resourceManager.createShader('Phong2DShaderForward', {vert: TexturedAndNormalizedTintedShader.vert, frag: `
                precision mediump float;

                struct Light
                {
                    vec3 position;
                    vec3 color;
                    float attenuation;
                };

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

                    for (int index = 0; index < ` + Const.MAX_LIGHTS + `; ++index)
                    {
                        Light light = uLights[index];
                        float lightY = uResolution.y - light.position.y;
                        vec3 lightDir = vec3((vec2(light.position.x, lightY) / uResolution) - (gl_FragCoord.xy / uResolution), light.position.z); 
                        vec3 lightNormal = normalize(lightDir);
                        float distToSurf = length(lightDir);
                        float diffuseFactor = max(dot(normal, lightNormal), 0.0);
                        float attenuation = 1.0 / (1.0 + light.attenuation * (distToSurf * distToSurf));
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

            this.passShader.setConstantInt1(this.uMainTextureLoc, 0);
            this.passShader.setConstantInt1(this.uNormTextureLoc, 1);

            for (var index = 0; index < Const.MAX_LIGHTS; ++index)
            {
                this.lightsLocations[index] = {
                    position: this.passShader.getUniformLocation('uLights[' + index + '].position'),
                    color: this.passShader.getUniformLocation('uLights[' + index + '].color'),
                    attenuation: this.passShader.getUniformLocation('uLights[' + index + '].attenuation')
                };
            }
        }

        this.setOrigin(0, 0);
    },

    get z()
    {
        return this._z;
    },

    set z(newZ)
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
        return Const.MAX_LIGHTS;
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

    updateLights: function(renderer, camera)
    {
        if (this.gl !== null)
        {
            var locations = this.lightsLocations;
            var lights = this.lights;
            var length = lights.length;
            var gl = this.gl;
            var passShader = this.passShader;
            var point = {x: 0, y: 0};

            passShader.setConstantFloat2(this.uResolutionLoc, renderer.width, renderer.height);
            passShader.setConstantFloat3(this.ambientLightColorLoc, this.ambientLightColorR, this.ambientLightColorG, this.ambientLightColorB);

            TempMatrix.applyITRS(camera.x, camera.y, camera.rotation, camera.zoom, camera.zoom);

            for (var index = 0; index < length; ++index)
            {
                var light = lights[index];
                TempMatrix.transformPoint(light.x, light.y, point);
                passShader.setConstantFloat3(locations[index].position, point.x - (camera.scrollX * light.scrollFactorX), point.y - (camera.scrollY * light.scrollFactorY), light.z);
                passShader.setConstantFloat3(locations[index].color, light.r, light.g, light.b);
                passShader.setConstantFloat1(locations[index].attenuation, light.attenuation);
            }
        }
    }

});

module.exports = LightLayer;
