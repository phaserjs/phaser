/// <reference path="../../_definitions.ts" />

module Phaser.Particles.Initializers {

    export class Rate extends Initialize {

        constructor(numpan, timepan) {
            super();

            numpan = ParticleUtils.initValue(numpan, 1);
            timepan = ParticleUtils.initValue(timepan, 1);
            this.numPan = new Phaser.Particles.Span(numpan);
            this.timePan = new Phaser.Particles.Span(timepan);
            this.startTime = 0;
            this.nextTime = 0;
            this.init();
        }

        numPan: Phaser.Particles.Span;
        timePan: Phaser.Particles.Span;
        startTime;
        nextTime;

        init() {
            this.startTime = 0;
            this.nextTime = this.timePan.getValue();
        }

        getValue (time) {

            this.startTime += time;

            if (this.startTime >= this.nextTime)
            {
                this.startTime = 0;
                this.nextTime = this.timePan.getValue();

                if (this.numPan.b == 1)
                {
                    if (this.numPan.getValue(false) > 0.5)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                }
                else
                {
                    return this.numPan.getValue(true);
                }
            }

            return 0;
        }

    }

}
