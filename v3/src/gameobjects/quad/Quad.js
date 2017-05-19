
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

        // var topLeft = { x: -250, y: -250 };
        var topRight = { x: 250, y: -250 };
        var bottomLeft = { x: -250, y: 250 };
        var bottomRight = { x: 250, y: 250 };

        //  tl, bl, br, tr
        var vertices = [
            0, 0,
            bottomLeft.x, bottomLeft.y,
            bottomRight.x, bottomRight.y,
            topRight.x, topRight.y
        ];

        var uv = [ 0, 0, 0, 1, 1, 1, 1, 0 ];
        var indices = [ 0, 1, 2, 0, 2, 3 ];

        Mesh.call(this, state, x, y, vertices, uv, indices, texture, frame);

        this.halfWidth = Math.floor(this.width / 2);
        this.halfHeight = Math.floor(this.height / 2);

        this._topLeft = { x: 0, y: 0 };
        this._topRight = { x: 250, y: -250 };
        this._bottomLeft = { x: -250, y: 250 };
        this._bottomRight = { x: 250, y: 250 };

        this.setTopLeft(this.halfWidth, this.halfHeight);

        // var v = this.vertices;

        // v[0] = -w;
        // v[1] = -h;
        // v[1] = -h;
    },

    topLeftX: {

        get: function ()
        {
            return this._topLeft.x;
        },

        set: function (value)
        {
            this._topLeft.x = value;
            this.vertices[0] = value - this.x;
        }

    },

    topLeftY: {

        get: function ()
        {
            return this._topLeft.y;
        },

        set: function (value)
        {
            this._topLeft.y = value;
            this.vertices[1] = value - this.y;
        }

    },

    setTopLeft: function (x, y)
    {
        this.topLeftX = x;
        this.topLeftY = y;
    }

});

module.exports = Quad;
