/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Abstracts away the use of RAF or setTimeOut for the core game update loop.
*
* @class Phaser.RequestAnimationFrame
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {boolean} [forceSetTimeOut=false] - Tell Phaser to use setTimeOut even if raf is available.
*/
function RequestAnimationFrame (game)
{
    /**
    * @property {Phaser.Game} game - The currently running game.
    */
    this.game = game;

    /**
    * @property {boolean} isRunning - true if RequestAnimationFrame is running, otherwise false.
    * @default
    */
    this.isRunning = false;

    this.tick = 0;

    var vendors = [
        'ms',
        'moz',
        'webkit',
        'o'
    ];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++)
    {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
    }

    /**
    * @property {boolean} isSetTimeOut  - True if the browser is using setTimeout instead of rAf.
    */
    this.isSetTimeOut = false;

    /**
    * @property {number} timeOutID - The callback setTimeout or rAf callback ID used when calling cancel.
    */
    this.timeOutID = null;

    var _this = this;

    //  timestamp = DOMHighResTimeStamp
    var step = function (timestamp)
    {
        _this.tick = timestamp;

        _this.timeOutID = window.requestAnimationFrame(step);

        _this.game.update(timestamp);
    };

    var stepTimeout = function ()
    {
        _this.tick = Date.now();

        // _this.game.update(_this.tick);

        // _this.timeOutID = window.setTimeout(stepTimeout, _this.game.time.timeToCall);
    };

    /**
    * Starts the requestAnimationFrame running or setTimeout if unavailable in browser
    * @method Phaser.RequestAnimationFrame#start
    */
    this.start = function ()
    {
        this.isRunning = true;

        if (this.game.config.forceSetTimeOut)
        {
            this.isSetTimeOut = true;

            this.timeOutID = window.setTimeout(stepTimeout, 0);
        }
        else
        {
            this.isSetTimeOut = false;

            this.timeOutID = window.requestAnimationFrame(step);
        }
    };

    /**
    * Stops the requestAnimationFrame from running.
    * @method Phaser.RequestAnimationFrame#stop
    */
    this.stop = function ()
    {
        this.isRunning = false;

        if (this.isSetTimeOut)
        {
            clearTimeout(this.timeOutID);
        }
        else
        {
            window.cancelAnimationFrame(this.timeOutID);
        }
    };

    this.destroy = function ()
    {
        this.stop();

        this.game = undefined;
    };

}

RequestAnimationFrame.prototype.constructor = RequestAnimationFrame;

module.exports = RequestAnimationFrame;
