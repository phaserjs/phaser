var GL = require('../../GL');

var SetViewportCommand = function ()
{
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.zNear = 0;
    this.zFar = 1;
};

SetViewportCommand.prototype.constructor = SetViewportCommand;

SetViewportCommand.prototype = {

    setRect: function (x, y, width, height) 
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;
    },

    setDepthRange: function (zNear, zFar)
    {
        this.zNear = zNear;
        this.zFar = zFar;

        return this;
    }

};

module.exports = SetViewportCommand;
