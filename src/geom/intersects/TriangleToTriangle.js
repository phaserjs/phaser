/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ContainsArray = require('../triangle/ContainsArray');
var Decompose = require('../triangle/Decompose');
var LineToLine = require('./LineToLine');

/**
 * [description]
 *
 * @function Phaser.Geom.Intersects.TriangleToTriangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangleA - [description]
 * @param {Phaser.Geom.Triangle} triangleB - [description]
 *
 * @return {boolean} [description]
 */
var TriangleToTriangle = function (triangleA, triangleB)
{
    //  First the cheapest ones:

    if (
        triangleA.left > triangleB.right ||
        triangleA.right < triangleB.left ||
        triangleA.top > triangleB.bottom ||
        triangleA.bottom < triangleB.top)
    {
        return false;
    }

    var lineAA = triangleA.getLineA();
    var lineAB = triangleA.getLineB();
    var lineAC = triangleA.getLineC();

    var lineBA = triangleB.getLineA();
    var lineBB = triangleB.getLineB();
    var lineBC = triangleB.getLineC();

    //  Now check the lines against each line of TriangleB
    if (LineToLine(lineAA, lineBA) || LineToLine(lineAA, lineBB) || LineToLine(lineAA, lineBC))
    {
        return true;
    }

    if (LineToLine(lineAB, lineBA) || LineToLine(lineAB, lineBB) || LineToLine(lineAB, lineBC))
    {
        return true;
    }

    if (LineToLine(lineAC, lineBA) || LineToLine(lineAC, lineBB) || LineToLine(lineAC, lineBC))
    {
        return true;
    }

    //  Nope, so check to see if any of the points of triangleA are within triangleB

    var points = Decompose(triangleA);
    var within = ContainsArray(triangleB, points, true);

    if (within.length > 0)
    {
        return true;
    }

    //  Finally check to see if any of the points of triangleB are within triangleA

    points = Decompose(triangleB);
    within = ContainsArray(triangleA, points, true);

    if (within.length > 0)
    {
        return true;
    }

    return false;
};

module.exports = TriangleToTriangle;
