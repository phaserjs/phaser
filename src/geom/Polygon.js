/**
* Creates a new Polygon. You have to provide a list of points
* @class Phaser.Polygon
* @classdesc The polygon represents a list of orderded points in space
* @constructor
* @param points* {Array<Point>|Array<Number>|Point...|Number...} This can be an array of Points that form the polygon,
*      a flat array of numbers that will be interpreted as [x,y, x,y, ...], or the arugments passed can be
*      all the points of the polygon e.g. `new PIXI.Polygon(new PIXI.Point(), new PIXI.Point(), ...)`, or the
*      arguments passed can be flat x,y values e.g. `new PIXI.Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are
*      Numbers.
**/
Phaser.Polygon = function (points) {

    PIXI.Polygon.call(this, points);

    /**
	* @property {Description} type - Description.
	*/
    this.type = Phaser.POLYGON;

};

Phaser.Polygon.prototype = Object.create(PIXI.Polygon.prototype);
Phaser.Polygon.prototype.constructor = Phaser.Polygon;