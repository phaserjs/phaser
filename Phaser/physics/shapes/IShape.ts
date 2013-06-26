/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../geom/Point.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="../Manager.ts" />
/// <reference path="../Body.ts" />
/// <reference path="Shape.ts" />

/**
* Phaser - Advanced Physics - IShape
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics {

    export interface IShape {

        id: number;
        type: number;

        elasticity: number;
        friction: number;
        density: number;

        body: Body;
        bounds: Bounds;

        area(): number;
        centroid(): Phaser.Vec2;
        inertia(mass: number): number;
        cacheData(xf:Transform);
        pointQuery(p: Phaser.Vec2): bool;
        findEdgeByPoint(p: Phaser.Vec2, minDist: number): number;
        findVertexByPoint(p: Phaser.Vec2, minDist: number): number;

        verts: Phaser.Vec2[];
        planes: Phaser.Physics.Plane[];
        tverts: Phaser.Vec2[];
        tplanes: Phaser.Physics.Plane[];
        convexity: bool;

    }

}

