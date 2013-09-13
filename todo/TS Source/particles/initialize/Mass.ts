/// <reference path="../../_definitions.ts" />

module Phaser.Particles.Initializers {

    export class Mass extends Initialize {

        constructor(a,b,c) {
            super();
            this.massPan = ParticleUtils.setSpanValue(a, b, c);
        }

        massPan: Phaser.Particles.Span;

        initialize(target) {
            target.mass = this.massPan.getValue();
        }

    }

}

