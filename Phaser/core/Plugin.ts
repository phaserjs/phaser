/// <reference path="../Game.ts" />

/**
* Phaser - Plugin
*/

module Phaser {

    export class Plugin {

        constructor(game: Phaser.Game, parent) {

            this.game = game;
            this.parent = parent;

            this.active = false;
            this.visible = false;

            this.hasPreUpdate = false;
            this.hasUpdate = false;
            this.hasPostUpdate = false;

            this.hasPreRender = false;
            this.hasRender = false;
            this.hasPostRender = false;

        }

        /**
         * Local reference to Game.
         */
        public game: Game;

        /**
         * The object that owns this Plugin (i.e. Camera, Game, Stage, etc).
         */
        public parent;

        /**
         * Controls whether preUpdate, update or postUpdate are called
         */
        public active: bool;

        /**
         * Controls whether preRender, render or postRender are called
         */
        public visible: bool;

        /**
         * Quick access booleans to avoid having to do a function existence check during tight inner loops
         */
        public hasPreUpdate: bool;
        public hasUpdate: bool;
        public hasPostUpdate: bool;

        public hasPreRender: bool;
        public hasRender: bool;
        public hasPostRender: bool;

        /**
         * Pre-update is called at the start of the update cycle, before any other updates have taken place.
         * It is only called if active is set to true.
         */
        public preUpdate() {
        }

        /**
         * Pre-update is called at the start of the update cycle, before any other updates have taken place.
         * It is only called if active is set to true.
         */
        public update() {
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
         * Pre-render is called right before the Game Renderer starts and before any custom preRender callbacks have been run.
         * It is only called if visible is set to true.
         */
        public render() {
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
            this.parent = null;

            this.active = false;
            this.visible = false;

        }

    }

}
