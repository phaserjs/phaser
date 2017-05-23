
var Class = require('../../utils/Class');
var Mesh = require('../mesh/Mesh');

var Quad = new Class({

    Extends: Mesh,

    initialize:

    function Quad (state, x, y, texture, frame)
    {
        //  0----3
        //  |\  B|
        //  | \  |
        //  |  \ |
        //  | A \|
        //  |    \
        //  1----2

        //  Array sequence: tl, bl, br, tr
        var vertices = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
        var uv = [ 0, 0, 0, 1, 1, 1, 1, 0 ];
        var indices = [ 0, 1, 2, 0, 2, 3 ];
        var colors = [ 0xffffff, 0xffffff, 0xffffff, 0xffffff ];
        var alphas = [ 1, 1, 1, 1 ];

        Mesh.call(this, state, x, y, vertices, uv, indices, colors, alphas, texture, frame);

        this.resetPosition();
    },

    topLeftX: {

        get: function ()
        {
            return this.x + this.vertices[0];
        },

        set: function (value)
        {
            this.vertices[0] = value - this.x;
        }

    },

    topLeftY: {

        get: function ()
        {
            return this.y + this.vertices[1];
        },

        set: function (value)
        {
            this.vertices[1] = value - this.y;
        }

    },

    topRightX: {

        get: function ()
        {
            return this.x + this.vertices[6];
        },

        set: function (value)
        {
            this.vertices[6] = value - this.x;
        }

    },

    topRightY: {

        get: function ()
        {
            return this.y + this.vertices[7];
        },

        set: function (value)
        {
            this.vertices[7] = value - this.y;
        }

    },

    bottomLeftX: {

        get: function ()
        {
            return this.x + this.vertices[2];
        },

        set: function (value)
        {
            this.vertices[2] = value - this.x;
        }

    },

    bottomLeftY: {

        get: function ()
        {
            return this.y + this.vertices[3];
        },

        set: function (value)
        {
            this.vertices[3] = value - this.y;
        }

    },

    bottomRightX: {

        get: function ()
        {
            return this.x + this.vertices[4];
        },

        set: function (value)
        {
            this.vertices[4] = value - this.x;
        }

    },

    bottomRightY: {

        get: function ()
        {
            return this.y + this.vertices[5];
        },

        set: function (value)
        {
            this.vertices[5] = value - this.y;
        }

    },

        //  tl, bl, br, tr

    topLeftAlpha: {

        get: function ()
        {
            return this.alphas[0];
        },

        set: function (value)
        {
            this.alphas[0] = value;
        }

    },

    topRightAlpha: {

        get: function ()
        {
            return this.alphas[3];
        },

        set: function (value)
        {
            this.alphas[3] = value;
        }

    },

    bottomLeftAlpha: {

        get: function ()
        {
            return this.alphas[1];
        },

        set: function (value)
        {
            this.alphas[1] = value;
        }

    },

    bottomRightAlpha: {

        get: function ()
        {
            return this.alphas[2];
        },

        set: function (value)
        {
            this.alphas[2] = value;
        }

    },

    topLeftColor: {

        get: function ()
        {
            return this.colors[0];
        },

        set: function (value)
        {
            this.colors[0] = value;
        }

    },

    topRightColor: {

        get: function ()
        {
            return this.colors[3];
        },

        set: function (value)
        {
            this.colors[3] = value;
        }

    },

    bottomLeftColor: {

        get: function ()
        {
            return this.colors[1];
        },

        set: function (value)
        {
            this.colors[1] = value;
        }

    },

    bottomRightColor: {

        get: function ()
        {
            return this.colors[2];
        },

        set: function (value)
        {
            this.colors[2] = value;
        }

    },

    setTopLeft: function (x, y)
    {
        this.topLeftX = x;
        this.topLeftY = y;

        return this;
    },

    setTopRight: function (x, y)
    {
        this.topRightX = x;
        this.topRightY = y;

        return this;
    },

    setBottomLeft: function (x, y)
    {
        this.bottomLeftX = x;
        this.bottomLeftY = y;

        return this;
    },

    setBottomRight: function (x, y)
    {
        this.bottomRightX = x;
        this.bottomRightY = y;

        return this;
    },

    resetPosition: function ()
    {
        var x = this.x;
        var y = this.y;
        var halfWidth = Math.floor(this.width / 2);
        var halfHeight = Math.floor(this.height / 2);

        this.setTopLeft(x - halfWidth, y - halfHeight);
        this.setTopRight(x + halfWidth, y - halfHeight);
        this.setBottomLeft(x - halfWidth, y + halfHeight);
        this.setBottomRight(x + halfWidth, y + halfHeight);

        return this;
    },

    resetAlpha: function ()
    {
        var alphas = this.alphas;

        alphas[0] = 1;
        alphas[1] = 1;
        alphas[2] = 1;
        alphas[3] = 1;

        return this;
    },

    resetColors: function ()
    {
        var colors = this.colors;

        colors[0] = 0xffffff;
        colors[1] = 0xffffff;
        colors[2] = 0xffffff;
        colors[3] = 0xffffff;

        return this;
    },

    reset: function ()
    {
        this.resetPosition();
        this.resetAlpha();
        this.resetColors();
    }

});

module.exports = Quad;
