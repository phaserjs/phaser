/// <reference path="../../_definitions.ts" />

module Phaser.Particles.Initializers {

    export class Radius extends Initialize {

        constructor(a,b,c) {

            super();

            this.radius = ParticleUtils.setSpanValue(a, b, c);

        }

        radius: Phaser.Particles.Span;

        reset(a, b, c) {

            this.radius = ParticleUtils.setSpanValue(a, b, c);

        }

        initialize(particle) {

            particle.radius = this.radius.getValue();
            particle.transform.oldRadius = particle.radius;

        }

    }

}

