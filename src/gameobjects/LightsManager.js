var Class = require('../utils/Class');
var Utils = require('../renderer/webgl/Utils');

var Light = new Class({

    initialize:

    function Light (x, y, radius, r, g, b, intensity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.r = r;
        this.g = g;
        this.b = b;
        this.intensity = intensity;
        this.scrollFactorX = 1.0;
        this.scrollFactorY = 1.0;
    },

    set: function (x, y, radius, r, g, b, intensity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.r = r;
        this.g = g;
        this.b = b;
        this.intensity = intensity;
        this.scrollFactorX = 1.0;
        this.scrollFactorY = 1.0;
    },

    setColor: function (rgb)
    {
        var color = Utils.getFloatsFromUintRGB(rgb);
        
        this.r = color[0];
        this.g = color[1];
        this.b = color[2];
        
        return this;
    },

    setIntensity: function (intensity)
    {
        this.intensity = intensity;

        return this;
    },

    setPosition: function (x, y)
    {
        this.x = x;
        this.y = y;

        return this;
    },

    setRadius: function (radius)
    {
        this.radius = radius;

        return this;
    }

});

var LightsManager = new Class({

    initialize:

    function LightsManager()
    {
        this.lightPool = [];
        this.lights = [];
        this.culledLights = [];
        this.ambientColor = { r: 0.1, g: 0.1, b: 0.1 };
    },

    shutdown: function ()
    {
        while (this.lights.length > 0)
        {
            this.lightPool.push(this.lights.pop());
        }
        
        this.ambientColor = { r: 0.1, g: 0.1, b: 0.1 };
        this.culledLights.length = 0;
        this.lights.length = 0;

        return this;
    },

    destroy: function ()
    {
        this.shutdown();
    },

    cull: function (camera)
    {
        var lights = this.lights;
        var culledLights = this.culledLights;
        var length = lights.length;
        culledLights.length = 0;

        for (var index = 0; index < length; ++index)
        {
            culledLights.push(lights[index]);
        }

        return culledLights;
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

        return this;
    },

    setAmbientColor: function (rgb)
    {
        var color = Utils.getFloatsFromUintRGB(rgb);
        
        this.ambientColor.r = color[0];
        this.ambientColor.g = color[1];
        this.ambientColor.b = color[2];

        return this;
    },

    getMaxVisibleLights: function ()
    {
        return 10;
    },

    getLightCount: function ()
    {
        return this.lights.length;
    },

    addLight: function (x, y, radius, rgb, intensity)
    {
        var color = null;
        var light = null;

        x = (x === undefined) ? 0.0 : x;
        y = (y === undefined) ? 0.0 : y;
        rgb = (rgb === undefined) ? 0xffffff : rgb;
        radius = (radius === undefined) ? 100.0 : radius;
        intensity = (intensity === undefined) ? 1.0 : intensity;

        color = Utils.getFloatsFromUintRGB(rgb);
        light = null;

        if (this.lightPool.length > 0)
        {
            light = this.lightPool.pop();
            light.set(x, y, radius, color[0], color[1], color[2], intensity);
        }
        else
        {
            light = new Light(x, y, radius, color[0], color[1], color[2], intensity);
        }

        this.lights.push(light);

        return light;
    },

    removeLight: function (light)
    {
        var index = this.lights.indexOf(light);

        if (index >= 0)
        {
            this.lightPool.push(light);
            this.lights.splice(index, 1);
        }
    }

});

module.exports = LightsManager;
