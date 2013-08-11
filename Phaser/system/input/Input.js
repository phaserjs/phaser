/// <reference path="../../Game.ts" />
/// <reference path="../../Signal.ts" />
/**
* Phaser - Input
*
* A game specific Input manager that looks after the mouse, keyboard and touch objects. This is updated by the core game loop.
*/
var Phaser;
(function (Phaser) {
    var Input = (function () {
        function Input(game) {
            this.x = 0;
            this.y = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.worldX = 0;
            this.worldY = 0;
            this._game = game;
            this.mouse = new Phaser.Mouse(this._game);
            this.keyboard = new Phaser.Keyboard(this._game);
            this.touch = new Phaser.Touch(this._game);
            this.onDown = new Phaser.Signal();
            this.onUp = new Phaser.Signal();
        }
        Input.prototype.update = function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            this.worldX = this._game.camera.worldView.x + this.x;
            this.worldY = this._game.camera.worldView.y + this.y;
            this.mouse.update();
            this.touch.update();
        };
        Input.prototype.reset = function () {
            this.mouse.reset();
            this.keyboard.reset();
            this.touch.reset();
        };
        Input.prototype.getWorldX = function (camera) {
            if (typeof camera === "undefined") { camera = this._game.camera; }
            return camera.worldView.x + this.x;
        };
        Input.prototype.getWorldY = function (camera) {
            if (typeof camera === "undefined") { camera = this._game.camera; }
            return camera.worldView.y + this.y;
        };
        Input.prototype.renderDebugInfo = function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            this._game.stage.context.font = '14px Courier';
            this._game.stage.context.fillStyle = color;
            this._game.stage.context.fillText('Input', x, y);
            this._game.stage.context.fillText('Screen X: ' + this.x + ' Screen Y: ' + this.y, x, y + 14);
            this._game.stage.context.fillText('World X: ' + this.worldX + ' World Y: ' + this.worldY, x, y + 28);
            this._game.stage.context.fillText('Scale X: ' + this.scaleX.toFixed(1) + ' Scale Y: ' + this.scaleY.toFixed(1), x, y + 42);
        };
        return Input;
    })();
    Phaser.Input = Input;    
})(Phaser || (Phaser = {}));
