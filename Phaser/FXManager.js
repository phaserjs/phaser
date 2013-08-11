/// <reference path="Game.ts" />
/**
* Phaser - FXManager
*
* The FXManager controls all special effects applied to game objects such as Cameras.
*/
var Phaser;
(function (Phaser) {
    var FXManager = (function () {
        function FXManager(game, parent) {
            this._game = game;
            this._parent = parent;
            this._fx = [];
            this.active = true;
            this.visible = true;
        }
        FXManager.prototype.add = /**
        * Adds a new FX to the FXManager.
        * The effect must be an object with at least one of the following methods: preUpdate, postUpdate, preRender, render or postRender.
        * A new instance of the effect will be created and a reference to Game will be passed to the object constructor.
        * @param {object} effect
        * @return {any}
        */
        function (effect) {
            var result = false;
            var newEffect = {
                effect: {
                },
                preUpdate: false,
                postUpdate: false,
                preRender: false,
                render: false,
                postRender: false
            };
            if(typeof effect === 'function') {
                newEffect.effect = new effect(this._game, this._parent);
            } else {
                throw new Error("Invalid object given to Phaser.FXManager.add");
            }
            //  Check for methods now to avoid having to do this every loop
            if(typeof newEffect.effect['preUpdate'] === 'function') {
                newEffect.preUpdate = true;
                result = true;
            }
            if(typeof newEffect.effect['postUpdate'] === 'function') {
                newEffect.postUpdate = true;
                result = true;
            }
            if(typeof newEffect.effect['preRender'] === 'function') {
                newEffect.preRender = true;
                result = true;
            }
            if(typeof newEffect.effect['render'] === 'function') {
                newEffect.render = true;
                result = true;
            }
            if(typeof newEffect.effect['postRender'] === 'function') {
                newEffect.postRender = true;
                result = true;
            }
            if(result == true) {
                this._length = this._fx.push(newEffect);
                return newEffect.effect;
            } else {
                return result;
            }
        };
        FXManager.prototype.preUpdate = /**
        * Pre-update is called at the start of the objects update cycle, before any other updates have taken place.
        */
        function () {
            if(this.active) {
                for(var i = 0; i < this._length; i++) {
                    if(this._fx[i].preUpdate) {
                        this._fx[i].effect.preUpdate();
                    }
                }
            }
        };
        FXManager.prototype.postUpdate = /**
        * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
        */
        function () {
            if(this.active) {
                for(var i = 0; i < this._length; i++) {
                    if(this._fx[i].postUpdate) {
                        this._fx[i].effect.postUpdate();
                    }
                }
            }
        };
        FXManager.prototype.preRender = /**
        * Pre-render is called at the start of the object render cycle, before any transforms have taken place.
        * It happens directly AFTER a canvas context.save has happened if added to a Camera.
        * @param {Camera} camera
        * @param {number} cameraX
        * @param {number} cameraY
        * @param {number} cameraWidth
        * @param {number} cameraHeight
        */
        function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
            if(this.visible) {
                for(var i = 0; i < this._length; i++) {
                    if(this._fx[i].preRender) {
                        this._fx[i].effect.preRender(camera, cameraX, cameraY, cameraWidth, cameraHeight);
                    }
                }
            }
        };
        FXManager.prototype.render = /**
        * render is called during the objects render cycle, right after all transforms have finished, but before any children/image data is rendered.
        * @param {Camera} camera
        * @param {number} cameraX
        * @param {number} cameraY
        * @param {number} cameraWidth
        * @param {number} cameraHeight
        */
        function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
            if(this.visible) {
                for(var i = 0; i < this._length; i++) {
                    if(this._fx[i].preRender) {
                        this._fx[i].effect.preRender(camera, cameraX, cameraY, cameraWidth, cameraHeight);
                    }
                }
            }
        };
        FXManager.prototype.postRender = /**
        * Post-render is called during the objects render cycle, after the children/image data has been rendered.
        * It happens directly BEFORE a canvas context.restore has happened if added to a Camera.
        */
        function (camera, cameraX, cameraY, cameraWidth, cameraHeight) {
            if(this.visible) {
                for(var i = 0; i < this._length; i++) {
                    if(this._fx[i].postRender) {
                        this._fx[i].effect.postRender(camera, cameraX, cameraY, cameraWidth, cameraHeight);
                    }
                }
            }
        };
        FXManager.prototype.destroy = /**
        * Clear down this FXManager and null out references
        */
        function () {
            this._game = null;
            this._fx = null;
        };
        return FXManager;
    })();
    Phaser.FXManager = FXManager;    
})(Phaser || (Phaser = {}));
