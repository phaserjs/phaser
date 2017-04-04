var RenderDevice = function (backendInterface, resourceManager, rendererList) 
{
    this.backendInterface = backendInterface;
    this.backend = backendInterface.backend;
    this.commandListArray = [];
    this.resourceManager = resourceManager;
    this.rendererList = rendererList;
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
        var listCount = this.commandListArray.length;
        var commandListArray = this.commandListArray;
        var backend = this.backend;

        this.backendInterface.clearScreen(0, 0, 0, 1);

        for (var index = 0; index < listCount; ++index) 
        {
            commandListArray[index].dispatch(backend);
        }
        
        commandListArray.length = 0;
    }
};

module.exports = RenderDevice;
