/// <reference path="../Game.ts" />

/**
* Phaser - Physics Manager
*
* Eventually this will handle switching between the default ArcadePhysics manager or the new AdvancedPhysics manager.
* For now we direct everything through ArcadePhysics.
*/

module Phaser.Physics {

    export class Manager {

        constructor(game: Game) {

            this.game = game;

            this.arcade = new Phaser.Physics.ArcadePhysics(this.game, this.game.stage.width, this.game.stage.height);

            this.gravity = this.arcade.gravity;
            this.bounds = this.arcade.bounds;

        }

        /**
         * Local reference to Game.
         */
        public game: Game;

        /**
         * Instance of the ArcadePhysics manager.
         */
        public arcade: Phaser.Physics.ArcadePhysics;

        public gravity: Vec2;
        public bounds: Rectangle;

        /**
         * Called by the main Game.loop
         */
        public update() {

            //this.arcade.updateMotion

        }

    }

}