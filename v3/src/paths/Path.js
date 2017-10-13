//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../utils/Class');
var GameObjectFactory = require('../scene/plugins/GameObjectFactory');
var Vector2 = require('../math/Vector2');

var Path = new Class({

    initialize:

    function Path (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        this.name = '';

        this.curves = [];

        this.cacheLengths = [];

        // Automatically closes the path
        this.autoClose = false;

        this.startPoint = new Vector2();

        this._tmpVec2A = new Vector2();
        this._tmpVec2B = new Vector2();

        if (typeof x === 'object')
        {
            this.fromJSON(x);
        }
        else
        {
            this.startPoint.set(x, y);
        }
    },

    add: require('./inc/Add'),
    circleto: require('./inc/CircleTo'),
    closePath: require('./inc/ClosePath'),
    cubicBezierTo: require('./inc/CubicBezierTo'),
    destroy: require('./inc/Destroy'),
    draw: require('./inc/Draw'),
    ellipseTo: require('./inc/EllipseTo'),
    fromJSON: require('./inc/FromJSON'),
    getBounds: require('./inc/GetBounds'),
    getCurveLengths: require('./inc/GetCurveLengths'),
    getEndPoint: require('./inc/GetEndPoint'),
    getLength: require('./inc/GetLength'),
    getPoint: require('./inc/GetPoint'),
    getPoints: require('./inc/GetPoints'),
    getSpacedPoints: require('./inc/GetSpacedPoints'),
    getStartPoint: require('./inc/GetStartPoint'),
    lineTo: require('./inc/LineTo'),
    moveTo: require('./inc/MoveTo'),
    splineTo: require('./inc/SplineTo'),
    toJSON: require('./inc/ToJSON'),
    updateArcLengths: require('./inc/UpdateArcLengths')

});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

GameObjectFactory.register('path', function (x, y)
{
    return new Path(x, y);
});

module.exports = Path;
