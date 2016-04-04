/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The InputEnabled component allows a Game Object to have its own InputHandler and process input related events.
*
* @class
*/
Phaser.Component.InputEnabled = function () {};

Phaser.Component.InputEnabled.prototype = {

    /**
    * The Input Handler for this Game Object.
    * 
    * By default it is disabled. If you wish this Game Object to process input events you should enable it with: `inputEnabled = true`.
    * 
    * After you have done this, this property will be a reference to the Phaser InputHandler.
    * @property {Phaser.InputHandler|null} input 
    */
    input: null,

    /**
    * By default a Game Object won't process any input events. By setting `inputEnabled` to true a Phaser.InputHandler is created
    * for this Game Object and it will then start to process click / touch events and more.
    * 
    * You can then access the Input Handler via `this.input`.
    * 
    * Note that Input related events are dispatched from `this.events`, i.e.: `events.onInputDown`.
    * 
    * If you set this property to false it will stop the Input Handler from processing any more input events.
    *
    * @property {boolean} inputEnabled
    */
    inputEnabled: {

        get: function () {

            return (this.input && this.input.enabled);

        },

        set: function (value) {

            if (value)
            {
                if (this.input === null)
                {
                    this.input = new Phaser.InputHandler(this);
                    this.input.start();
                }
                else if (this.input && !this.input.enabled)
                {
                    this.input.start();
                }
            }
            else
            {
                if (this.input && this.input.enabled)
                {
                    this.input.stop();
                }
            }

        }

    }

};
