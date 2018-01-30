module.exports = {

    getTintFromFloats: function (r, g, b, a)
    {
        var ur = ((r * 255.0)|0) & 0xFF;
        var ug = ((g * 255.0)|0) & 0xFF;
        var ub = ((b * 255.0)|0) & 0xFF;
        var ua = ((a * 255.0)|0) & 0xFF;

        return ((ua << 24) | (ur << 16) | (ug << 8) | ub) >>> 0;
    },

    getTintAppendFloatAlpha: function (rgb, a)
    {
        var ua = ((a * 255.0)|0) & 0xFF;
        return ((ua << 24) | rgb) >>> 0;
    },

    getTintAppendFloatAlphaAndSwap: function (rgb, a)
    {
        var ur = ((rgb >> 16)|0) & 0xff;
        var ug = ((rgb >> 8)|0) & 0xff;
        var ub = (rgb|0) & 0xff;
        var ua = ((a * 255.0)|0) & 0xFF;

        return ((ua << 24) | (ub << 16) | (ug << 8) | ur) >>> 0;
    },

    getFloatsFromUintRGB: function (rgb)
    {
        var ur = ((rgb >> 16)|0) & 0xff;
        var ug = ((rgb >> 8)|0) & 0xff;
        var ub = (rgb|0) & 0xff;

        return [ ur / 255.0, ug / 255.0, ub / 255.0 ];
    },

    getComponentCount: function (attributes)
    {
        var count = 0;

        for (var index = 0; index < attributes.length; ++index)
        {
            var element = attributes[index];
            
            if (element.type === WebGLRenderingContext.FLOAT)
            {
                count += element.size;
            }
            else
            {
                count += 1; // We'll force any other type to be 32 bit. for now
            }
        }

        return count;
    }

};