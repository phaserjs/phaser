var Clamp = require('../../math/Clamp');

/**
 * Provides methods used for setting the alpha properties of a Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @name Phaser.GameObjects.Components.Alpha
 * @mixin
 * @since 3.0.0
 */

//  bitmask flag for GameObject.renderMask
var _FLAG = 2; // 0010

var Alpha = {

    _alpha: 1,

    _alphaTL: 1,
    _alphaTR: 1,
    _alphaBL: 1,
    _alphaBR: 1,

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Alpha.clearAlpha
     * @since 3.0.0
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    clearAlpha: function ()
    {
        return this.setAlpha(1);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Alpha.setAlpha
     * @since 3.0.0
     * 
     * @param {float} [topLeft=1] - The alpha value used for the top-left of the Game Object. If this is the only value given it's applied across the whole Game Object.
     * @param {float} [topRight] - The alpha value used for the top-right of the Game Object.
     * @param {float} [bottomLeft] - The alpha value used for the bottom-left of the Game Object.
     * @param {float} [bottomRight] - The alpha value used for the bottom-right of the Game Object.
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setAlpha: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        if (topLeft === undefined) { topLeft = 1; }

        //  Treat as if there is only one alpha value for the whole Game Object
        if (topRight === undefined)
        {
            this.alpha = topLeft;
        }
        else
        {
            this._alphaTL = Clamp(topLeft, 0, 1);
            this._alphaTR = Clamp(topRight, 0, 1);
            this._alphaBL = Clamp(bottomLeft, 0, 1);
            this._alphaBR = Clamp(bottomRight, 0, 1);
        }

        return this;
    },

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Components.Alpha#alpha
     * @property {float} alpha
     * @since 3.0.0
     */
    alpha: {

        get: function ()
        {
            return this._alpha;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alpha = v;
            this._alphaTL = v;
            this._alphaTR = v;
            this._alphaBL = v;
            this._alphaBR = v;

            if (v === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Components.Alpha#alphaTopLeft
     * @property {float} alphaTopLeft
     * @webglOnly
     * @since 3.0.0
     */
    alphaTopLeft: {

        get: function ()
        {
            return this._alphaTL;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaTL = v;

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Components.Alpha#alphaTopRight
     * @property {float} alphaTopRight
     * @webglOnly
     * @since 3.0.0
     */
    alphaTopRight: {

        get: function ()
        {
            return this._alphaTR;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaTR = v;

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Components.Alpha#alphaBottomLeft
     * @property {float} alphaBottomLeft
     * @webglOnly
     * @since 3.0.0
     */
    alphaBottomLeft: {

        get: function ()
        {
            return this._alphaBL;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaBL = v;

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Components.Alpha#alphaBottomRight
     * @property {float} alphaBottomRight
     * @webglOnly
     * @since 3.0.0
     */
    alphaBottomRight: {

        get: function ()
        {
            return this._alphaBR;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaBR = v;

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    }

};

module.exports = Alpha;
