var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var Renderer = require('./BitmapTextRenderer');

var ParseXMLBitmapFont = function (xml, xSpacing, ySpacing, frame) 
{
    var data = {};
    var info = xml.getElementsByTagName('info')[0];
    var common = xml.getElementsByTagName('common')[0];

    data.font = info.getAttribute('face');
    data.size = parseInt(info.getAttribute('size'), 10);
    data.lineHeight = parseInt(common.getAttribute('lineHeight'), 10) + ySpacing;
    data.chars = {};

    var letters = xml.getElementsByTagName('char');

    var x = (frame) ? frame.x : 0;
    var y = (frame) ? frame.y : 0;

    for (var i = 0; i < letters.length; i++)
    {
        var charCode = parseInt(letters[i].getAttribute('id'), 10);

        data.chars[charCode] = {
            x: x + parseInt(letters[i].getAttribute('x'), 10),
            y: y + parseInt(letters[i].getAttribute('y'), 10),
            width: parseInt(letters[i].getAttribute('width'), 10),
            height: parseInt(letters[i].getAttribute('height'), 10),
            xOffset: parseInt(letters[i].getAttribute('xoffset'), 10),
            yOffset: parseInt(letters[i].getAttribute('yoffset'), 10),
            xAdvance: parseInt(letters[i].getAttribute('xadvance'), 10) + xSpacing,
            kerning: {}
        };
    }

    var kernings = xml.getElementsByTagName('kerning');

    for (i = 0; i < kernings.length; i++)
    {
        var first = parseInt(kernings[i].getAttribute('first'), 10);
        var second = parseInt(kernings[i].getAttribute('second'), 10);
        var amount = parseInt(kernings[i].getAttribute('amount'), 10);

        data.chars[second].kerning[first] = amount;
    }

    return data;
}

var BitmapText = new Class({

    Mixins: [
        Components.Transform,
        Components.Texture,
        Components.Size,
        Components.Alpha,
        Components.BlendMode,
        Components.Visible,
        Renderer
    ],

    initialize:

    function BitmapText (state, x, y, text, key, subKey)
    {
        GameObject.call(this, state);

        this.text = typeof text === 'string' ? text : '';
        this.fontData = ParseXMLBitmapFont(this.state.sys.cache.xml.get(subKey ? subKey : key), 0, 0);
        
        this.setTexture(key, subKey);
        this.setPosition(x, y);
    }

});

module.exports = BitmapText;
