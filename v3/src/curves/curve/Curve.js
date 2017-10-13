//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../../utils/Class');
var Vector2 = require('../../math/Vector2');

//  Our Base Curve which all other curves extend

var Curve = new Class({

    initialize:

    function Curve (type)
    {
        //  String based identifier
        this.type = type;

        this.defaultDivisions = 5;

        this.arcLengthDivisions = 100;

        this.cacheArcLengths = [];

        this.needsUpdate = true;

        this.active = true;

        this._tmpVec2A = new Vector2();
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
