
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../components');
var BlendModes = require('../../renderer/BlendModes');

var Zone = new Class({

    Extends: GameObject,

    Mixins: [
        Components.GetBounds,
        Components.Origin,
        Components.ScaleMode,
        Components.Size,
        Components.Transform,
        Components.ScrollFactor,
        Components.Visible
    ],

    initialize:

    function Zone (scene, x, y, width, height)
    {
        GameObject.call(this, scene, 'Zone');

        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0);

        this.blendMode = BlendModes.NORMAL;
    },

    setDropZone: function (shape, callback)
    {
        if (!this.input)
        {
            this.setInteractive(shape, callback);
        }

        this.input.dropzone = true;

        return this;
    },

    renderCanvas: function ()
    {
        return;
    },

    renderWebGL: function ()
    {
        return;
    }

});

module.exports = Zone;
