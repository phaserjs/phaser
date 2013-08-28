var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    (function (Particles) {
        var Polar2D = (function () {
            function Polar2D(r, tha) {
                this.r = Math.abs(r) || 0;
                this.tha = tha || 0;
            }
            Polar2D.prototype.set = function (r, tha) {
                this.r = r;
                this.tha = tha;
                return this;
            };
            Polar2D.prototype.setR = function (r) {
                this.r = r;
                return this;
            };
            Polar2D.prototype.setTha = function (tha) {
                this.tha = tha;
                return this;
            };
            Polar2D.prototype.copy = function (p) {
                this.r = p.r;
                this.tha = p.tha;
                return this;
            };
            Polar2D.prototype.toVector = function () {
                return new Phaser.Vec2(this.getX(), this.getY());
            };
            Polar2D.prototype.getX = function () {
                return this.r * Math.sin(this.tha);
            };
            Polar2D.prototype.getY = function () {
                return -this.r * Math.cos(this.tha);
            };
            Polar2D.prototype.normalize = function () {
                this.r = 1;
                return this;
            };
            Polar2D.prototype.equals = function (v) {
                return ((v.r === this.r) && (v.tha === this.tha));
            };
            Polar2D.prototype.toArray = function () {
                return [
                    this.r, 
                    this.tha
                ];
            };
            Polar2D.prototype.clear = function () {
                this.r = 0.0;
                this.tha = 0.0;
                return this;
            };
            Polar2D.prototype.clone = function () {
                return new Polar2D(this.r, this.tha);
            };
            return Polar2D;
        })();
        Particles.Polar2D = Polar2D;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
