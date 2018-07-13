/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Geom.Intersects
 */

module.exports = {

    CircleToCircle: require('./CircleToCircle'),
    CircleToRectangle: require('./CircleToRectangle'),
    GetRectangleIntersection: require('./GetRectangleIntersection'),
    LineToCircle: require('./LineToCircle'),
    LineToLine: require('./LineToLine'),
    LineToRectangle: require('./LineToRectangle'),
    PointToLine: require('./PointToLine'),
    PointToLineSegment: require('./PointToLineSegment'),
    RectangleToRectangle: require('./RectangleToRectangle'),
    RectangleToTriangle: require('./RectangleToTriangle'),
    RectangleToValues: require('./RectangleToValues'),
    TriangleToCircle: require('./TriangleToCircle'),
    TriangleToLine: require('./TriangleToLine'),
    TriangleToTriangle: require('./TriangleToTriangle')

};
