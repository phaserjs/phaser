/// <reference path="../../_definitions.ts" />
/**
* Phaser - OrientationScreen
*
* The Orientation Screen is displayed whenever the device is turned to an unsupported orientation.
*/
var Phaser;
(function (Phaser) {
    var OrientationScreen = (function () {
        /**
        * OrientationScreen constructor
        * Create a new <code>OrientationScreen</code>.
        */
        function OrientationScreen(game) {
            this._enabled = false;
            this.game = game;
        }
        OrientationScreen.prototype.enable = /**
        * Enable the orientation screen. An image that is displayed whenever the device enters an unsupported orientation.
        * Set this to be the key of an image previously loaded into the Game.Cache.
        * @type {Cache Reference}
        */
        function (imageKey) {
            this._enabled = true;
            this.image = this.game.cache.getImage(imageKey);
        };
        OrientationScreen.prototype.update = /**
        * Update (can be overridden)
        */
        function () {
        };
        OrientationScreen.prototype.render = /**
        * Render
        */
        function () {
            if(this._enabled) {
                this.game.stage.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.game.stage.width, this.game.stage.height);
            }
        };
        return OrientationScreen;
    })();
    Phaser.OrientationScreen = OrientationScreen;    
})(Phaser || (Phaser = {}));
