/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Graphics object is a way to draw primitives to your game. Primitives include forms of geometry, such as Rectangles,
* Circles and Polygons. They also include lines, arcs and curves. When you initially create a Graphics object it will
* be empty. To 'draw' to it you first specify a lineStyle or fillStyle (or both), and then draw a shape. For example:
*
* ```
* graphics.beginFill(0xff0000);
* graphics.drawCircle(50, 50, 100);
* graphics.endFill();
* ```
* 
* This will draw a circle shape to the Graphics object, with a diameter of 100, located at x: 50, y: 50.
*
* When a Graphics object is rendered it will render differently based on if the game is running under Canvas or
* WebGL. Under Canvas it will use the HTML Canvas context drawing operations to draw the path. Under WebGL the
* graphics data is decomposed into polygons. Both of these are expensive processes, especially with complex shapes.
* 
* If your Graphics object doesn't change much (or at all) once you've drawn your shape to it, then you will help
* performance by calling `Graphics.generateTexture`. This will 'bake' the Graphics object into a Texture, and return it.
* You can then use this Texture for Sprites or other display objects. If your Graphics object updates frequently then
* you should avoid doing this, as it will constantly generate new textures, which will consume memory.
*
* As you can tell, Graphics objects are a bit of a trade-off. While they are extremely useful, you need to be careful
* in their complexity and quantity of them in your game.
*
* @class Phaser.Graphics
* @constructor
* @extends PIXI.Graphics
* @extends Phaser.Component.Core
* @extends Phaser.Component.Angle
* @extends Phaser.Component.AutoCull
* @extends Phaser.Component.Bounds
* @extends Phaser.Component.Destroy
* @extends Phaser.Component.FixedToCamera
* @extends Phaser.Component.InputEnabled
* @extends Phaser.Component.InWorld
* @extends Phaser.Component.LifeSpan
* @extends Phaser.Component.PhysicsBody
* @extends Phaser.Component.Reset
* @param {Phaser.Game} game - Current game instance.
* @param {number} [x=0] - X position of the new graphics object.
* @param {number} [y=0] - Y position of the new graphics object.
*/
Phaser.Graphics = function (game, x, y) {

    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }

    /**
    * @property {number} type - The const type of this object.
    * @default
    */
    this.type = Phaser.GRAPHICS;

    /**
    * @property {number} physicsType - The const physics body type of this object.
    * @readonly
    */
    this.physicsType = Phaser.SPRITE;

    /**
    * @property {Phaser.Point} anchor - Required for a Graphics shape to work as a Physics body, do not modify this value.
    * @private
    */
    this.anchor = new Phaser.Point();

    PIXI.Graphics.call(this);

    Phaser.Component.Core.init.call(this, game, x, y, '', null);

};

Phaser.Graphics.prototype = Object.create(PIXI.Graphics.prototype);
Phaser.Graphics.prototype.constructor = Phaser.Graphics;

Phaser.Component.Core.install.call(Phaser.Graphics.prototype, [
    'Angle',
    'AutoCull',
    'Bounds',
    'Destroy',
    'FixedToCamera',
    'InputEnabled',
    'InWorld',
    'LifeSpan',
    'PhysicsBody',
    'Reset'
]);

Phaser.Graphics.prototype.preUpdatePhysics = Phaser.Component.PhysicsBody.preUpdate;
Phaser.Graphics.prototype.preUpdateLifeSpan = Phaser.Component.LifeSpan.preUpdate;
Phaser.Graphics.prototype.preUpdateInWorld = Phaser.Component.InWorld.preUpdate;
Phaser.Graphics.prototype.preUpdateCore = Phaser.Component.Core.preUpdate;

/**
* Automatically called by World.preUpdate.
* 
* @method
* @memberof Phaser.Graphics
*/
Phaser.Graphics.prototype.preUpdate = function () {

    if (!this.preUpdatePhysics() || !this.preUpdateLifeSpan() || !this.preUpdateInWorld())
    {
        return false;
    }

    return this.preUpdateCore();

};

/**
* Destroy this Graphics instance.
*
* @method Phaser.Graphics.prototype.destroy
* @param {boolean} [destroyChildren=true] - Should every child of this object have its destroy method called?
*/
Phaser.Graphics.prototype.destroy = function(destroyChildren) {

    this.clear();

    Phaser.Component.Destroy.prototype.destroy.call(this, destroyChildren);

};

/*
* Draws a single {Phaser.Polygon} triangle from a {Phaser.Point} array
*
* @method Phaser.Graphics.prototype.drawTriangle
* @param {Array<Phaser.Point>} points - An array of Phaser.Points that make up the three vertices of this triangle
* @param {boolean} [cull=false] - Should we check if the triangle is back-facing
*/
Phaser.Graphics.prototype.drawTriangle = function(points, cull) {

    if (cull === undefined) { cull = false; }

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

    if (cull === undefined) { cull = false; }

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
