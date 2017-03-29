var CommandList = function () 
{
    this.commandBuffer = [];
    this.layer = 0;
};

CommandList.prototype.constructor = CommandList;

CommandList.prototype = {

    addCommand: function (command) 
    {
        commandBuffer.push(command)
    },

    clearList: function () 
    {

    },

    dispatch: function (renderingContext)
    {

    }

};

module.exports = CommandList;