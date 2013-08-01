/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../geom/Point.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="../AdvancedPhysics.ts" />
/// <reference path="../Body.ts" />

/**
* Phaser - Advanced Physics - Joint
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics {

    export interface IJoint {

        id: number;
        type: number;

        body1: Phaser.Physics.Body;
        body2: Phaser.Physics.Body;

        collideConnected; // bool?
        maxForce: number;
        breakable: bool;

        anchor1: Phaser.Vec2;
        anchor2: Phaser.Vec2;

        getWorldAnchor1();
        getWorldAnchor2();
        setWorldAnchor1(anchor1);
        setWorldAnchor2(anchor2);

        initSolver(dt, warmStarting);
        solveVelocityConstraints();
        solvePositionConstraints();
        getReactionForce(dt_inv);

    }

}

