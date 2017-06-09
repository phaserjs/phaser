var TilemapWebGLRenderer = function (renderer, gameObject, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }

    var renderTiles = gameObject.tileArray;
    var length = renderTiles.length;

    for (var index = 0; index < length; ++index)
    {
    	
    }

};

module.exports = TilemapWebGLRenderer;
