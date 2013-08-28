var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Phaser;
(function (Phaser) {
    (function (Particles) {
        /// <reference path="../../_definitions.ts" />
        (function (Initializers) {
            var Mass = (function (_super) {
                __extends(Mass, _super);
                function Mass(a, b, c) {
                                _super.call(this);
                    this.massPan = Particles.ParticleUtils.setSpanValue(a, b, c);
                }
                Mass.prototype.initialize = function (target) {
                    target.mass = this.massPan.getValue();
                };
                return Mass;
            })(Initializers.Initialize);
            Initializers.Mass = Mass;            
        })(Particles.Initializers || (Particles.Initializers = {}));
        var Initializers = Particles.Initializers;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
