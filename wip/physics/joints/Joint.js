var Phaser;
(function (Phaser) {
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
    (function (Physics) {
        var Joint = (function () {
            function Joint(type, body1, body2, collideConnected) {
                this.id = Physics.AdvancedPhysics.jointCounter++;
                this.type = type;
                this.body1 = body1;
                this.body2 = body2;
                this.collideConnected = collideConnected;
                this.maxForce = 9999999999;
                this.breakable = false;
            }
            Joint.prototype.getWorldAnchor1 = function () {
                return this.body1.getWorldPoint(this.anchor1);
            };
            Joint.prototype.getWorldAnchor2 = function () {
                return this.body2.getWorldPoint(this.anchor2);
            };
            Joint.prototype.setWorldAnchor1 = function (anchor1) {
                this.anchor1 = this.body1.getLocalPoint(anchor1);
            };
            Joint.prototype.setWorldAnchor2 = function (anchor2) {
                this.anchor2 = this.body2.getLocalPoint(anchor2);
            };
            return Joint;
        })();
        Physics.Joint = Joint;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
