/// <reference path="../Game.ts" />
/// <reference path="../geom/Point.ts" />
/// <reference path="../geom/Rectangle.ts" />
/// <reference path="../geom/Circle.ts" />
/// <reference path="../physics/Body.ts" />

/**
* Phaser - BodyUtils
*
* A collection of methods useful for manipulating AdvancedPhysics Body objects.
*/

module Phaser {

    export class BodyUtils {

	    static duplicate(source: Phaser.Physics.Body, output?: Phaser.Physics.Body): Phaser.Physics.Body {

	        /*
            console.log('body duplicate called');

	        var newBody = new Phaser.Physics.Body(source.type, source.transform.t, source.rotation);
	        
            for (var i = 0; i < source.shapes.length; i++)
	        {
	            output.addShape(source.shapes[i].duplicate());
	        }

	        output.resetMassData();
            */

	        return output;

	    }

	    static addPoly(body: Phaser.Physics.Body, verts, elasticity?: number = 1, friction?: number = 1, density?: number = 1): Phaser.Physics.Shapes.Poly {

	        var poly: Phaser.Physics.Shapes.Poly = new Phaser.Physics.Shapes.Poly(verts);
	        poly.elasticity = elasticity;
	        poly.friction = friction;
	        poly.density = density;

	        body.addShape(poly);
	        body.resetMassData();

	        return poly;

	    }

	    static addTriangle(body: Phaser.Physics.Body, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, elasticity?: number = 1, friction?: number = 1, density?: number = 1): Phaser.Physics.Shapes.Triangle {

	        var tri: Phaser.Physics.Shapes.Triangle = new Phaser.Physics.Shapes.Triangle(x1, y1, x2, y2, x3, y3);
	        tri.elasticity = elasticity;
	        tri.friction = friction;
	        tri.density = density;

	        body.addShape(tri);
	        body.resetMassData();

	        return tri;

	    }

	    static addBox(body: Phaser.Physics.Body, x: number, y: number, width: number, height: number, elasticity?: number = 1, friction?: number = 1, density?: number = 1): Phaser.Physics.Shapes.Box {

	        var box: Phaser.Physics.Shapes.Box = new Phaser.Physics.Shapes.Box(x, y, width, height);
	        box.elasticity = elasticity;
	        box.friction = friction;
	        box.density = density;

	        body.addShape(box);
	        body.resetMassData();

	        return box;

	    }

	    static addCircle(body: Phaser.Physics.Body, radius: number, x?: number = 0, y?: number = 0, elasticity?: number = 1, friction?: number = 1, density?: number = 1): Phaser.Physics.Shapes.Circle {

	        var circle: Phaser.Physics.Shapes.Circle = new Phaser.Physics.Shapes.Circle(radius, x, y);
	        circle.elasticity = elasticity;
	        circle.friction = friction;
	        circle.density = density;

	        body.addShape(circle);
	        body.resetMassData();

	        return circle;

	    }

    }

}