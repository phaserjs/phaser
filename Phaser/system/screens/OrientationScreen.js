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
        * Create a new <code>OrientationScreen</code> with specific width and height.
        *
        * @param width {number} Screen canvas width.
        * @param height {number} Screen canvas height.
        */
        function OrientationScreen(game) {
            this._showOnLandscape = false;
            this._showOnPortrait = false;
            this.game = game;
        }
        OrientationScreen.prototype.enable = function (onLandscape, onPortrait, imageKey) {
            this._showOnLandscape = onLandscape;
            this._showOnPortrait = onPortrait;
            this.landscapeImage = this.game.cache.getImage(imageKey);
            this.portraitImage = this.game.cache.getImage(imageKey);
        };

        /**
        * Update
        */
        OrientationScreen.prototype.update = function () {
        };

        /**
        * Render
        */
        OrientationScreen.prototype.render = function () {
            if (this._showOnLandscape) {
                this.game.stage.context.drawImage(this.landscapeImage, 0, 0, this.landscapeImage.width, this.landscapeImage.height, 0, 0, this.game.stage.width, this.game.stage.height);
            } else if (this._showOnPortrait) {
                this.game.stage.context.drawImage(this.portraitImage, 0, 0, this.portraitImage.width, this.portraitImage.height, 0, 0, this.game.stage.width, this.game.stage.height);
            }
        };
        return OrientationScreen;
    })();
    Phaser.OrientationScreen = OrientationScreen;
})(Phaser || (Phaser = {}));
