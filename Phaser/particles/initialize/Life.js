var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Phaser;
(function (Phaser) {
    (function (Particles) {
        /// <reference path="../../_definitions.ts" />
        (function (Initializers) {
            var Life = (function (_super) {
                __extends(Life, _super);
                function Life(a, b, c) {
                    _super.call(this);

                    this.lifePan = Particles.ParticleUtils.setSpanValue(a, b, c);
                }
                Life.prototype.initialize = function (target) {
                    if (this.lifePan.a == Infinity) {
                        target.life = Infinity;
                    } else {
                        target.life = this.lifePan.getValue();
                    }
                };
                return Life;
            })(Initializers.Initialize);
            Initializers.Life = Life;
        })(Particles.Initializers || (Particles.Initializers = {}));
        var Initializers = Particles.Initializers;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
