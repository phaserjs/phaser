/**
* Phaser - Display - CSS3Filters
*
* Allows for easy addition and modification of CSS3 Filters on DOM objects (typically the Game.Stage.canvas).
*/

Phaser.Plugins.CSS3Filters = function (parent) {

	this.parent = parent;

	this._blur = 0;
	this._grayscale = 0;
	this._sepia = 0;
	this._brightness = 0;
	this._contrast = 0;
	this._hueRotate = 0;
	this._invert = 0;
	this._opacity = 0;
	this._saturate = 0;
	
};

Phaser.Plugins.CSS3Filters.prototype = {

    setFilter: function (local, prefix, value, unit) {

        this[local] = value;

        if (this.parent)
        {
            this.parent.style['-webkit-filter'] = prefix + '(' + value + unit + ')';
        }

    }

};

Object.defineProperty(Phaser.Plugins.CSS3Filters.prototype, "blur", {

    get: function () {
        return this._blur;
    },

	/**
    * Applies a Gaussian blur to the DOM element. The value of 'radius' defines the value of the standard deviation to the Gaussian function,
    * or how many pixels on the screen blend into each other, so a larger value will create more blur.
    * If no parameter is provided, then a value 0 is used. The parameter is specified as a CSS length, but does not accept percentage values.
    */
    set: function (radius) {
        this.setFilter('_blur', 'blur', radius, 'px');
    }
});

Object.defineProperty(Phaser.Plugins.CSS3Filters.prototype, "grayscale", {
    get: function () {
        return this._grayscale;
    },

	/**
    * Converts the input image to grayscale. The value of 'amount' defines the proportion of the conversion.
    * A value of 100% is completely grayscale. A value of 0% leaves the input unchanged.
    * Values between 0% and 100% are linear multipliers on the effect. If the 'amount' parameter is missing, a value of 100% is used.
    */
    set: function (amount) {
        this.setFilter('_grayscale', 'grayscale', amount, '%');
    }
});

Object.defineProperty(Phaser.Plugins.CSS3Filters.prototype, "sepia", {
    get: function () {
        return this._sepia;
    },

	/**
    * Converts the input image to sepia. The value of 'amount' defines the proportion of the conversion.
    * A value of 100% is completely sepia. A value of 0 leaves the input unchanged.
    * Values between 0% and 100% are linear multipliers on the effect. If the 'amount' parameter is missing, a value of 100% is used.
    */
    set: function (amount) {
        this.setFilter('_sepia', 'sepia', amount, '%');
    }
});

Object.defineProperty(Phaser.Plugins.CSS3Filters.prototype, "brightness", {
    get: function () {
        return this._brightness;
    },

	/**
    * Applies a linear multiplier to input image, making it appear more or less bright.
    * A value of 0% will create an image that is completely black. A value of 100% leaves the input unchanged.
    * Other values are linear multipliers on the effect. Values of an amount over 100% are allowed, providing brighter results.
    * If the 'amount' parameter is missing, a value of 100% is used.
    */
    set: function (amount) {
        this.setFilter('_brightness', 'brightness', amount, '%');
    }
});

Object.defineProperty(Phaser.Plugins.CSS3Filters.prototype, "contrast", {
    get: function () {
        return this._contrast;
    },

	/**
    * Adjusts the contrast of the input. A value of 0% will create an image that is completely black.
    * A value of 100% leaves the input unchanged. Values of amount over 100% are allowed, providing results with less contrast.
    * If the 'amount' parameter is missing, a value of 100% is used.
    */
    set: function (amount) {
        this.setFilter('_contrast', 'contrast', amount, '%');
    }
});

Object.defineProperty(Phaser.Plugins.CSS3Filters.prototype, "hueRotate", {

    get: function () {
        return this._hueRotate;
    },

	/**
    * Applies a hue rotation on the input image. The value of 'angle' defines the number of degrees around the color circle
    * the input samples will be adjusted. A value of 0deg leaves the input unchanged. If the 'angle' parameter is missing,
    * a value of 0deg is used. Maximum value is 360deg.
    */
    set: function (angle) {
        this.setFilter('_hueRotate', 'hue-rotate', angle, 'deg');
    }
});

Object.defineProperty(Phaser.Plugins.CSS3Filters.prototype, "invert", {

    get: function () {
        return this._invert;
    },

	/**
    * Inverts the samples in the input image. The value of 'amount' defines the proportion of the conversion.
    * A value of 100% is completely inverted. A value of 0% leaves the input unchanged.
    * Values between 0% and 100% are linear multipliers on the effect. If the 'amount' parameter is missing, a value of 100% is used.
    */
    set: function (value) {
        this.setFilter('_invert', 'invert', value, '%');
    }
});

Object.defineProperty(Phaser.Plugins.CSS3Filters.prototype, "opacity", {

    get: function () {
        return this._opacity;
    },

	/**
    * Applies transparency to the samples in the input image. The value of 'amount' defines the proportion of the conversion.
    * A value of 0% is completely transparent. A value of 100% leaves the input unchanged.
    * Values between 0% and 100% are linear multipliers on the effect. This is equivalent to multiplying the input image samples by amount.
    * If the 'amount' parameter is missing, a value of 100% is used.
    * This function is similar to the more established opacity property; the difference is that with filters, some browsers provide hardware acceleration for better performance.
    */
    set: function (value) {
        this.setFilter('_opacity', 'opacity', value, '%');
    }
});

Object.defineProperty(Phaser.Plugins.CSS3Filters.prototype, "saturate", {

    get: function () {
        return this._saturate;
    },

	/**
    * Saturates the input image. The value of 'amount' defines the proportion of the conversion.
    * A value of 0% is completely un-saturated. A value of 100% leaves the input unchanged.
    * Other values are linear multipliers on the effect. Values of amount over 100% are allowed, providing super-saturated results.
    * If the 'amount' parameter is missing, a value of 100% is used.
    */
    set: function (value) {
        this.setFilter('_saturate', 'saturate', value, '%');
    }
});
