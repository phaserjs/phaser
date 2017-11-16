var GenerateEmptyMapLayer = require('./GenerateEmptyMapLayer');

var GenerateEmptyMapData = function (format, name, tileWidth, tileHeight, width, height)
{
    return {
        width: (width !== undefined && width !== null) ? width : 0,
        height: (height !== undefined && height !== null) ? height : 0,
        tileWidth: (tileWidth !== undefined && tileWidth !== null) ? tileWidth : 0,
        tileHeight: (tileHeight !== undefined && tileHeight !== null) ? tileHeight : 0,
        name: (name !== undefined && name !== null) ? name : '',
        format: format,
        orientation: 'orthogonal',
        version: '1',
        properties: {},
        widthInPixels: 0,
        heightInPixels: 0,
        layers: [
            GenerateEmptyMapLayer('layer', tileWidth, tileHeight, width, height)
        ],
        images: [],
        objects: {},
        collision: {},
        tilesets: [],
        tiles: []
    };
};

module.exports = GenerateEmptyMapData;
