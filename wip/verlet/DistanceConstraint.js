var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /// <reference path="Particle.ts" />
    /// <reference path="../geom/Vector2.ts" />
    /**
    * Phaser - DistanceConstraint
    *
    * Constrains to initial distance
    */
    (function (Verlet) {
        var DistanceConstraint = (function () {
            /**
            * Creates a new DistanceConstraint object.
            * @class DistanceConstraint
            * @constructor
            * @param {Number} x The x coordinate of vector2
            * @param {Number} y The y coordinate of vector2
            * @return {DistanceConstraint} This object
            **/
            function DistanceConstraint(a, b, stiffness, distance) {
                if (typeof distance === "undefined") { distance = null; }
                this.a = a;
                this.b = b;
                if(distance === null) {
                    this.distance = a.pos.sub(b.pos).length();
                } else {
                    this.distance = distance;
                }
                this.stiffness = stiffness;
            }
            DistanceConstraint.prototype.relax = function (stepCoef) {
                var normal = this.a.pos.sub(this.b.pos);
                var m = normal.length2();
                normal.mutableScale(((this.distance * this.distance - m) / m) * this.stiffness * stepCoef);
                this.a.pos.mutableAdd(normal);
                this.b.pos.mutableSub(normal);
            };
            DistanceConstraint.prototype.render = function (ctx) {
                ctx.beginPath();
                ctx.moveTo(this.a.pos.x, this.a.pos.y);
                ctx.lineTo(this.b.pos.x, this.b.pos.y);
                ctx.strokeStyle = "#d8dde2";
                ctx.stroke();
                ctx.closePath();
            };
            return DistanceConstraint;
        })();
        Verlet.DistanceConstraint = DistanceConstraint;        
    })(Phaser.Verlet || (Phaser.Verlet = {}));
    var Verlet = Phaser.Verlet;
})(Phaser || (Phaser = {}));
