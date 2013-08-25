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
         * Create a new <code>OrientationScreen</code>.
         */
        constructor(game: Phaser.Game) {
            this.game = game;
        }

        private _enabled: bool = false;

        /**
         * Local reference to game.
         */
        public game: Phaser.Game;

        /**
         * The image to be displayed when the device is rotated to an unsupported orientation.
         * Set this to be the key of an image previously loaded into the Game.Cache.
         * @type {Cache Reference}
         */
        public image;

        /**
         * Enable the orientation screen. An image that is displayed whenever the device enters an unsupported orientation.
         * Set this to be the key of an image previously loaded into the Game.Cache.
         * @type {Cache Reference}
         */
        public enable(imageKey: string) {

            this._enabled = true;
            this.image = this.game.cache.getImage(imageKey);

        }

        /**
         * Update (can be overridden)
         */
        public update() {
        }

        /**
         * Render
         */
        public render() {

            if (this._enabled)
            {
                this.game.stage.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.game.stage.width, this.game.stage.height);
            }

        }

    }

}
