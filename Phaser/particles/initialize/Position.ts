/// <reference path="../../_definitions.ts" />

module Phaser.Particles.Initializers {

    export class Position extends Initialize {

        constructor(zone) {
            
            super();

            if (zone != null && zone != undefined)
            {
                this.zone = zone;
            }
            else
            {
                this.zone = new Phaser.Particles.Zones.PointZone();
            }

        }

        zone;

        reset(zone) {
            if (zone != null && zone != undefined)
            {
                this.zone = zone;
            }
            else
            {
                this.zone = new Phaser.Particles.Zones.PointZone();
            }
        }

        initialize(target) {

            this.zone.getPosition();

            target.p.x = this.zone.vector.x;
            target.p.y = this.zone.vector.y;
        }

    }

}
