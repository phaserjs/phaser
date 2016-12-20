
//  Encapsulates a 2D rectangle defined by its corner point in the top-left
//  and its extends in x (width) and y (height)

var Rectangle = function (x, y, width, height)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (width === undefined) { width = 0; }
    if (height === undefined) { height = 0; }

    return {

        x: x,

        y: y,

        width: width,

        height: height,

        set: function (x, y, width, height) {

            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;

            return this;

        },

        setPosition: function (x, y) {

            if (y === undefined) { y = x; }

            this.x = x;
            this.y = y;

            return this;

        },

        setSize: function (width, height) {

            if (height === undefined) { height = width; }

            this.width = width;
            this.height = height;

            return this;

        },

        /*
        get left () {

            return this.x;

        },

        get right () {

            return this.x + this.width;

        },

        get top () {

            return this.y;

        },

        get bottom () {

            return this.y + this.height;

        }
        */

    }

};

module.exports = Rectangle;
