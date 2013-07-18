/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../geom/Point.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="../Manager.ts" />
/// <reference path="../Body.ts" />

/**
* Phaser - Advanced Physics - Joint
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics {

    export class Joint {

        constructor(type: number, body1:Phaser.Physics.Body, body2:Phaser.Physics.Body, collideConnected) {

            this.id = Phaser.Physics.Manager.jointCounter++;
            this.type = type;

            this.body1 = body1;
            this.body2 = body2;

            this.collideConnected = collideConnected;

            this.maxForce = 9999999999;
            this.breakable = false;

        }

        public id: number;
        public type: number;

        public body1: Phaser.Physics.Body;
        public body2: Phaser.Physics.Body;

        public collideConnected; // bool?
        public maxForce: number;
        public breakable: bool;

        public anchor1: Phaser.Vec2;
        public anchor2: Phaser.Vec2;

        public getWorldAnchor1() {
            return this.body1.getWorldPoint(this.anchor1);
        }

        public getWorldAnchor2() {
            return this.body2.getWorldPoint(this.anchor2);
        }

        public setWorldAnchor1(anchor1) {
            this.anchor1 = this.body1.getLocalPoint(anchor1);
        }

        public setWorldAnchor2(anchor2) {
            this.anchor2 = this.body2.getLocalPoint(anchor2);
        }

    }


}