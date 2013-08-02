/// <reference path="../Phaser/Game.ts" />
/// <reference path="IPlugin.ts" />

/**
* Phaser - Example Plugin
*/

module Phaser.Plugins {

    export class Example implements Phaser.IPlugin {

        constructor(game: Phaser.Game) {

            this.game = game;
            this.active = true;
            this.visible = true;

        }

        /**
         * The essential reference to the main game object.
         */
        public game: Game;

        /**
         * Controls whether preUpdate or postUpdate are called
         */
        public active: bool;

        /**
         * Controls whether preRender or postRender are called
         */
        public visible: bool;

        /**
         * Pre-update is called at the start of the update cycle, before any other updates have taken place.
         * It is only called if active is set to true.
         */
        public preUpdate() {
        }

        /**
         * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
         * It is only called if active is set to true.
         */
        public postUpdate() {
        }

        /**
         * Pre-render is called right before the Game Renderer starts and before any custom preRender callbacks have been run.
         * It is only called if visible is set to true.
         */
        public preRender() {
        }

        /**
         * Post-render is called after every camera and game object has been rendered, also after any custom postRender callbacks have been run.
         * It is only called if visible is set to true.
         */
        public postRender() {
        }

        /**
         * Clear down this Plugin and null out references
         */
        public destroy() {
            this.game = null;
        }

    }

}
