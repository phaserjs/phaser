/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="../Manager.ts" />
/// <reference path="../Body.ts" />
/// <reference path="../Bounds.ts" />
/// <reference path="IShape.ts" />

/**
* Phaser - Advanced Physics - Shape
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics {

    export class Shape {

        constructor(type: number) {

            this.id = Phaser.Physics.Manager.shapeCounter++;
            this.type = type;

            this.elasticity = 0.0;
            this.friction = 1.0;
            this.density = 1;

            this.bounds = new Bounds;

        }

        public id: number;
        public type: number;
        public body: Body;

        public verts: Phaser.Vec2[];
        public planes: Phaser.Physics.Plane[];

        public tverts: Phaser.Vec2[];
        public tplanes: Phaser.Physics.Plane[];

        public convexity: bool;

    	// Coefficient of restitution (elasticity)
        public elasticity: number;

    	// Frictional coefficient
        public friction: number;

    	// Mass density
        public density: number;

        // Axis-aligned bounding box
        public bounds: Bounds;

        //  Over-ridden by ShapePoly
        public findEdgeByPoint(p: Phaser.Vec2, minDist: number): number {
            return -1;
        }

    }

}