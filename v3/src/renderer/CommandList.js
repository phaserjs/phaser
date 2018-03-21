var CommandList = function () 
{
    this.commandBuffer = [];
    this.layer = 0;
};

CommandList.prototype.constructor = CommandList;

CommandList.prototype = {

    addCommand: function (command) 
    {
        this.commandBuffer.push(command);
    },

    clearList: function () 
    {
        this.commandBuffer.length = 0;
    },

    dispatch: function (backend)
    {
        var commandBuffer = this.commandBuffer;
        var commandCount = commandBuffer.length;
        for(var index = 0; index < commandCount; ++index)
        {
            commandBuffer[index].dispatch(backend);
        }
    }

};

module.exports = CommandList;
