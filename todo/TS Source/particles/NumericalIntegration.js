var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    (function (Particles) {
        var NumericalIntegration = (function () {
            function NumericalIntegration(type) {
                this.type = Particles.ParticleUtils.initValue(type, Particles.ParticleManager.EULER);
            }
            NumericalIntegration.prototype.integrate = function (particles, time, damping) {
                this.eulerIntegrate(particles, time, damping);
            };
            NumericalIntegration.prototype.eulerIntegrate = function (particle, time, damping) {
                if(!particle.sleep) {
                    particle.old.p.copy(particle.p);
                    particle.old.v.copy(particle.v);
                    particle.a.multiplyScalar(1 / particle.mass);
                    particle.v.add(particle.a.multiplyScalar(time));
                    particle.p.add(particle.old.v.multiplyScalar(time));
                    if(damping) {
                        particle.v.multiplyScalar(damping);
                    }
                    particle.a.clear();
                }
            };
            return NumericalIntegration;
        })();
        Particles.NumericalIntegration = NumericalIntegration;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
