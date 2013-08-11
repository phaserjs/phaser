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
            var Velocity = (function (_super) {
                __extends(Velocity, _super);
                function Velocity(rpan, thapan, type) {
                    _super.call(this);

                    this.rPan = Particles.ParticleUtils.setSpanValue(rpan);
                    this.thaPan = Particles.ParticleUtils.setSpanValue(thapan);
                    this.type = Particles.ParticleUtils.initValue(type, 'vector');
                }
                Velocity.prototype.reset = function (rpan, thapan, type) {
                    this.rPan = Particles.ParticleUtils.setSpanValue(rpan);
                    this.thaPan = Particles.ParticleUtils.setSpanValue(thapan);
                    this.type = Particles.ParticleUtils.initValue(type, 'vector');
                };

                Velocity.prototype.normalizeVelocity = function (vr) {
                    return vr * Particles.ParticleManager.MEASURE;
                };

                Velocity.prototype.initialize = function (target) {
                    if (this.type == 'p' || this.type == 'P' || this.type == 'polar') {
                        var polar2d = new Particles.Polar2D(this.normalizeVelocity(this.rPan.getValue()), this.thaPan.getValue() * Math.PI / 180);
                        target.v.x = polar2d.getX();
                        target.v.y = polar2d.getY();
                    } else {
                        target.v.x = this.normalizeVelocity(this.rPan.getValue());
                        target.v.y = this.normalizeVelocity(this.thaPan.getValue());
                    }
                };
                return Velocity;
            })(Initializers.Initialize);
            Initializers.Velocity = Velocity;
        })(Particles.Initializers || (Particles.Initializers = {}));
        var Initializers = Particles.Initializers;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
