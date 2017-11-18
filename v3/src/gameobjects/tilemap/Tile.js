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
        this.rotation = 0;
        this.collideLeft = false;
        this.collideRight = false;
        this.collideUp = false;
        this.collideDown = false;
        this.faceLeft = false;
        this.faceRight = false;
        this.faceTop = false;
        this.faceBottom = false;
        this.collisionCallback = null;
        this.collisionCallbackContext = this;
        this.scanned = false;

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
        this.rotation = tile.rotation;
        this.collideUp = tile.collideUp;
        this.collideDown = tile.collideDown;
        this.collideLeft = tile.collideLeft;
        this.collideRight = tile.collideRight;
        this.collisionCallback = tile.collisionCallback;
        this.collisionCallbackContext = tile.collisionCallbackContext;

        return this;
    },

    // Does not factor in scroll offset or tilemap layer position
    containsPoint: function (x, y)
    {
        return !(x < this.worldX || y < this.worldY || x > this.right || y > this.bottom);
    },

    destroy: function ()
    {
        this.collisionCallback = undefined;
        this.collisionCallbackContext = undefined;
        this.properties = undefined;
    },

    // Does not factor in scroll offset or tilemap layer position
    intersects: function (x, y, right, bottom)
    {
        return !(right <= this.worldX || bottom <= this.worldY || x >= this.right || y >= this.bottom);
    },

    isInteresting: function (collides, faces)
    {
        if (collides && faces) { return (this.canCollide || this.hasInterestingFace); }
        else if (collides) { return this.collides; }
        else if (faces) { return this.hasInterestingFace; }
        return false;
    },

    resetCollision: function ()
    {
        this.collideLeft = false;
        this.collideRight = false;
        this.collideUp = false;
        this.collideDown = false;

        this.faceTop = false;
        this.faceBottom = false;
        this.faceLeft = false;
        this.faceRight = false;
    },

    setCollision: function (left, right, up, down)
    {
        this.collideLeft = left;
        this.collideRight = right;
        this.collideUp = up;
        this.collideDown = down;

        this.faceLeft = left;
        this.faceRight = right;
        this.faceTop = up;
        this.faceBottom = down;
    },

    setCollisionCallback: function (callback, context)
    {
        this.collisionCallback = callback;
        this.collisionCallbackContext = context;
    },

    setSize: function (tileWidth, tileHeight)
    {
        this.worldX = this.x * tileWidth;
        this.worldY = this.y * tileHeight;
        this.width = tileWidth;
        this.height = tileHeight;
    },

    // True if this tile can collide on any of its faces or has a collision callback set.
    canCollide: {
        get: function ()
        {
            return (this.collideLeft || this.collideRight || this.collideUp || this.collideDown || this.collisionCallback);
        }
    },

    // True if this tile can collide on any of its faces.
    collides: {
        get: function ()
        {
            return (this.collideLeft || this.collideRight || this.collideUp || this.collideDown);
        }
    },

    // True if this tile has any interesting faces
    hasInterestingFace: {
        get: function ()
        {
            return (this.faceTop || this.faceBottom || this.faceLeft || this.faceRight);
        }
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
