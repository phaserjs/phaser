var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /// <reference path="../geom/Vector2.ts" />
    /**
    * Phaser - Verlet - Particle
    *
    *
    */
    (function (Verlet) {
        var Particle = (function () {
            /**
            * Creates a new Particle object.
            * @class Particle
            * @constructor
            * @param {Number} x The x coordinate of vector2
            * @param {Number} y The y coordinate of vector2
            * @return {Particle} This object
            **/
            function Particle(pos) {
                this.pos = (new Vector2()).mutableSet(pos);
                this.lastPos = (new Vector2()).mutableSet(pos);
            }
            Particle.prototype.render = function (ctx) {
                ctx.beginPath();
                ctx.arc(this.pos.x, this.pos.y, 2, 0, 2 * Math.PI);
                ctx.fillStyle = "#2dad8f";
                ctx.fill();
            };
            return Particle;
        })();
        Verlet.Particle = Particle;        
    })(Phaser.Verlet || (Phaser.Verlet = {}));
    var Verlet = Phaser.Verlet;
})(Phaser || (Phaser = {}));
//@ sourceMappingURL=Particle.js.map
