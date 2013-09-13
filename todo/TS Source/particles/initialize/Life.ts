/// <reference path="../../_definitions.ts" />

module Phaser.Particles.Initializers {

    export class Life extends Initialize {

        constructor(a,b,c) {

            super();
            
            this.lifePan = ParticleUtils.setSpanValue(a, b, c);

        }

        lifePan: Phaser.Particles.Span;

        initialize(target) {

            if (this.lifePan.a == Infinity)
            {
                target.life = Infinity;
            }
            else
            {
                target.life = this.lifePan.getValue();
            }
        }

    }

}

