var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    (function (Particles) {
        var ParticlePool = (function () {
            function ParticlePool(num, releaseTime) {
                if (typeof releaseTime === "undefined") { releaseTime = 0; }
                this.poolList = [];
                this.timeoutID = 0;
                this.proParticleCount = Particles.ParticleUtils.initValue(num, 0);
                this.releaseTime = Particles.ParticleUtils.initValue(releaseTime, -1);
                this.poolList = [];
                this.timeoutID = 0;

                for (var i = 0; i < this.proParticleCount; i++) {
                    this.add();
                }

                if (this.releaseTime > 0) {
                    //  TODO - Hook to game clock so Pause works
                    this.timeoutID = setTimeout(this.release, this.releaseTime / 1000);
                }
            }
            ParticlePool.prototype.create = function (newTypeParticleClass) {
                if (typeof newTypeParticleClass === "undefined") { newTypeParticleClass = null; }
                if (newTypeParticleClass) {
                    return new newTypeParticleClass();
                } else {
                    return new Phaser.Particles.Particle();
                }
            };

            ParticlePool.prototype.getCount = function () {
                return this.poolList.length;
            };

            ParticlePool.prototype.add = function () {
                return this.poolList.push(this.create());
            };

            ParticlePool.prototype.get = function () {
                if (this.poolList.length === 0) {
                    return this.create();
                } else {
                    return this.poolList.pop().reset();
                }
            };

            ParticlePool.prototype.set = function (particle) {
                if (this.poolList.length < Particles.ParticleManager.POOL_MAX) {
                    return this.poolList.push(particle);
                }
            };

            ParticlePool.prototype.release = function () {
                for (var i = 0; i < this.poolList.length; i++) {
                    if (this.poolList[i]['destroy']) {
                        this.poolList[i].destroy();
                    }

                    delete this.poolList[i];
                }

                this.poolList = [];
            };
            return ParticlePool;
        })();
        Particles.ParticlePool = ParticlePool;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
