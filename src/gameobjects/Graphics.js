/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new `Graphics` object.
*
* @class Phaser.Graphics
* @extends PIXI.Graphics
* -- Google Closure Compiler and future jsdoc can use @implements instead of @extends
* @extends Phaser.GameObject.CoreMixin
* @extends Phaser.GameObject.CullingMixin
* @extends Phaser.GameObject.InputMixin
* @extends Phaser.GameObject.EventsMixin
* @constructor
* @param {Phaser.Game} game Current game instance.
* @param {number} x - X position of the new graphics object.
* @param {number} y - Y position of the new graphics object.
*/
Phaser.Graphics = function (game, x, y) {

    x = x || 0;
    y = y || 0;

    PIXI.Graphics.call(this);

    Phaser.GameObject.init.call(this, game);

    this.position.set(x, y);
    this.world.setTo(x, y);

};

Phaser.Graphics.prototype = Object.create(PIXI.Graphics.prototype);
Phaser.Graphics.prototype.constructor = Phaser.Graphics;

/**
* @property {number} type - The const type of this object.
* @readonly
* @default
*/
Phaser.Graphics.prototype.type = Phaser.GRAPHICS;

Phaser.GameObject.mix(Phaser.Graphics.prototype, Phaser.GameObject.Traits.GRAPHICS_LIKE);

/**
* @method Phaser.Graphics.prototype.destroyCustom
* @protected
*/
Phaser.Graphics.prototype.destroyCustom = function() {

    this.clear();

};

/*
* Draws a single {Phaser.Polygon} triangle from a {Phaser.Point} array
*
* @method Phaser.Graphics.prototype.drawTriangle
* @param {Array<Phaser.Point>} points - An array of Phaser.Points that make up the three vertices of this triangle
* @param {boolean} [cull=false] - Should we check if the triangle is back-facing
*/
Phaser.Graphics.prototype.drawTriangle = function(points, cull) {

    if (typeof cull === 'undefined') { cull = false; }

    var triangle = new Phaser.Polygon(points);

    if (cull)
    {
        var cameraToFace = new Phaser.Point(this.game.camera.x - points[0].x, this.game.camera.y - points[0].y);
        var ab = new Phaser.Point(points[1].x - points[0].x, points[1].y - points[0].y);
        var cb = new Phaser.Point(points[1].x - points[2].x, points[1].y - points[2].y);
        var faceNormal = cb.cross(ab);

        if (cameraToFace.dot(faceNormal) > 0)
        {
            this.drawPolygon(triangle);
        }
    }
    else
    {
        this.drawPolygon(triangle);
    }

};

/*
* Draws {Phaser.Polygon} triangles 
*
* @method Phaser.Graphics.prototype.drawTriangles
* @param {Array<Phaser.Point>|Array<number>} vertices - An array of Phaser.Points or numbers that make up the vertices of the triangles
* @param {Array<number>} {indices=null} - An array of numbers that describe what order to draw the vertices in
* @param {boolean} [cull=false] - Should we check if the triangle is back-facing
*/
Phaser.Graphics.prototype.drawTriangles = function(vertices, indices, cull) {

    if (typeof cull === 'undefined') { cull = false; }

    var point1 = new Phaser.Point();
    var point2 = new Phaser.Point();
    var point3 = new Phaser.Point();
    var points = [];
    var i;

    if (!indices)
    {
        if (vertices[0] instanceof Phaser.Point)
        {
            for (i = 0; i < vertices.length / 3; i++)
            {
                this.drawTriangle([vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]], cull);
            }
        }
        else
        {
            for (i = 0; i < vertices.length / 6; i++)
            {
                point1.x = vertices[i * 6 + 0];
                point1.y = vertices[i * 6 + 1];
                point2.x = vertices[i * 6 + 2];
                point2.y = vertices[i * 6 + 3];
                point3.x = vertices[i * 6 + 4];
                point3.y = vertices[i * 6 + 5];
                this.drawTriangle([point1, point2, point3], cull);
            }
        }
    }
    else
    {
        if (vertices[0] instanceof Phaser.Point)
        {
            for (i = 0; i < indices.length /3; i++)
            {
                points.push(vertices[indices[i * 3 ]]);
                points.push(vertices[indices[i * 3 + 1]]);
                points.push(vertices[indices[i * 3 + 2]]);

                if (points.length === 3)
                {
                    this.drawTriangle(points, cull);
                    points = [];
                }
            }
        }
        else
        {
            for (i = 0; i < indices.length; i++)
            {
                point1.x = vertices[indices[i] * 2];
                point1.y = vertices[indices[i] * 2 + 1];
                points.push(point1.copyTo({}));

                if (points.length === 3)
                {
                    this.drawTriangle(points, cull);
                    points = [];
                }
            }
        }
    }
};
