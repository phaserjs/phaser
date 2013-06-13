/// <reference path="../Game.ts" />
/// <reference path="Vec2Utils.ts" />

/**
* Phaser - 2D Transform
*
* A 2D Transform
*/

module Phaser {

    export class Transform {

        /**
        * Creates a new 2D Transform object.
        * @class Transform
        * @constructor
        * @return {Transform} This object
        **/
        constructor(pos: Phaser.Vec2, angle: number) {

            this.t = Phaser.Vec2Utils.clone(pos);
            this.c = Math.cos(angle);
            this.s = Math.sin(angle);

            this._tempVec = new Phaser.Vec2;

        }

        private _tempVec: Phaser.Vec2;

        public t: Phaser.Vec2;
        public c: number;
        public s: number;

        public setTo(pos:Phaser.Vec2, angle:number) {

            this.t.copyFrom(pos);
            this.c = Math.cos(angle);
            this.s = Math.sin(angle);

            return this;

        }

        public setRotation(angle:number) {

            this.c = Math.cos(angle);
            this.s = Math.sin(angle);
            return this;

        }

        public setPosition(p:Phaser.Vec2) {

            this.t.copyFrom(p);
            return this;

        }

        public identity() {

            this.t.setTo(0, 0);
            this.c = 1;
            this.s = 0;

            return this;

        }

        public rotate(v:Phaser.Vec2):Phaser.Vec2 {
            return this._tempVec.setTo(v.x * this.c - v.y * this.s, v.x * this.s + v.y * this.c);
        }

        public unrotate(v:Phaser.Vec2):Phaser.Vec2 {
            return this._tempVec.setTo(v.x * this.c + v.y * this.s, -v.x * this.s + v.y * this.c);
        }

        public transform(v:Phaser.Vec2):Phaser.Vec2 {
            return this._tempVec.setTo(v.x * this.c - v.y * this.s + this.t.x, v.x * this.s + v.y * this.c + this.t.y);
        }

        public untransform(v:Phaser.Vec2):Phaser.Vec2 {

            var px = v.x - this.t.x;
            var py = v.y - this.t.y;

            //  expensive - check for alternatives
            return this._tempVec.setTo(px * this.c + py * this.s, -px * this.s + py * this.c);

        }

    }

}