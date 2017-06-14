//  https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
//  https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md

var MouseManager = function (inputManager)
{
    this.manager = inputManager;

    this.enabled = false;

    this.target;

    this.handler;
};

MouseManager.prototype.constructor = MouseManager;

MouseManager.prototype = {

    boot: function ()
    {
        var config = this.manager.gameConfig;

        this.enabled = config.inputMouse;
        this.target = config.inputMouseEventTarget;

        if (!this.target)
        {
            this.target = this.manager.game.canvas;
        }

        if (this.enabled)
        {
            this.startListeners();
        }
    },

    startListeners: function ()
    {
        var queue = this.manager.queue;

        var handler = function (event)
        {
            if (event.preventDefaulted)
            {
                // Do nothing if event already handled
                return;
            }

            queue.push(event);
        };

        this.handler = handler;

        this.target.addEventListener('mousemove', handler, false);
        this.target.addEventListener('mousedown', handler, false);
        this.target.addEventListener('mouseup', handler, false);
    },

    stopListeners: function ()
    {
        this.target.removeEventListener('mousemove', this.handler);
        this.target.removeEventListener('mousedown', this.handler);
        this.target.removeEventListener('mouseup', this.handler);
    }
};

module.exports = MouseManager;
