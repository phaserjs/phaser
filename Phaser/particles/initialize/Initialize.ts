/// <reference path="../../_definitions.ts" />

module Phaser.Particles.Initializers {

    export class Initialize {

        initialize(target) {
        }

        reset(a,b,c) { }

        init(emitter, particle= null) {

            if (particle)
            {
                this.initialize(particle);
            }
            else
            {
                this.initialize(emitter);
            }

        }

    }

}

