var Class = require('../../utils/Class');
var Components = require('../components');

var Tile = new Class({

    // TODO: Add in bounds mixin, or custom replacement
    Mixins: [
        Components.Alpha,
        Components.Flip,
        Components.Visible
    ],

    initialize:

    function Tile (layer, index, x, y, width, height)
    {
        this.layer = layer;
        this.index = index;
        this.x = x;
        this.y = y;
        this.worldX = x * width;
        this.worldY = y * height;
        this.width = width;
        this.height = height;

        // TODO: update renders to allow for using Components.Tint
        this.tint = 0xFFFFFF;
    }
});

module.exports = Tile;
