var ParseXMLBitmapFont = require('./ParseXMLBitmapFont');

var ParseFromAtlas = function (state, fontName, textureKey, frameKey, xmlKey, xSpacing, ySpacing)
{
    var frame = state.sys.textures.getFrame(textureKey, frameKey);
    var xml = state.sys.cache.xml.get(xmlKey);

    if (frame && xml)
    {
        var data = ParseXMLBitmapFont(xml, xSpacing, ySpacing, frame);

        state.sys.cache.bitmapFont.add(fontName, { data: data, texture: textureKey, frame: frameKey });

        return true;
    }
    else
    {
        return false;
    }
};

module.exports = ParseFromAtlas;
