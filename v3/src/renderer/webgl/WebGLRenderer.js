var WebGLRenderer = function (renderingContext) 
{
    this.renderingContext = renderingContext;
    this.commandListArray = [];
};

WebGLRenderer.prototype.constructor = WebGLRenderer;

WebGLRenderer.prototype = {
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
            commandListArray[index].dispatch(this.renderingContext);
        }
        
        commandListArray.length = 0;
    }
};

module.exports = WebGLRenderer;