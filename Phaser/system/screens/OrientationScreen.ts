/// <reference path="../../_definitions.ts" />

/**
* Phaser - OrientationScreen
*
* The Orientation Screen is displayed whenever the device is turned to an unsupported orientation.
*/

module Phaser {

    export class OrientationScreen {

        /**
         * OrientationScreen constructor
         * Create a new <code>OrientationScreen</code> with specific width and height.
         *
         * @param width {number} Screen canvas width.
         * @param height {number} Screen canvas height.
         */
        constructor(game: Phaser.Game) {
            this.game = game;
        }

        /**
         * Local reference to game.
         */
        public game: Phaser.Game;

        private _showOnLandscape: bool = false;
        private _showOnPortrait: bool = false;

        /**
         * Landscape Image. If you only want your game to work in Portrait mode, and display an image when in Landscape, 
         * then set this to be the key of an image previously loaded into the Game.Cache.
         * @type {Cache Reference}
         */
        public landscapeImage;

        /**
         * Portrait Image. If you only want your game to work in Landscape mode, and display an image when in Portrait, 
         * then set this to be the key of an image previously loaded into the Game.Cache.
         * @type {Cache Reference}
         */
        public portraitImage;

        public enable(onLandscape: bool, onPortrait: bool, imageKey: string) {

            this._showOnLandscape = onLandscape;
            this._showOnPortrait = onPortrait;
            this.landscapeImage = this.game.cache.getImage(imageKey);
            this.portraitImage = this.game.cache.getImage(imageKey);

        }

        /**
         * Update
         */
        public update() {
        }

        /**
         * Render
         */
        public render() {

            if (this._showOnLandscape)
            {
                this.game.stage.context.drawImage(this.landscapeImage, 0, 0, this.landscapeImage.width, this.landscapeImage.height, 0, 0, this.game.stage.width, this.game.stage.height);
            }
            else if (this._showOnPortrait)
            {
                this.game.stage.context.drawImage(this.portraitImage, 0, 0, this.portraitImage.width, this.portraitImage.height, 0, 0, this.game.stage.width, this.game.stage.height);
            }

        }

    }

}
