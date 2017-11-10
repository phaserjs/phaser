var Class = require('../../utils/Class');

// Dummy Tile class
// Todo: merge dynamic/tile into this

var Tile = new Class({

    initialize:

    function Tile (layer, index, x, y, width, height)
    {
        this.layer = layer;
        this.index = index;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

});

module.exports = Tile;
