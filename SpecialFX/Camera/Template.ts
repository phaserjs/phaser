/// <reference path="../../Phaser/Game.d.ts" />
/// <reference path="../../Phaser/system/Camera.d.ts" />
/// <reference path="../../Phaser/FXManager.d.ts" />

/**
* Phaser - FX - Camera - Template
*
* A Template FX file you can use to create your own Camera FX.
* If you don't use any of the methods below (i.e. preUpdate, render, etc) then DELETE THEM to avoid un-necessary calls by the FXManager.
*/

module Phaser.FX.Camera {

    export class Template {

        constructor(game: Game, parent: Camera) {

            this._game = game;
            this._parent = parent;

        }

        private _game: Game;
        private _parent: Camera;

        /**
        * You can name the function that starts the effect whatever you like, but we used 'start' in our effects.
        */
        public start() {
        }

        /**
         * Pre-update is called at the start of the objects update cycle, before any other updates have taken place.
         */
        public preUpdate() {
        }

        /**
         * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
         */
        public postUpdate() {
        }

        /**
         * Pre-render is called at the start of the object render cycle, before any transforms have taken place.
         * It happens directly AFTER a canvas context.save has happened if added to a Camera.
         */
        public preRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number) {
        }

        /**
         * render is called during the objects render cycle, right after all transforms have finished, but before any children/image data is rendered.
         */
        public render(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number) {
        }

        /**
         * Post-render is called during the objects render cycle, after the children/image data has been rendered.
         * It happens directly BEFORE a canvas context.restore has happened if added to a Camera.
         */
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number) {
        }

    }

}
