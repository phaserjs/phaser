/// <reference path="../../Game.ts" />
/// <reference path="Body.ts" />
/// <reference path="Joint.ts" />

/**
* Phaser - Advanced Physics Manager
*
* Your game only has one PhysicsManager instance and it's responsible for looking after, creating and colliding
* all of the physics objects in the world.
*/

module Phaser.Physics.Advanced {

    export class Manager {

        constructor(game: Game) {

            this.game = game;

        }

        /**
         * Local reference to Game.
         */
        public game: Game;

        public static SHAPE_TYPE_CIRCLE: number = 0;
        public static SHAPE_TYPE_SEGMENT: number = 1;
        public static SHAPE_TYPE_POLY: number = 2;
        public static SHAPE_NUM_TYPES: number = 3;

        public static JOINT_TYPE_ANGLE: number = 0;
        public static JOINT_TYPE_REVOLUTE: number = 1;
        public static JOINT_TYPE_WELD: number = 2;
        public static JOINT_TYPE_WHEEL: number = 3;
        public static JOINT_TYPE_PRISMATIC: number = 4;
        public static JOINT_TYPE_DISTANCE: number = 5;
        public static JOINT_TYPE_ROPE: number = 6;
        public static JOINT_TYPE_MOUSE: number = 7;

        public static JOINT_LINEAR_SLOP: number = 0.0008;
        public static JOINT_ANGULAR_SLOP: number = 2 * Phaser.GameMath.DEG_TO_RAD;
        public static JOINT_MAX_LINEAR_CORRECTION: number = 0.5;
        public static JOINT_MAX_ANGULAR_CORRECTION: number = 8 * Phaser.GameMath.DEG_TO_RAD;

        public static JOINT_LIMIT_STATE_INACTIVE: number = 0;
        public static JOINT_LIMIT_STATE_AT_LOWER: number = 1;
        public static JOINT_LIMIT_STATE_AT_UPPER: number = 2;
        public static JOINT_LIMIT_STATE_EQUAL_LIMITS: number = 3;

        public static bodyCounter: number = 0;
        public static jointCounter: number = 0;
        public static shapeCounter: number = 0;

        public static pixelsToMeters(value: number): number {
            return value * 0.02;
        }

        public static metersToPixels(value: number): number {
            return value * 50;
        }

        public static p2m(value: number): number {
            return value * 0.02;
        }

        public static m2p(value: number): number {
            return value * 50;
        }

    }

}