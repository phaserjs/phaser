//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../../utils/Class');
var Vector2 = require('../../math/Vector2');

//  Our Base Curve which all other curves extend

var Curve = new Class({

    initialize:

    /**
     * [description]
     *
     * @class Curve
     * @memberOf Phaser.Curves
     * @constructor
     * @since 3.0.0
     *
     * @param {string} type - [description]
     */
    function Curve (type)
    {
        /**
         * String based identifier
         *
         * @property {string} type
         */
        this.type = type;

        /**
         * [description]
         *
         * @property {integer} defaultDivisions
         * @default 5
         */
        this.defaultDivisions = 5;

        /**
         * [description]
         *
         * @property {integer} arcLengthDivisions
         * @default 100
         */
        this.arcLengthDivisions = 100;

        /**
         * [description]
         *
         * @property {array} cacheArcLengths
         * @default []
         */
        this.cacheArcLengths = [];

        /**
         * [description]
         *
         * @property {boolean} needsUpdate
         * @default true
         */
        this.needsUpdate = true;

        /**
         * [description]
         *
         * @property {boolean} active
         * @default true
         */
        this.active = true;

        /**
         * [description]
         *
         * @property {Phaser.Math.Vector2} _tmpVec2A
         * @private
         */
        this._tmpVec2A = new Vector2();

        /**
         * [description]
         *
         * @property {Phaser.Math.Vector2} _tmpVec2B
         * @private
         */
        this._tmpVec2B = new Vector2();
    },

    draw: require('./inc/Draw'),
    getBounds: require('./inc/GetBounds'),
    getDistancePoints: require('./inc/GetDistancePoints'),
    getEndPoint: require('./inc/GetEndPoint'),
    getLength: require('./inc/GetLength'),
    getLengths: require('./inc/GetLengths'),
    getPointAt: require('./inc/GetPointAt'),
    getPoints: require('./inc/GetPoints'),
    getSpacedPoints: require('./inc/GetSpacedPoints'),
    getStartPoint: require('./inc/GetStartPoint'),
    getTangent: require('./inc/GetTangent'),
    getTangentAt: require('./inc/GetTangentAt'),
    getTFromDistance: require('./inc/GetTFromDistance'),
    getUtoTmapping: require('./inc/GetUToTMapping'),
    updateArcLengths: require('./inc/UpdateArcLengths')

});

module.exports = Curve;
