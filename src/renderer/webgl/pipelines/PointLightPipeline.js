/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var PointLightShaderSourceFS = require('../shaders/PointLight-frag.js');
var PointLightShaderSourceVS = require('../shaders/PointLight-vert.js');
var WebGLPipeline = require('../WebGLPipeline');

var PointLightPipeline = new Class({

    Extends: WebGLPipeline,

    initialize:

    function PointLightPipeline (config)
    {
        config.vertShader = GetFastValue(config, 'vertShader', PointLightShaderSourceVS);
        config.fragShader = GetFastValue(config, 'fragShader', PointLightShaderSourceFS);
        config.attributes = GetFastValue(config, 'attributes', [
            {
                name: 'inPosition',
                size: 2
            },
            {
                name: 'inLightPosition',
                size: 2
            },
            {
                name: 'inLightRadius'
            },
            {
                name: 'inLightFalloff'
            },
            {
                name: 'inLightAttenuation'
            },
            {
                name: 'inLightColor',
                size: 4
            }
        ]);

        WebGLPipeline.call(this, config);
    },

    onBind: function ()
    {
        this.set2f('uResolution', this.width, this.height);
    },

    batchPointLight: function (light, camera, x0, y0, x1, y1, x2, y2, x3, y3, lightX, lightY)
    {
        var color = light.color;
        var intensity = light.intensity;
        var radius = light.radius;
        var falloff = light.falloff;
        var attenuation = light.attenuation;

        var r = color.r * intensity;
        var g = color.g * intensity;
        var b = color.b * intensity;
        var a = camera.alpha * light.alpha;

        if (this.shouldFlush(6))
        {
            this.flush();
        }

        this.batchLightVert(x0, y0, lightX, lightY, radius, falloff, attenuation, r, g, b, a);
        this.batchLightVert(x1, y1, lightX, lightY, radius, falloff, attenuation, r, g, b, a);
        this.batchLightVert(x2, y2, lightX, lightY, radius, falloff, attenuation, r, g, b, a);
        this.batchLightVert(x0, y0, lightX, lightY, radius, falloff, attenuation, r, g, b, a);
        this.batchLightVert(x2, y2, lightX, lightY, radius, falloff, attenuation, r, g, b, a);
        this.batchLightVert(x3, y3, lightX, lightY, radius, falloff, attenuation, r, g, b, a);
    },

    batchLightVert: function (x, y, lightX, lightY, radius, falloff, attenuation, r, g, b, a)
    {
        var vertexViewF32 = this.vertexViewF32;

        var vertexOffset = (this.vertexCount * this.currentShader.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x;
        vertexViewF32[++vertexOffset] = y;
        vertexViewF32[++vertexOffset] = lightX;
        vertexViewF32[++vertexOffset] = lightY;
        vertexViewF32[++vertexOffset] = radius;
        vertexViewF32[++vertexOffset] = falloff;
        vertexViewF32[++vertexOffset] = attenuation;
        vertexViewF32[++vertexOffset] = r;
        vertexViewF32[++vertexOffset] = g;
        vertexViewF32[++vertexOffset] = b;
        vertexViewF32[++vertexOffset] = a;

        this.vertexCount++;
    }

});

module.exports = PointLightPipeline;
