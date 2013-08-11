/// <reference path="../../_definitions.ts" />

module Phaser.Particles.Zones {

    export class PointZone extends Zone {

        constructor(x=0,y=0) {
            super();
            this.x = x;
            this.y = y;
        }

        x;
        y;

        getPosition() {
            return this.vector.setTo(this.x, this.y);
        }

        crossing(particle) {

            if (this.alert)
            {
                alert('Sorry PointZone does not support crossing method');
                this.alert = false;
            }

        }

    }
}
