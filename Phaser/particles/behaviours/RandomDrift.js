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
        (function (Behaviours) {
            var RandomDrift = (function (_super) {
                __extends(RandomDrift, _super);
                function RandomDrift(driftX, driftY, delay, life, easing) {
                    _super.call(this, life, easing);
                    this.reset(driftX, driftY, delay);
                    this.time = 0;
                    this.name = "RandomDrift";
                }
                RandomDrift.prototype.reset = function (driftX, driftY, delay, life, easing) {
                    if (typeof life === "undefined") { life = null; }
                    if (typeof easing === "undefined") { easing = null; }
                    this.panFoce = new Phaser.Vec2(driftX, driftY);
                    this.panFoce = this.normalizeForce(this.panFoce);
                    this.delay = delay;

                    if (life) {
                        this.life = Particles.ParticleUtils.initValue(life, Infinity);
                        this.easing = Particles.ParticleUtils.initValue(easing, Phaser.Easing.Linear.None);
                    }
                };

                RandomDrift.prototype.applyBehaviour = function (particle, time, index) {
                    _super.prototype.applyBehaviour.call(this, particle, time, index);

                    this.time += time;

                    if (this.time >= this.delay) {
                        particle.a.addXY(Particles.ParticleUtils.randomAToB(-this.panFoce.x, this.panFoce.x), Particles.ParticleUtils.randomAToB(-this.panFoce.y, this.panFoce.y));
                        this.time = 0;
                    }
                };
                return RandomDrift;
            })(Behaviours.Behaviour);
            Behaviours.RandomDrift = RandomDrift;
        })(Particles.Behaviours || (Particles.Behaviours = {}));
        var Behaviours = Particles.Behaviours;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
