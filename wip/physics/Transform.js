/// <reference path="../Game.ts" />
/// <reference path="Vec2Utils.ts" />
/**
* Phaser - 2D Transform
*
* A 2D Transform
*/
var Phaser;
(function (Phaser) {
    var Transform = (function () {
        /**
        * Creates a new 2D Transform object.
        * @class Transform
        * @constructor
        * @return {Transform} This object
        **/
        function Transform(pos, angle) {
            this.t = Phaser.Vec2Utils.clone(pos);
            this.c = Math.cos(angle);
            this.s = Math.sin(angle);
            this.angle = angle;
        }
        Transform.prototype.toString = function () {
            return 't=' + this.t.toString() + ' c=' + this.c + ' s=' + this.s + ' a=' + this.angle;
        };
        Transform.prototype.setTo = function (pos, angle) {
            this.t.copyFrom(pos);
            this.c = Math.cos(angle);
            this.s = Math.sin(angle);
            return this;
        };
        Transform.prototype.setRotation = function (angle) {
            if(angle !== this.angle) {
                this.c = Math.cos(angle);
                this.s = Math.sin(angle);
                this.angle = angle;
            }
            return this;
        };
        Transform.prototype.setPosition = function (p) {
            this.t.copyFrom(p);
            return this;
        };
        Transform.prototype.identity = function () {
            this.t.setTo(0, 0);
            this.c = 1;
            this.s = 0;
            return this;
        };
        return Transform;
    })();
    Phaser.Transform = Transform;    
})(Phaser || (Phaser = {}));
