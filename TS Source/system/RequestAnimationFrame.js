/// <reference path="../_definitions.ts" />
/**
* Phaser - RequestAnimationFrame
*
* Abstracts away the use of RAF or setTimeOut for the core game update loop. The callback can be re-mapped on the fly.
*/
var Phaser;
(function (Phaser) {
    var RequestAnimationFrame = (function () {
        /**
        * Constructor
        * @param {Any} callback
        * @return {RequestAnimationFrame} This object.
        */
        function RequestAnimationFrame(game, callback) {
            /**
            *
            * @property _isSetTimeOut
            * @type bool
            * @private
            **/
            this._isSetTimeOut = false;
            /**
            *
            * @property isRunning
            * @type bool
            **/
            this.isRunning = false;
            this.game = game;
            this.callback = callback;
            var vendors = [
                'ms', 
                'moz', 
                'webkit', 
                'o'
            ];
            for(var x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
            }
            this.start();
        }
        RequestAnimationFrame.prototype.isUsingSetTimeOut = /**
        *
        * @method usingSetTimeOut
        * @return bool
        **/
        function () {
            return this._isSetTimeOut;
        };
        RequestAnimationFrame.prototype.isUsingRAF = /**
        *
        * @method usingRAF
        * @return bool
        **/
        function () {
            return this._isSetTimeOut === true;
        };
        RequestAnimationFrame.prototype.start = /**
        * Starts the requestAnimatioFrame running or setTimeout if unavailable in browser
        * @method start
        * @param {Any} [callback]
        **/
        function (callback) {
            if (typeof callback === "undefined") { callback = null; }
            var _this = this;
            if(callback) {
                this.callback = callback;
            }
            if(!window.requestAnimationFrame) {
                this._isSetTimeOut = true;
                this._onLoop = function () {
                    return _this.SetTimeoutUpdate();
                };
                this._timeOutID = window.setTimeout(this._onLoop, 0);
            } else {
                this._isSetTimeOut = false;
                this._onLoop = function () {
                    return _this.RAFUpdate(0);
                };
                window.requestAnimationFrame(this._onLoop);
            }
            this.isRunning = true;
        };
        RequestAnimationFrame.prototype.stop = /**
        * Stops the requestAnimationFrame from running
        * @method stop
        **/
        function () {
            if(this._isSetTimeOut) {
                clearTimeout(this._timeOutID);
            } else {
                window.cancelAnimationFrame;
            }
            this.isRunning = false;
        };
        RequestAnimationFrame.prototype.RAFUpdate = /**
        * The update method for the requestAnimationFrame
        * @method RAFUpdate
        **/
        function (time) {
            var _this = this;
            this.game.time.update(time);
            if(this.callback) {
                this.callback.call(this.game);
            }
            this._onLoop = function (time) {
                return _this.RAFUpdate(time);
            };
            window.requestAnimationFrame(this._onLoop);
        };
        RequestAnimationFrame.prototype.SetTimeoutUpdate = /**
        * The update method for the setTimeout
        * @method SetTimeoutUpdate
        **/
        function () {
            var _this = this;
            this.game.time.update(Date.now());
            this._onLoop = function () {
                return _this.SetTimeoutUpdate();
            };
            this._timeOutID = window.setTimeout(this._onLoop, 16);
            if(this.callback) {
                this.callback.call(this.game);
            }
        };
        return RequestAnimationFrame;
    })();
    Phaser.RequestAnimationFrame = RequestAnimationFrame;    
})(Phaser || (Phaser = {}));
