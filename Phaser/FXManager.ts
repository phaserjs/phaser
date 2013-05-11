/// <reference path="Game.ts" />

/**
* Phaser - FXManager
*
* The FXManager controls all special effects applied to game objects such as Cameras.
*/

module Phaser {

    export class FXManager {

        constructor(game: Game, parent) {

            this._game = game;
            this._parent = parent;
            this._fx = [];

            this.active = true;
            this.visible = true;

        }

        /**
         * The essential reference to the main game object.
         */
        private _game: Game;

        /**
         * A reference to the object that owns this FXManager instance.
         */
        private _parent;

        /**
         * The array in which we keep all of the registered FX
         */
        private _fx;

        /**
         * Holds the size of the _fx array
         */
        private _length: number;

        /**
         * Controls whether any of the FX have preUpdate, update or postUpdate called
         */
        public active: bool;

        /**
         * Controls whether any of the FX have preRender, render or postRender called
         */
        public visible: bool;

        /**
         * Adds a new FX to the FXManager.
         * The effect must be an object with at least one of the following methods: preUpdate, postUpdate, preRender, render or postRender.
         * A new instance of the effect will be created and a reference to Game will be passed to the object constructor.
         * @param {object} effect
         * @return {any}
         */
        public add(effect): any {

            var result: bool = false;
            var newEffect = { effect: {}, preUpdate: false, postUpdate: false, preRender: false, render: false, postRender: false };

            if (typeof effect === 'function')
            {
                newEffect.effect = new effect(this._game, this._parent);
            }
            else
            {
                throw new Error("Invalid object given to Phaser.FXManager.add");
            }

            //  Check for methods now to avoid having to do this every loop

            if (typeof newEffect.effect['preUpdate'] === 'function')
            {
                newEffect.preUpdate = true;
                result = true;
            }

            if (typeof newEffect.effect['postUpdate'] === 'function')
            {
                newEffect.postUpdate = true;
                result = true;
            }

            if (typeof newEffect.effect['preRender'] === 'function')
            {
                newEffect.preRender = true;
                result = true;
            }

            if (typeof newEffect.effect['render'] === 'function')
            {
                newEffect.render = true;
                result = true;
            }

            if (typeof newEffect.effect['postRender'] === 'function')
            {
                newEffect.postRender = true;
                result = true;
            }

            if (result == true)
            {
                this._length = this._fx.push(newEffect);

                return newEffect.effect;
            }
            else
            {
                return result;
            }

        }

        /**
         * Pre-update is called at the start of the objects update cycle, before any other updates have taken place.
         */
        public preUpdate() {

            if (this.active)
            {
                for (var i = 0; i < this._length; i++)
                {
                    if (this._fx[i].preUpdate)
                    {
                        this._fx[i].effect.preUpdate();
                    }
                }
            }

        }

        /**
         * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
         */
        public postUpdate() {

            if (this.active)
            {
                for (var i = 0; i < this._length; i++)
                {
                    if (this._fx[i].postUpdate)
                    {
                        this._fx[i].effect.postUpdate();
                    }
                }
            }

        }

        /**
         * Pre-render is called at the start of the object render cycle, before any transforms have taken place.
         * It happens directly AFTER a canvas context.save has happened if added to a Camera.
         * @param {Camera} camera
         * @param {number} cameraX
         * @param {number} cameraY
         * @param {number} cameraWidth
         * @param {number} cameraHeight
         */
        public preRender(camera:Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number) {

            if (this.visible)
            {
                for (var i = 0; i < this._length; i++)
                {
                    if (this._fx[i].preRender)
                    {
                        this._fx[i].effect.preRender(camera, cameraX, cameraY, cameraWidth, cameraHeight);
                    }
                }
            }

        }

        /**
         * render is called during the objects render cycle, right after all transforms have finished, but before any children/image data is rendered.
         * @param {Camera} camera
         * @param {number} cameraX
         * @param {number} cameraY
         * @param {number} cameraWidth
         * @param {number} cameraHeight
         */
        public render(camera:Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number) {

            if (this.visible)
            {
                for (var i = 0; i < this._length; i++)
                {
                    if (this._fx[i].preRender)
                    {
                        this._fx[i].effect.preRender(camera, cameraX, cameraY, cameraWidth, cameraHeight);
                    }
                }
            }

        }

        /**
         * Post-render is called during the objects render cycle, after the children/image data has been rendered.
         * It happens directly BEFORE a canvas context.restore has happened if added to a Camera.
         */
        public postRender(camera:Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number) {

            if (this.visible)
            {
                for (var i = 0; i < this._length; i++)
                {
                    if (this._fx[i].postRender)
                    {
                        this._fx[i].effect.postRender(camera, cameraX, cameraY, cameraWidth, cameraHeight);
                    }
                }
            }

        }

        /**
         * Clear down this FXManager and null out references
         */
        public destroy() {
            this._game = null;
            this._fx = null;
        }

    }

}
