var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /// <reference path="Particle.ts" />
    /// <reference path="../geom/Vector2.ts" />
    /**
    * Phaser - PinConstraint
    *
    * Constrains to static / fixed point
    */
    (function (Verlet) {
        var PinConstraint = (function () {
            /**
            * Creates a new PinConstraint object.
            * @class PinConstraint
            * @constructor
            * @param {Number} x The x coordinate of vector2
            * @param {Number} y The y coordinate of vector2
            * @return {PinConstraint} This object
            **/
            function PinConstraint(a, pos) {
                this.a = a;
                this.pos = (new Phaser.Vector2()).mutableSet(pos);
            }
            PinConstraint.prototype.relax = function () {
                this.a.pos.mutableSet(this.pos);
            };
            PinConstraint.prototype.render = function (ctx) {
                ctx.beginPath();
                ctx.arc(this.pos.x, this.pos.y, 6, 0, 2 * Math.PI);
                ctx.fillStyle = "rgba(0,153,255,0.1)";
                ctx.fill();
            };
            return PinConstraint;
        })();
        Verlet.PinConstraint = PinConstraint;        
    })(Phaser.Verlet || (Phaser.Verlet = {}));
    var Verlet = Phaser.Verlet;
})(Phaser || (Phaser = {}));
