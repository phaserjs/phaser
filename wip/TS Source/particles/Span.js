var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    (function (Particles) {
        var Span = (function () {
            function Span(a, b, center) {
                if (typeof b === "undefined") { b = null; }
                if (typeof center === "undefined") { center = null; }
                this.isArray = false;
                if(Particles.ParticleUtils.isArray(a)) {
                    this.isArray = true;
                    this.a = a;
                } else {
                    this.a = Particles.ParticleUtils.initValue(a, 1);
                    this.b = Particles.ParticleUtils.initValue(b, this.a);
                    this.center = Particles.ParticleUtils.initValue(center, false);
                }
            }
            Span.prototype.getValue = function (INT) {
                if (typeof INT === "undefined") { INT = null; }
                if(this.isArray) {
                    return this.a[Math.floor(this.a.length * Math.random())];
                } else {
                    if(!this.center) {
                        return Particles.ParticleUtils.randomAToB(this.a, this.b, INT);
                    } else {
                        return Particles.ParticleUtils.randomFloating(this.a, this.b, INT);
                    }
                }
            };
            Span.getSpan = function getSpan(a, b, center) {
                return new Span(a, b, center);
            };
            return Span;
        })();
        Particles.Span = Span;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
