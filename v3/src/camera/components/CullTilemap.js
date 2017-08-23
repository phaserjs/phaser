var CullTilemap = function (tilemap)
{
    var cameraMatrix = this.matrix.matrix;

    var mva = cameraMatrix[0];
    var mvb = cameraMatrix[1];
    var mvc = cameraMatrix[2];
    var mvd = cameraMatrix[3];
    
    /* First Invert Matrix */
    var determinant = (mva * mvd) - (mvb * mvc);

    if (!determinant)
    {
        return tiles;
    }

    var mve = cameraMatrix[4];
    var mvf = cameraMatrix[5];
    var tiles = tilemap.tiles;
    var scrollX = this.scrollX;
    var scrollY = this.scrollY;
    var cameraW = this.width;
    var cameraH = this.height;
    var culledObjects = this.culledObjects;
    var length = tiles.length;
    var tileW = tilemap.tileWidth;
    var tileH = tilemap.tileHeight;
    var cullW = cameraW + tileW;
    var cullH = cameraH + tileH;
    var scrollFactorX = tilemap.scrollFactorX;
    var scrollFactorY = tilemap.scrollFactorY;

    determinant = 1 / determinant;

    culledObjects.length = 0;

    for (var index = 0; index < length; ++index)
    {
        var tile = tiles[index];
        var tileX = (tile.x - (scrollX * scrollFactorX));
        var tileY = (tile.y - (scrollY * scrollFactorY));
        var tx = (tileX * mva + tileY * mvc + mve);
        var ty = (tileX * mvb + tileY * mvd + mvf);
        var tw = ((tileX + tileW) * mva + (tileY + tileH) * mvc + mve);
        var th = ((tileX + tileW) * mvb + (tileY + tileH) * mvd + mvf);

        if (tx > -tileW && ty > -tileH && tw < cullW && th < cullH)
        {
            culledObjects.push(tile);
        }
    }

    return culledObjects;
};

module.exports = CullTilemap;
