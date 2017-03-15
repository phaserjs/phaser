var Class = require('../../utils/Class');
var GetObjectValue = require('../../utils/object/GetObjectValue');

var TextStyle = new Class({

    initialize:

    function TextStyle (text, style)
    {
        if (style === undefined) { style = {}; }

        //  Needed?
        this.text = text;

        this.font = GetObjectValue(style, 'font', '16px Arial');

        this.backgroundColor = GetObjectValue(style, 'backgroundColor', null);

        this.fill = GetObjectValue(style, 'fill', '#fff');

        this.stroke = GetObjectValue(style, 'stroke', '#fff');

        this.strokeThickness = GetObjectValue(style, 'strokeThickness', 0);

        this.shadowOffsetX = GetObjectValue(style, 'shadow.offsetX', 0);
        this.shadowOffsetY = GetObjectValue(style, 'shadow.offsetY', 0);
        this.shadowColor = GetObjectValue(style, 'shadow.color', '#000');
        this.shadowBlur = GetObjectValue(style, 'shadow.blur', 0);
        this.shadowStroke = GetObjectValue(style, 'shadow.stroke', false);
        this.shadowFill = GetObjectValue(style, 'shadow.fill', false);

        this.align = GetObjectValue(style, 'align', 'left');

        this.tabs = GetObjectValue(style, 'tabs', 0);

        this.maxLines = GetObjectValue(style, 'maxLines', 0);

        this.wordWrap = GetObjectValue(style, 'wordWrap', 0);
    },

    syncStyle: function (canvas, context)
    {
        context.font = this.font;
        context.textBaseline = 'alphabetic';

        context.fillStyle = this.fill;
        context.strokeStyle = this.stroke;

        context.lineWidth = this.strokeThickness;
        context.lineCap = 'round';
        context.lineJoin = 'round';
    }

});

module.exports = TextStyle;
