/// <reference path="../../_definitions.ts" />

module Phaser.Particles.Zones {

    export class Zone {

        constructor() {
            this.vector = new Phaser.Vec2;
            this.random = 0;
            this.crossType = "dead";
            this.alert = true;
        }

        vector: Phaser.Vec2;
        random: number;
        crossType: string;
        alert: bool;

    }
}
