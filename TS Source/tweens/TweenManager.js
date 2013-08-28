/// <reference path="../_definitions.ts" />
/**
* Phaser - TweenManager
*
* The Game has a single instance of the TweenManager through which all Tween objects are created and updated.
* Tweens are hooked into the game clock and pause system, adjusting based on the game state.
* TweenManager is based heavily on tween.js by sole (http://soledadpenades.com).
* I converted it to TypeScript, swapped the callbacks for signals and patched a few issues with regard
* to properties and completion errors. Please see https://github.com/sole/tween.js for a full list of contributors.
*/
var Phaser;
(function (Phaser) {
    var TweenManager = (function () {
        /**
        * TweenManager constructor
        * @param game {Game} A reference to the current Game.
        */
        function TweenManager(game) {
            this.game = game;
            this._tweens = [];
            this.game.onPause.add(this.pauseAll, this);
            this.game.onResume.add(this.resumeAll, this);
        }
        TweenManager.prototype.getAll = /**
        * Get all the tween objects in an array.
        * @return {Phaser.Tween[]} Array with all tween objects.
        */
        function () {
            return this._tweens;
        };
        TweenManager.prototype.removeAll = /**
        * Remove all tween objects.
        */
        function () {
            this._tweens.length = 0;
        };
        TweenManager.prototype.create = /**
        * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
        *
        * @param obj {object} Object the tween will be run on.
        * @param [localReference] {bool} If true the tween will be stored in the object.tween property so long as it exists. If already set it'll be over-written.
        * @return {Phaser.Tween} The newly created tween object.
        */
        function (object, localReference) {
            if (typeof localReference === "undefined") { localReference = false; }
            if(localReference) {
                object['tween'] = new Phaser.Tween(object, this.game);
                return object['tween'];
            } else {
                return new Phaser.Tween(object, this.game);
            }
        };
        TweenManager.prototype.add = /**
        * Add a new tween into the TweenManager.
        *
        * @param tween {Phaser.Tween} The tween object you want to add.
        * @return {Phaser.Tween} The tween object you added to the manager.
        */
        function (tween) {
            tween.parent = this.game;
            this._tweens.push(tween);
            return tween;
        };
        TweenManager.prototype.remove = /**
        * Remove a tween from this manager.
        *
        * @param tween {Phaser.Tween} The tween object you want to remove.
        */
        function (tween) {
            var i = this._tweens.indexOf(tween);
            if(i !== -1) {
                this._tweens.splice(i, 1);
            }
        };
        TweenManager.prototype.update = /**
        * Update all the tween objects you added to this manager.
        *
        * @return {bool} Return false if there's no tween to update, otherwise return true.
        */
        function () {
            if(this._tweens.length === 0) {
                return false;
            }
            var i = 0;
            var numTweens = this._tweens.length;
            while(i < numTweens) {
                if(this._tweens[i].update(this.game.time.now)) {
                    i++;
                } else {
                    this._tweens.splice(i, 1);
                    numTweens--;
                }
            }
            return true;
        };
        TweenManager.prototype.pauseAll = function () {
            if(this._tweens.length === 0) {
                return false;
            }
            var i = 0;
            var numTweens = this._tweens.length;
            while(i < numTweens) {
                this._tweens[i].pause();
                i++;
            }
        };
        TweenManager.prototype.resumeAll = function () {
            if(this._tweens.length === 0) {
                return false;
            }
            var i = 0;
            var numTweens = this._tweens.length;
            while(i < numTweens) {
                this._tweens[i].resume();
                i++;
            }
        };
        return TweenManager;
    })();
    Phaser.TweenManager = TweenManager;    
})(Phaser || (Phaser = {}));
