var Class = require('../../utils/Class');
var GetObjectValue = require('../../utils/object/GetObjectValue');

//  Key: [ Object Key, Default Value ]

var propertyMap = {
    font: [ 'font', '16px Courier' ],
    backgroundColor: [ 'backgroundColor', null ],
    fill: [ 'fill', '#fff' ],
    stroke: [ 'stroke', '#fff' ],
    strokeThickness: [ 'strokeThickness', 0 ],
    shadowOffsetX: [ 'shadow.offsetX', 0 ],
    shadowOffsetY: [ 'shadow.offsetY', 0 ],
    shadowColor: [ 'shadow.color', '#000' ],
    shadowBlur: [ 'shadow.blur', 0 ],
    shadowStroke: [ 'shadow.stroke', false ],
    shadowFill: [ 'shadow.fill', false ],
    align: [ 'align', 'left' ],
    maxLines: [ 'maxLines', 0 ]
};

var TextStyle = new Class({

    initialize:

    function TextStyle (text, style)
    {
        this.parent = text;

        this.font = propertyMap.font[1];
        this.backgroundColor = propertyMap.backgroundColor[1];
        this.fill = propertyMap.fill[1];
        this.stroke = propertyMap.stroke[1];
        this.strokeThickness = propertyMap.strokeThickness[1];
        this.shadowOffsetX = propertyMap.shadowOffsetX[1];
        this.shadowOffsetY = propertyMap.shadowOffsetY[1];
        this.shadowColor = propertyMap.shadowColor[1];
        this.shadowBlur = propertyMap.shadowBlur[1];
        this.shadowStroke = propertyMap.shadowStroke[1];
        this.shadowFill = propertyMap.shadowFill[1];
        this.align = propertyMap.align[1];
        this.maxLines = propertyMap.maxLines[1];

        if (style !== undefined)
        {
            this.setStyle(style);
        }
    },

    syncFont: function (canvas, context)
    {
        context.font = this.font;
        context.textBaseline = 'alphabetic';

        context.fillStyle = this.fill;
        context.strokeStyle = this.stroke;

        context.lineWidth = this.strokeThickness;
        context.lineCap = 'round';
        context.lineJoin = 'round';
    },

    syncShadow: function (canvas, context, visible)
    {
        var style = this.style;

        if (visible)
        {
            context.shadowOffsetX = style.shadowOffsetX;
            context.shadowOffsetY = style.shadowOffsetY;
            context.shadowColor = style.shadowColor;
            context.shadowBlur = style.shadowBlur;
        }
        else
        {
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowColor = 0;
            context.shadowBlur = 0;
        }
    },

    setStyle: function (style)
    {
        for (var key in propertyMap)
        {
            this[key] = GetObjectValue(style, propertyMap[key][0], this[key]);
        }

        return this;
    },

    setFont: function (font)
    {

        this.font = font;

        this.parent.updateText();

        return this;
    },

    setBackgroundColor: function (color)
    {
        this.backgroundColor = color;

        this.parent.updateText();

        return this;
    },

    setFill: function (color)
    {
        this.fill = color;

        this.parent.updateText();

        return this;
    },

    setStroke: function (color, thickness)
    {
        if (color === undefined)
        {
            //  Reset the stroke to zero (disabling it)
            this.strokeThickness = 0;
        }
        else
        {
            if (thickness === undefined) { thickness = this.strokeThickness; }

            this.stroke = color;
            this.strokeThickness = thickness;
        }

        this.parent.updateText();

        return this;
    },

    setShadow: function (x, y, color, blur, shadowStroke, shadowFill)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (color === undefined) { color = '#000'; }
        if (blur === undefined) { blur = 0; }
        if (shadowStroke === undefined) { shadowStroke = false; }
        if (shadowFill === undefined) { shadowFill = false; }

        this.shadowOffsetX = x;
        this.shadowOffsetY = y;
        this.shadowColor = color;
        this.shadowBlur = blur;
        this.shadowStroke = shadowStroke;
        this.shadowFill = shadowFill;

        this.parent.updateText();

        return this;
    },

    setAlign: function (align)
    {
        if (align === undefined) { align = 'left'; }

        this.align = align;

        this.parent.updateText();

        return this;
    },

    setMaxLines: function (max)
    {
        if (max === undefined) { max = 0; }

        this.maxLines = max;

        this.parent.updateText();

        return this;
    },

    destroy: function ()
    {
        this.parent = undefined;
    }

});

module.exports = TextStyle;
