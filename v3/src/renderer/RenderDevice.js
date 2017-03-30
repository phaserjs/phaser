var RenderDevice = function (backend) 
{
    this.backend = backend;
    this.commandListArray = [];
};

RenderDevice.prototype.constructor = RenderDevice;

RenderDevice.prototype = {
    addCommandList: function (commandList) 
    {
        this.commandListArray.push(commandList);
    },
    
    sortCommandLists: function () 
    {
        this.commandListArray.sort(function (listA, listB) 
        {
            return listA.layer - listB.layer;
        });
    },
    dispatch: function () 
    {
        var listCount = commandListArray.length;
        var commandListArray = this.commandListArray;

        for (var index = 0; index < listCount; ++index) 
        {
            commandListArray[index].dispatch(this.backend);
        }
        
        commandListArray.length = 0;
    }
};

module.exports = RenderDevice;
