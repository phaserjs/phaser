/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * 
 * The Body Bounds class contains methods to help you extract the world coordinates from various points around
 * the bounds of a Matter Body. Because Matter bodies are positioned based on their center of mass, and not a
 * dimension based center, you often need to get the bounds coordinates in order to properly align them in the world.
 * 
 * You can access this class via the MatterPhysics class from a Scene, i.e.:
 * 
 * ```javascript
 * this.matter.bodyBounds.getTopLeft(body);
 * ```
 * 
 * See also the `MatterPhysics.alignBody` method.
 *
 * @class BodyBounds
 * @memberof Phaser.Physics.Matter
 * @constructor
 * @since 3.22.0
 */
var BodyBounds = new Class({

    initialize:

    function BodyBounds ()
    {
        /**
         * A Vector2 that stores the temporary bounds center value during calculations by methods in this class.
         *
         * @name Phaser.Physics.Matter.BodyBounds#boundsCenter
         * @type {Phaser.Math.Vector2}
         * @since 3.22.0
         */
        this.boundsCenter = new Vector2();

        /**
         * A Vector2 that stores the temporary center diff values during calculations by methods in this class.
         *
         * @name Phaser.Physics.Matter.BodyBounds#centerDiff
         * @type {Phaser.Math.Vector2}
         * @since 3.22.0
         */
        this.centerDiff = new Vector2();
    },

    /**
     * Parses the given body to get the bounds diff values from it.
     * 
     * They're stored in this class in the temporary properties `boundsCenter` and `centerDiff`.
     * 
     * This method is called automatically by all other methods in this class.
     *
     * @method Phaser.Physics.Matter.BodyBounds#parseBody
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody} body - The Body to get the bounds position from.
     *
     * @return {boolean} `true` if it was able to get the bounds, otherwise `false`.
     */
    parseBody: function (body)
    {
        body = (body.hasOwnProperty('body')) ? body.body : body;

        if (!body.hasOwnProperty('bounds') || !body.hasOwnProperty('centerOfMass'))
        {
            return false;
        }

        var boundsCenter = this.boundsCenter;
        var centerDiff = this.centerDiff;

        var boundsWidth = body.bounds.max.x - body.bounds.min.x;
        var boundsHeight = body.bounds.max.y - body.bounds.min.y;

        var bodyCenterX = boundsWidth * body.centerOfMass.x;
        var bodyCenterY = boundsHeight * body.centerOfMass.y;

        boundsCenter.set(boundsWidth / 2, boundsHeight / 2);
        centerDiff.set(bodyCenterX - boundsCenter.x, bodyCenterY - boundsCenter.y);

        return true;
    },

    /**
     * Takes a Body and returns the world coordinates of the top-left of its _bounds_.
     * 
     * Body bounds are updated by Matter each step and factor in scale and rotation.
     * This will return the world coordinate based on the bodies _current_ position and bounds.
     *
     * @method Phaser.Physics.Matter.BodyBounds#getTopLeft
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody} body - The Body to get the position from.
     * @param {number} [x=0] - Optional horizontal offset to add to the returned coordinates.
     * @param {number} [y=0] - Optional vertical offset to add to the returned coordinates.
     *
     * @return {(Phaser.Math.Vector2|false)} A Vector2 containing the coordinates, or `false` if it was unable to parse the body.
     */
    getTopLeft: function (body, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (this.parseBody(body))
        {
            var center = this.boundsCenter;
            var diff = this.centerDiff;

            return new Vector2(
                x + center.x + diff.x,
                y + center.y + diff.y
            );
        }

        return false;
    },

    /**
     * Takes a Body and returns the world coordinates of the top-center of its _bounds_.
     * 
     * Body bounds are updated by Matter each step and factor in scale and rotation.
     * This will return the world coordinate based on the bodies _current_ position and bounds.
     *
     * @method Phaser.Physics.Matter.BodyBounds#getTopCenter
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody} body - The Body to get the position from.
     * @param {number} [x=0] - Optional horizontal offset to add to the returned coordinates.
     * @param {number} [y=0] - Optional vertical offset to add to the returned coordinates.
     *
     * @return {(Phaser.Math.Vector2|false)} A Vector2 containing the coordinates, or `false` if it was unable to parse the body.
     */
    getTopCenter: function (body, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (this.parseBody(body))
        {
            var center = this.boundsCenter;
            var diff = this.centerDiff;

            return new Vector2(
                x + diff.x,
                y + center.y + diff.y
            );
        }

        return false;
    },

    /**
     * Takes a Body and returns the world coordinates of the top-right of its _bounds_.
     * 
     * Body bounds are updated by Matter each step and factor in scale and rotation.
     * This will return the world coordinate based on the bodies _current_ position and bounds.
     *
     * @method Phaser.Physics.Matter.BodyBounds#getTopRight
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody} body - The Body to get the position from.
     * @param {number} [x=0] - Optional horizontal offset to add to the returned coordinates.
     * @param {number} [y=0] - Optional vertical offset to add to the returned coordinates.
     *
     * @return {(Phaser.Math.Vector2|false)} A Vector2 containing the coordinates, or `false` if it was unable to parse the body.
     */
    getTopRight: function (body, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (this.parseBody(body))
        {
            var center = this.boundsCenter;
            var diff = this.centerDiff;

            return new Vector2(
                x - (center.x - diff.x),
                y + center.y + diff.y
            );
        }

        return false;
    },

    /**
     * Takes a Body and returns the world coordinates of the left-center of its _bounds_.
     * 
     * Body bounds are updated by Matter each step and factor in scale and rotation.
     * This will return the world coordinate based on the bodies _current_ position and bounds.
     *
     * @method Phaser.Physics.Matter.BodyBounds#getLeftCenter
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody} body - The Body to get the position from.
     * @param {number} [x=0] - Optional horizontal offset to add to the returned coordinates.
     * @param {number} [y=0] - Optional vertical offset to add to the returned coordinates.
     *
     * @return {(Phaser.Math.Vector2|false)} A Vector2 containing the coordinates, or `false` if it was unable to parse the body.
     */
    getLeftCenter: function (body, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (this.parseBody(body))
        {
            var center = this.boundsCenter;
            var diff = this.centerDiff;

            return new Vector2(
                x + center.x + diff.x,
                y + diff.y
            );
        }

        return false;
    },

    /**
     * Takes a Body and returns the world coordinates of the center of its _bounds_.
     * 
     * Body bounds are updated by Matter each step and factor in scale and rotation.
     * This will return the world coordinate based on the bodies _current_ position and bounds.
     *
     * @method Phaser.Physics.Matter.BodyBounds#getCenter
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody} body - The Body to get the position from.
     * @param {number} [x=0] - Optional horizontal offset to add to the returned coordinates.
     * @param {number} [y=0] - Optional vertical offset to add to the returned coordinates.
     *
     * @return {(Phaser.Math.Vector2|false)} A Vector2 containing the coordinates, or `false` if it was unable to parse the body.
     */
    getCenter: function (body, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (this.parseBody(body))
        {
            var diff = this.centerDiff;

            return new Vector2(
                x + diff.x,
                y + diff.y
            );
        }

        return false;
    },

    /**
     * Takes a Body and returns the world coordinates of the right-center of its _bounds_.
     * 
     * Body bounds are updated by Matter each step and factor in scale and rotation.
     * This will return the world coordinate based on the bodies _current_ position and bounds.
     *
     * @method Phaser.Physics.Matter.BodyBounds#getRightCenter
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody} body - The Body to get the position from.
     * @param {number} [x=0] - Optional horizontal offset to add to the returned coordinates.
     * @param {number} [y=0] - Optional vertical offset to add to the returned coordinates.
     *
     * @return {(Phaser.Math.Vector2|false)} A Vector2 containing the coordinates, or `false` if it was unable to parse the body.
     */
    getRightCenter: function (body, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (this.parseBody(body))
        {
            var center = this.boundsCenter;
            var diff = this.centerDiff;

            return new Vector2(
                x - (center.x - diff.x),
                y + diff.y
            );
        }

        return false;
    },

    /**
     * Takes a Body and returns the world coordinates of the bottom-left of its _bounds_.
     * 
     * Body bounds are updated by Matter each step and factor in scale and rotation.
     * This will return the world coordinate based on the bodies _current_ position and bounds.
     *
     * @method Phaser.Physics.Matter.BodyBounds#getBottomLeft
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody} body - The Body to get the position from.
     * @param {number} [x=0] - Optional horizontal offset to add to the returned coordinates.
     * @param {number} [y=0] - Optional vertical offset to add to the returned coordinates.
     *
     * @return {(Phaser.Math.Vector2|false)} A Vector2 containing the coordinates, or `false` if it was unable to parse the body.
     */
    getBottomLeft: function (body, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (this.parseBody(body))
        {
            var center = this.boundsCenter;
            var diff = this.centerDiff;

            return new Vector2(
                x + center.x + diff.x,
                y - (center.y - diff.y)
            );
        }

        return false;
    },

    /**
     * Takes a Body and returns the world coordinates of the bottom-center of its _bounds_.
     * 
     * Body bounds are updated by Matter each step and factor in scale and rotation.
     * This will return the world coordinate based on the bodies _current_ position and bounds.
     *
     * @method Phaser.Physics.Matter.BodyBounds#getBottomCenter
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody} body - The Body to get the position from.
     * @param {number} [x=0] - Optional horizontal offset to add to the returned coordinates.
     * @param {number} [y=0] - Optional vertical offset to add to the returned coordinates.
     *
     * @return {(Phaser.Math.Vector2|false)} A Vector2 containing the coordinates, or `false` if it was unable to parse the body.
     */
    getBottomCenter: function (body, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (this.parseBody(body))
        {
            var center = this.boundsCenter;
            var diff = this.centerDiff;

            return new Vector2(
                x + diff.x,
                y - (center.y - diff.y)
            );
        }

        return false;
    },

    /**
     * Takes a Body and returns the world coordinates of the bottom-right of its _bounds_.
     * 
     * Body bounds are updated by Matter each step and factor in scale and rotation.
     * This will return the world coordinate based on the bodies _current_ position and bounds.
     *
     * @method Phaser.Physics.Matter.BodyBounds#getBottomRight
     * @since 3.22.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterBody} body - The Body to get the position from.
     * @param {number} [x=0] - Optional horizontal offset to add to the returned coordinates.
     * @param {number} [y=0] - Optional vertical offset to add to the returned coordinates.
     *
     * @return {(Phaser.Math.Vector2|false)} A Vector2 containing the coordinates, or `false` if it was unable to parse the body.
     */
    getBottomRight: function (body, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (this.parseBody(body))
        {
            var center = this.boundsCenter;
            var diff = this.centerDiff;

            return new Vector2(
                x - (center.x - diff.x),
                y - (center.y - diff.y)
            );
        }

        return false;
    }

});

module.exports = BodyBounds;
