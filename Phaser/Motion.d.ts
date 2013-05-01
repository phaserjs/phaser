/// <reference path="Game.d.ts" />
/// <reference path="gameobjects/GameObject.d.ts" />
module Phaser {
    class Motion {
        constructor(game: Game);
        private _game;
        public computeVelocity(Velocity: number, Acceleration?: number, Drag?: number, Max?: number): number;
        public velocityFromAngle(angle: number, speed: number): Point;
        public moveTowardsObject(source: GameObject, dest: GameObject, speed?: number, maxTime?: number): void;
        public accelerateTowardsObject(source: GameObject, dest: GameObject, speed: number, xSpeedMax: number, ySpeedMax: number): void;
        public moveTowardsMouse(source: GameObject, speed?: number, maxTime?: number): void;
        public accelerateTowardsMouse(source: GameObject, speed: number, xSpeedMax: number, ySpeedMax: number): void;
        public moveTowardsPoint(source: GameObject, target: Point, speed?: number, maxTime?: number): void;
        public accelerateTowardsPoint(source: GameObject, target: Point, speed: number, xSpeedMax: number, ySpeedMax: number): void;
        public distanceBetween(a: GameObject, b: GameObject): number;
        public distanceToPoint(a: GameObject, target: Point): number;
        public distanceToMouse(a: GameObject): number;
        public angleBetweenPoint(a: GameObject, target: Point, asDegrees?: bool): number;
        public angleBetween(a: GameObject, b: GameObject, asDegrees?: bool): number;
        public velocityFromFacing(parent: GameObject, speed: number): Point;
        public angleBetweenMouse(a: GameObject, asDegrees?: bool): number;
    }
}
