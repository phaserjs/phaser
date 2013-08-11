/// <reference path="../../Game.ts" />
/**
* Phaser - Mouse
*
* The Mouse class handles mouse interactions with the game and the resulting events.
*/
var Phaser;
(function (Phaser) {
    var Mouse = (function () {
        function Mouse(game) {
            this._x = 0;
            this._y = 0;
            this.isDown = false;
            this.isUp = true;
            this.timeDown = 0;
            this.duration = 0;
            this.timeUp = 0;
            this._game = game;
            this.start();
        }
        Mouse.LEFT_BUTTON = 0;
        Mouse.MIDDLE_BUTTON = 1;
        Mouse.RIGHT_BUTTON = 2;
        Mouse.prototype.start = function () {
            var _this = this;
            this._game.stage.canvas.addEventListener('mousedown', function (event) {
                return _this.onMouseDown(event);
            }, true);
            this._game.stage.canvas.addEventListener('mousemove', function (event) {
                return _this.onMouseMove(event);
            }, true);
            this._game.stage.canvas.addEventListener('mouseup', function (event) {
                return _this.onMouseUp(event);
            }, true);
        };
        Mouse.prototype.reset = function () {
            this.isDown = false;
            this.isUp = true;
        };
        Mouse.prototype.onMouseDown = function (event) {
            this.button = event.button;
            this._x = event.clientX - this._game.stage.x;
            this._y = event.clientY - this._game.stage.y;
            this._game.input.x = this._x * this._game.input.scaleX;
            this._game.input.y = this._y * this._game.input.scaleY;
            this.isDown = true;
            this.isUp = false;
            this.timeDown = this._game.time.now;
            this._game.input.onDown.dispatch(this._game.input.x, this._game.input.y, this.timeDown);
        };
        Mouse.prototype.update = function () {
            //this._game.input.x = this._x * this._game.input.scaleX;
            //this._game.input.y = this._y * this._game.input.scaleY;
            if(this.isDown) {
                this.duration = this._game.time.now - this.timeDown;
            }
        };
        Mouse.prototype.onMouseMove = function (event) {
            this.button = event.button;
            this._x = event.clientX - this._game.stage.x;
            this._y = event.clientY - this._game.stage.y;
            this._game.input.x = this._x * this._game.input.scaleX;
            this._game.input.y = this._y * this._game.input.scaleY;
        };
        Mouse.prototype.onMouseUp = function (event) {
            this.button = event.button;
            this.isDown = false;
            this.isUp = true;
            this.timeUp = this._game.time.now;
            this.duration = this.timeUp - this.timeDown;
            this._x = event.clientX - this._game.stage.x;
            this._y = event.clientY - this._game.stage.y;
            this._game.input.x = this._x * this._game.input.scaleX;
            this._game.input.y = this._y * this._game.input.scaleY;
            this._game.input.onUp.dispatch(this._game.input.x, this._game.input.y, this.timeDown);
        };
        return Mouse;
    })();
    Phaser.Mouse = Mouse;    
})(Phaser || (Phaser = {}));
