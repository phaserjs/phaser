/// <reference path="../_definitions.ts" />

/**
* Phaser - Physics - PhysicsManager
*/

module Phaser.Physics {

    export class PhysicsManager {

        constructor(game: Phaser.Game) {

            this.game = game;

        }

        public game: Phaser.Game;

        grav: number = 0.2;
        drag: number = 1;
        bounce: number = 0.3;
        friction: number = 0.05;

        min_f: number = 0;
        max_f: number = 1;

        min_b: number = 0;
        max_b: number = 1;

        min_g: number = 0;
        max_g = 1;

        xmin: number = 0;
        xmax: number = 800;
        ymin: number = 0;
        ymax: number = 600;

        objrad: number = 24;
        tilerad: number = 24 * 2;
        objspeed: number = 0.2;
        maxspeed: number = 20;

        public update() {

            //  Booyah!

        }

    }

}
