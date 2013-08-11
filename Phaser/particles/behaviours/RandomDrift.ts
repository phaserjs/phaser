/// <reference path="../../_definitions.ts" />

module Phaser.Particles.Behaviours {

    export class RandomDrift extends Behaviour {

        constructor(driftX, driftY, delay, life, easing) {
            super(life, easing);
            this.reset(driftX, driftY, delay);
            this.time = 0;
            this.name = "RandomDrift";
        }

        panFoce;
        delay;
        time;

        reset(driftX, driftY, delay, life= null, easing= null) {

            this.panFoce = new Phaser.Vec2(driftX, driftY);
            this.panFoce = this.normalizeForce(this.panFoce);
            this.delay = delay;

            if (life)
            {
                this.life = ParticleUtils.initValue(life, Infinity);
                this.easing = ParticleUtils.initValue(easing, Phaser.Easing.Linear.None);
            }

        }

        applyBehaviour(particle, time, index) {
            
            super.applyBehaviour(particle, time, index);
            
            this.time += time;
            
            if (this.time >= this.delay)
            {
                particle.a.addXY(ParticleUtils.randomAToB(-this.panFoce.x, this.panFoce.x), ParticleUtils.randomAToB(-this.panFoce.y, this.panFoce.y));
                this.time = 0;
            }

        }

    }

}

