// Pipeline is a WebGL-Only feature

var Pipeline = {
    
    defaultPipeline: null,
    pipeline: null,

    initPipeline: function (pipelineName)
    {
        var renderer = this.scene.sys.game.renderer;

        if (renderer.gl && renderer.hasPipeline(pipelineName))
        {
            this.defaultPipeline = renderer.getPipeline(pipelineName);
            this.pipeline = this.defaultPipeline;
            return true;
        }

        return false;
    },

    setPipeline: function (pipelineName)
    {
        var renderer = this.scene.sys.game.renderer;

        if (renderer.gl && renderer.hasPipeline(pipelineName))
        {
            this.pipeline = renderer.getPipeline(pipelineName);
            return true;
        }
        
        return false;
    },

    resetPipeline: function ()
    {
        this.pipeline = this.defaultPipeline;
        return (this.pipeline !== null);
    }

};

module.exports = Pipeline;
