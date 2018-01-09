module.exports = {

	getTintFromFloats: function (r, g, b, a)
	{
		var ur = ((r * 255.0)|0) & 0xFF;
		var ug = ((g * 255.0)|0) & 0xFF;
		var ub = ((b * 255.0)|0) & 0xFF;
		var ua = ((a * 255.0)|0) & 0xFF;

		return (ua << 24) | (ub << 16) | (ug << 8) | ur;
	},

	getTintAppendFloatAlpha: function (rgb, a)
	{
		//var ua = ((a * 255.0)|0) & 0xFF;
		return 0;
	}

};