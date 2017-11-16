var GenerateEmptyMapLayer = function (name, tileWidth, tileHeight, width, height)
{
    if (width === undefined) { width = 0; }
    if (height === undefined) { height = 0; }
    if (tileWidth === undefined) { tileWidth = 0; }
    if (tileHeight === undefined) { tileHeight = 0; }

    return {
        name: name !== undefined ? name : 'layer',
        x: 0,
        y: 0,
        width: width,
        height: height,
        widthInPixels: width * tileWidth,
        heightInPixels: height * tileHeight,
        alpha: 1,
        visible: true,
        properties: {},
        indexes: [],
        callbacks: [],
        bodies: [],
        data: []
    };
};

module.exports = GenerateEmptyMapLayer;
