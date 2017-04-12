
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');

var Zone = new Class({

    Extends: GameObject,

    Mixins: [
        Components.GetBounds,
        Components.Origin,
        Components.ScaleMode,
        Components.Size,
        Components.Transform,
        Components.Visible
    ],

    initialize:

    function Zone (state, x, y, width, height)
    {
        GameObject.call(this, state, 'Zone');

        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0);
    }

});

module.exports = Zone;
