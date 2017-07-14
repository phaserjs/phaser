
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../components');

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
    }

});

module.exports = Zone;
