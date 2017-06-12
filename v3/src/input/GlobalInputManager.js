//  GlobalInputManager

var Keyboard = require('./keyboard/KeyboardManager');

var GlobalInputManager = function (game, gameConfig)
{
    this.game = game;

    this.gameConfig = gameConfig;

    this.keyboard = new Keyboard(this);
    this.mouse = new Mouse(this);
};

GlobalInputManager.prototype.constructor = GlobalInputManager;

GlobalInputManager.prototype = {

    /**
    * The Boot handler is called by Phaser.Game when it first starts up.
    * The renderer is available by now.
    *
    * @method Phaser.Input.KeyboardManager#boot
    * @private
    */
    boot: function ()
    {
        this.keyboard.boot();
        this.mouse.boot();
    },

    update: function ()
    {
        this.keyboard.update();
        this.mouse.update();
    }

};

module.exports = GlobalInputManager;
