var NOOP = require('../utils/NOOP');

// Abstracts away the use of RAF or setTimeOut for the core game update loop.
var RequestAnimationFrame = function ()
{
    // @property {boolean} isRunning - true if RequestAnimationFrame is running, otherwise false.
    this.isRunning = false;

    this.callback = NOOP;

    this.tick = 0;

    // @property {boolean} isSetTimeOut  - True if the browser is using setTimeout instead of rAf.
    this.isSetTimeOut = false;

    // @property {number} timeOutID - The callback setTimeout or rAf callback ID used when calling cancel.
    this.timeOutID = null;

    var _this = this;

    //  timestamp = DOMHighResTimeStamp
    var step = function (timestamp)
    {
        _this.tick = timestamp;

        _this.callback(timestamp);

        _this.timeOutID = window.requestAnimationFrame(step);
    };

    var stepTimeout = function ()
    {
        var d = Date.now();

        _this.tick = d;

        _this.callback(d);

        _this.timeOutID = window.setTimeout(stepTimeout, _this.timeToCall);
    };

    this.step = step;
    this.stepTimeout = stepTimeout;
};

RequestAnimationFrame.prototype.constructor = RequestAnimationFrame;

RequestAnimationFrame.prototype = {

    // Starts the requestAnimationFrame running or setTimeout if unavailable in browser
    start: function (callback, forceSetTimeOut)
    {
        this.callback = callback;

        this.isSetTimeOut = forceSetTimeOut;

        this.isRunning = true;

        var _this = this;

        this.timeOutID = (forceSetTimeOut) ? window.setTimeout(_this.stepTimeout, 0) : window.requestAnimationFrame(_this.step);
    },

    // Stops the requestAnimationFrame from running.
    stop: function ()
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
    },

    destroy: function ()
    {
        this.stop();

        this.callback = NOOP;
    }

};

module.exports = RequestAnimationFrame;
