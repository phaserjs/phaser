Phaser.Component.ScaleMinMax = function () {};

Phaser.Component.ScaleMinMax.prototype = {

    /**
    * @property {function} transformCallback - The callback that will apply any scale limiting to the worldTransform.
    */
    transformCallback: this.checkTransform,

    /**
    * @property {object} transformCallbackContext - The context that the transformCallback callback is called in.
    */
    transformCallbackContext: this,

    /**
    * @property {Phaser.Point} scaleMin - Set the minimum scale this Sprite will scale down to. Prevents a parent from scaling this Sprite lower than the given value. Set to `null` to remove.
    */
    scaleMin: null,

    /**
    * @property {Phaser.Point} scaleMax - Set the maximum scale this Sprite will scale up to. Prevents a parent from scaling this Sprite higher than the given value. Set to `null` to remove.
    */
    scaleMax: null,

    /**
     * Adjust scaling limits, if set, to this Sprite.
     *
     * @method Phaser.Sprite#checkTransform
     * @private
     * @param {PIXI.Matrix} wt - The updated worldTransform matrix.
     */
    checkTransform: function (wt) {

        if (this.scaleMin)
        {
            if (wt.a < this.scaleMin.x)
            {
                wt.a = this.scaleMin.x;
            }

            if (wt.d < this.scaleMin.y)
            {
                wt.d = this.scaleMin.y;
            }
        }

        if (this.scaleMax)
        {
            if (wt.a > this.scaleMax.x)
            {
                wt.a = this.scaleMax.x;
            }

            if (wt.d > this.scaleMax.y)
            {
                wt.d = this.scaleMax.y;
            }
        }

    },

    /**
     * Sets the scaleMin and scaleMax values. These values are used to limit how far this Sprite will scale based on its parent.
     * For example if this Sprite has a minScale value of 1 and its parent has a scale value of 0.5, the 0.5 will be ignored and the scale value of 1 will be used.
     * By using these values you can carefully control how Sprites deal with responsive scaling.
     * 
     * If only one parameter is given then that value will be used for both scaleMin and scaleMax:
     * setScaleMinMax(1) = scaleMin.x, scaleMin.y, scaleMax.x and scaleMax.y all = 1
     *
     * If only two parameters are given the first is set as scaleMin.x and y and the second as scaleMax.x and y:
     * setScaleMinMax(0.5, 2) = scaleMin.x and y = 0.5 and scaleMax.x and y = 2
     *
     * If you wish to set scaleMin with different values for x and y then either modify Sprite.scaleMin directly, or pass `null` for the maxX and maxY parameters.
     * 
     * Call setScaleMinMax(null) to clear both the scaleMin and scaleMax values.
     *
     * @method Phaser.Sprite#setScaleMinMax
     * @memberof Phaser.Sprite
     * @param {number|null} minX - The minimum horizontal scale value this Sprite can scale down to.
     * @param {number|null} minY - The minimum vertical scale value this Sprite can scale down to.
     * @param {number|null} maxX - The maximum horizontal scale value this Sprite can scale up to.
     * @param {number|null} maxY - The maximum vertical scale value this Sprite can scale up to.
     */
    setScaleMinMax: function (minX, minY, maxX, maxY) {

        if (typeof minY === 'undefined')
        {
            //  1 parameter, set all to it
            minY = maxX = maxY = minX;
        }
        else if (typeof maxX === 'undefined')
        {
            //  2 parameters, the first is min, the second max
            maxX = maxY = minY;
            minY = minX;
        }

        if (minX === null)
        {
            this.scaleMin = null;
        }
        else
        {
            if (this.scaleMin)
            {
                this.scaleMin.set(minX, minY);
            }
            else
            {
                this.scaleMin = new Phaser.Point(minX, minY);
            }
        }

        if (maxX === null)
        {
            this.scaleMax = null;
        }
        else
        {
            if (this.scaleMax)
            {
                this.scaleMax.set(maxX, maxY);
            }
            else
            {
                this.scaleMax = new Phaser.Point(maxX, maxY);
            }
        }

    }

};