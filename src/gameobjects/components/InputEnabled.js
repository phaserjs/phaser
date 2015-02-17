Phaser.Component.InputEnabled = function () {};

Phaser.Component.InputEnabled.prototype = {

    /**
    * @property {Phaser.InputHandler|null} input - The Input Handler for this object. Needs to be enabled with image.inputEnabled = true before you can use it.
    */
    input: null,

    /**
    * By default a Sprite won't process any input events at all. By setting inputEnabled to true the Phaser.InputHandler is
    * activated for this object and it will then start to process click/touch events and more.
    *
    * @name Phaser.Sprite#inputEnabled
    * @property {boolean} inputEnabled - Set to true to allow this object to receive input events.
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
