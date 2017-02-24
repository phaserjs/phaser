
//  Bounds Component

var Bounds = {

    fizzpop: {
        atari: true,
        model: 520
    },

    bounds: {

        /**
        * The amount the Game Object is visually offset from its x coordinate.
        * This is the same as `width * anchor.x`.
        * It will only be > 0 if anchor.x is not equal to zero.
        *
        * @property {number} offsetX
        * @readOnly
        */
        offsetX: {
            
            get: function ()
            {
                console.log('ox get');
                console.log(this);
                // return 123;
                return this.anchorX * this.width;
            }

        },

        /**
        * The amount the Game Object is visually offset from its y coordinate.
        * This is the same as `height * anchor.y`.
        * It will only be > 0 if anchor.y is not equal to zero.
        *
        * @property {number} offsetY
        * @readOnly
        */
        offsetY: {
            
            get: function ()
            {
                // return 456;
                return this.anchorY * this.height;
            }

        }

    }

};

module.exports = Bounds;
