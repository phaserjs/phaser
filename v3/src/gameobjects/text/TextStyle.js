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
        //  Needed?
        this.text = text;

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

    setStyle: function (style)
    {
        for (var key in propertyMap)
        {
            this[key] = GetObjectValue(style, propertyMap[key][0], this[key]);
        }

        return this;
    },

    syncToCanvas: function (canvas, context)
    {
        context.font = this.font;
        context.textBaseline = 'alphabetic';

        context.fillStyle = this.fill;
        context.strokeStyle = this.stroke;

        context.lineWidth = this.strokeThickness;
        context.lineCap = 'round';
        context.lineJoin = 'round';
    },

    setFont: function (font)
    {
        this.font = font;

        //  Tell Text it changed
    },

});

module.exports = TextStyle;
