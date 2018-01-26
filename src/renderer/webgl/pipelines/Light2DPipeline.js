var Class = require('../../../utils/Class');
var WebGLPipeline = require('../WebGLPipeline');
var Utils = require('../Utils');
var TextureTintPipeline = require('./TextureTintPipeline');
var ShaderSourceFS = require('../shaders/ForwardDiffuse.frag');

var ForwardDiffuseLightPipeline = new Class({

    Extends: TextureTintPipeline,

    initialize:

    function ForwardDiffuseLightPipeline(game, gl, renderer)
    {
        TextureTintPipeline.call(game, gl, ShaderSourceFS);
    },

    onBind: function ()
    {
        TextureTintPipeline.prototype.onBind.call(this);

        var renderer = this.renderer;
        var program = this.currentProgram;

        this.mvpUpdate();

        renderer.setInt1(program, 'uNormSampler', 1);
        renderer.setFloat2(program, 'uResolution', this.width, this.height);

        return this;
    },

    updateLightShaderData: function (scene)
    {
        var program = this.currentProgram;
        var lights = lightLayer.lights;
        
        renderer.setFloat4(program, 'uCamera', camera.x, camera.y, camera.rotation, camera.zoom);
        renderer.setFloat4(program, 'uAmbientLightColor', lightLayer.ambientLightColorR, lightLayer.ambientLightColorG, lightLayer.ambientLightColorB);

        for (var index = 0; index < lights.length; ++index)
        {
            var light = lights[index];
            var lightName = 'uLights[' + index + '].';
            renderer.setFloat3(program, lightName + 'position', light.x, light.y, light.z);
            renderer.setFloat3(program, lightName + 'color', light.r, light.g, light.b);
            renderer.setFloat1(program, lightName + 'attenuation', light.attenuation);
            renderer.setFloat1(program, lightName + 'radius', light.radius);
        }

        return this;
    }

});

module.exports = ForwardDiffuseLightPipeline;
