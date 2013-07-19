/// <reference path="../Game.ts" />

/**
* Phaser - Components - CSS3Filters
*
* Allows for easy addition and modification of CSS3 Filters on DOM objects (typically the Game.Stage.canvas).
*/

module Phaser.Components {

    export class CSS3Filters {

        /**
         * Creates a new CSS3 Filter component
         * @param parent The DOM object to apply the filters to.
         */
        constructor(parent) {
            this.parent = parent;
        }

        /**
         * Reference to the parent DOM object (stage.canvas for example)
         */
        public parent;

        private _blur: number = 0;
        private _grayscale: number = 0;
        private _sepia: number = 0;
        private _brightness: number = 0;
        private _contrast: number = 0;
        private _hueRotate: number = 0;
        private _invert: number = 0;
        private _opacity: number = 0;
        private _saturate: number = 0;

        private setFilter(local: string, prefix: string, value: number, unit: string) {

            this[local] = value;

            if (this.parent)
            {
                this.parent.style['-webkit-filter'] = prefix + '(' + value + unit + ')';
            }

        }

        /**
         * Applies a Gaussian blur to the DOM element. The value of ‘radius’ defines the value of the standard deviation to the Gaussian function, 
         * or how many pixels on the screen blend into each other, so a larger value will create more blur.
         * If no parameter is provided, then a value 0 is used. The parameter is specified as a CSS length, but does not accept percentage values.
         */
        public set blur(radius?: number = 0) {
            this.setFilter('_blur', 'blur', radius, 'px');
        }

        public get blur(): number {
            return this._blur;
        }

        /**
         * Converts the input image to grayscale. The value of ‘amount’ defines the proportion of the conversion.
         * A value of 100% is completely grayscale. A value of 0% leaves the input unchanged.
         * Values between 0% and 100% are linear multipliers on the effect. If the ‘amount’ parameter is missing, a value of 100% is used.
         */
        public set grayscale(amount?: number = 100) {
            this.setFilter('_grayscale', 'grayscale', amount, '%');
        }

        public get grayscale(): number {
            return this._grayscale;
        }

        /**
         * Converts the input image to sepia. The value of ‘amount’ defines the proportion of the conversion.
         * A value of 100% is completely sepia. A value of 0 leaves the input unchanged.
         * Values between 0% and 100% are linear multipliers on the effect. If the ‘amount’ parameter is missing, a value of 100% is used.
         */
        public set sepia(amount?: number = 100) {
            this.setFilter('_sepia', 'sepia', amount, '%');
        }

        public get sepia(): number {
            return this._sepia;
        }

        /**
         * Applies a linear multiplier to input image, making it appear more or less bright.
         * A value of 0% will create an image that is completely black. A value of 100% leaves the input unchanged.
         * Other values are linear multipliers on the effect. Values of an amount over 100% are allowed, providing brighter results.
         * If the ‘amount’ parameter is missing, a value of 100% is used.
         */
        public set brightness(amount?: number = 100) {
            this.setFilter('_brightness', 'brightness', amount, '%');
        }

        public get brightness(): number {
            return this._brightness;
        }

        /**
         * Adjusts the contrast of the input. A value of 0% will create an image that is completely black.
         * A value of 100% leaves the input unchanged. Values of amount over 100% are allowed, providing results with less contrast.
         * If the ‘amount’ parameter is missing, a value of 100% is used.
         */
        public set contrast(amount?: number = 100) {
            this.setFilter('_contrast', 'contrast', amount, '%');
        }

        public get contrast(): number {
            return this._contrast;
        }

        /**
         * Applies a hue rotation on the input image. The value of ‘angle’ defines the number of degrees around the color circle 
         * the input samples will be adjusted. A value of 0deg leaves the input unchanged. If the ‘angle’ parameter is missing, 
         * a value of 0deg is used. Maximum value is 360deg.
         */
        public set hueRotate(angle?: number = 0) {
            this.setFilter('_hueRotate', 'hue-rotate', angle, 'deg');
        }

        public get hueRotate(): number {
            return this._hueRotate;
        }

        /**
         * Inverts the samples in the input image. The value of ‘amount’ defines the proportion of the conversion.
         * A value of 100% is completely inverted. A value of 0% leaves the input unchanged.
         * Values between 0% and 100% are linear multipliers on the effect. If the ‘amount’ parameter is missing, a value of 100% is used.
         */
        public set invert(value?: number = 100) {
            this.setFilter('_invert', 'invert', value, '%');
        }

        public get invert(): number {
            return this._invert;
        }

        /**
         * Applies transparency to the samples in the input image. The value of ‘amount’ defines the proportion of the conversion.
         * A value of 0% is completely transparent. A value of 100% leaves the input unchanged.
         * Values between 0% and 100% are linear multipliers on the effect. This is equivalent to multiplying the input image samples by amount.
         * If the ‘amount’ parameter is missing, a value of 100% is used.
         * This function is similar to the more established opacity property; the difference is that with filters, some browsers provide hardware acceleration for better performance.
         */
        public set opacity(value?: number = 100) {
            this.setFilter('_opacity', 'opacity', value, '%');
        }

        public get opacity(): number {
            return this._opacity;
        }

        /**
         * Saturates the input image. The value of ‘amount’ defines the proportion of the conversion.
         * A value of 0% is completely un-saturated. A value of 100% leaves the input unchanged.
         * Other values are linear multipliers on the effect. Values of amount over 100% are allowed, providing super-saturated results.
         * If the ‘amount’ parameter is missing, a value of 100% is used.
         */
        public set saturate(value?: number = 100) {
            this.setFilter('_saturate', 'saturate', value, '%');
        }

        public get saturate(): number {
            return this._saturate;
        }

    }

}