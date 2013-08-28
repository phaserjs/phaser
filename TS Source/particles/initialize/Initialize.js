var Phaser;
(function (Phaser) {
    (function (Particles) {
        /// <reference path="../../_definitions.ts" />
        (function (Initializers) {
            var Initialize = (function () {
                function Initialize() { }
                Initialize.prototype.initialize = function (target) {
                };
                Initialize.prototype.reset = function (a, b, c) {
                };
                Initialize.prototype.init = function (emitter, particle) {
                    if (typeof particle === "undefined") { particle = null; }
                    if(particle) {
                        this.initialize(particle);
                    } else {
                        this.initialize(emitter);
                    }
                };
                return Initialize;
            })();
            Initializers.Initialize = Initialize;            
        })(Particles.Initializers || (Particles.Initializers = {}));
        var Initializers = Particles.Initializers;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
