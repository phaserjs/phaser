/// <reference path="../../Game.d.ts" />
/// <reference path="Finger.d.ts" />
module Phaser {
    class Touch {
        constructor(game: Game);
        private _game;
        public x: number;
        public y: number;
        private _fingers;
        public finger1: Finger;
        public finger2: Finger;
        public finger3: Finger;
        public finger4: Finger;
        public finger5: Finger;
        public finger6: Finger;
        public finger7: Finger;
        public finger8: Finger;
        public finger9: Finger;
        public finger10: Finger;
        public latestFinger: Finger;
        public isDown: bool;
        public isUp: bool;
        public touchDown: Signal;
        public touchUp: Signal;
        public start(): void;
        private consumeTouchMove(event);
        private onTouchStart(event);
        private onTouchCancel(event);
        private onTouchEnter(event);
        private onTouchLeave(event);
        private onTouchMove(event);
        private onTouchEnd(event);
        public calculateDistance(finger1: Finger, finger2: Finger): void;
        public calculateAngle(finger1: Finger, finger2: Finger): void;
        public checkOverlap(finger1: Finger, finger2: Finger): void;
        public update(): void;
        public stop(): void;
        public reset(): void;
    }
}
