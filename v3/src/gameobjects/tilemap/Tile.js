var Class = require('../../utils/Class');
var Components = require('../components');

var Tile = new Class({

    // TODO: custom rotation or use transform component
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
        this.properties = {};

        // TODO: update renders to allow for using Components.Tint
        this.tint = 0xFFFFFF;
    },

    // Copy everything except position
    copy: function (tile)
    {
        this.index = tile.index;
        this.alpha = tile.alpha;
        this.properties = tile.properties;
        this.visible = tile.visible;
        this.setFlip(tile.flipX, tile.flipY);
        this.tint = tile.tint;

        // this.collideUp = tile.collideUp;
        // this.collideDown = tile.collideDown;
        // this.collideLeft = tile.collideLeft;
        // this.collideRight = tile.collideRight;
        // this.collisionCallback = tile.collisionCallback;
        // this.collisionCallbackContext = tile.collisionCallbackContext;

        return this;
    },

    left: {
        get: function ()
        {
            return this.worldX;
        }
    },

    right: {
        get: function ()
        {
            return this.worldX + this.width;
        }
    },

    top: {
        get: function ()
        {
            return this.worldY;
        }
    },

    bottom: {
        get: function ()
        {
            return this.worldY + this.height;
        }
    },

    centerX: {
        get: function ()
        {
            return this.worldX + this.width / 2;
        }
    },

    centerY: {
        get: function ()
        {
            return this.worldY + this.height / 2;
        }
    }

});

module.exports = Tile;
