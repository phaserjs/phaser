/// <reference path="../_definitions.ts" />

module Phaser.Particles {

    export class ParticlePool {

        constructor(num, releaseTime = 0) {

            this.proParticleCount = ParticleUtils.initValue(num, 0);
            this.releaseTime = ParticleUtils.initValue(releaseTime, -1);
            this.poolList = [];
            this.timeoutID = 0;

            for (var i = 0; i < this.proParticleCount; i++)
            {
                this.add();
            }

            if (this.releaseTime > 0)
            {
                //  TODO - Hook to game clock so Pause works
                this.timeoutID = setTimeout(this.release, this.releaseTime / 1000);
            }

        }

        proParticleCount: number;
        releaseTime: number;
        poolList = [];
        timeoutID: number = 0;

        create(newTypeParticleClass = null) {

            if (newTypeParticleClass)
            {
                return new newTypeParticleClass;
            }
            else
            {
                return new Phaser.Particles.Particle();
            }

        }

        getCount() {
            return this.poolList.length;
        }

        add() {
            return this.poolList.push(this.create());
        }

        get() {

            if (this.poolList.length === 0)
            {
                return this.create();
            }
            else
            {
                return this.poolList.pop().reset();
            }

        }

        set(particle) {

            if (this.poolList.length < ParticleManager.POOL_MAX)
            {
                return this.poolList.push(particle);
            }

        }

        release() {

            for (var i = 0; i < this.poolList.length; i++)
            {
                if (this.poolList[i]['destroy'])
                {
                    this.poolList[i].destroy();
                }

                delete this.poolList[i];
            }

            this.poolList = [];
        }

    }

}
