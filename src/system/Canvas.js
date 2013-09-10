/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser.Canvas
*/

Phaser.Canvas = {

    create: function (width, height) {

        width = width || 256;
        height = height || 256;

        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.display = 'block';

        return canvas;

    },

    /**
    * Get the DOM offset values of any given element
    */    
    getOffset: function (element, point) {

        point = point || new Phaser.Point;

        var box = element.getBoundingClientRect();
        var clientTop = element.clientTop || document.body.clientTop || 0;
        var clientLeft = element.clientLeft || document.body.clientLeft || 0;
        var scrollTop = window.pageYOffset || element.scrollTop || document.body.scrollTop;
        var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;

        point.x = box.left + scrollLeft - clientLeft;
        point.y = box.top + scrollTop - clientTop;

        return point;

    },

    /**
    * Returns the aspect ratio of the given canvas.
    *
    * @method getAspectRatio
    * @param {HTMLCanvasElement} canvas The canvas to get the aspect ratio from.
    * @return {Number} Returns true on success
    */        
    getAspectRatio: function (canvas) {
        return canvas.width / canvas.height;
    },

    /**
    * Sets the background color behind the canvas. This changes the canvas style property.
    *
    * @method setBackgroundColor
    * @param {HTMLCanvasElement} canvas The canvas to set the background color on.
    * @param {String} color The color to set. Can be in the format 'rgb(r,g,b)', or '#RRGGBB' or any valid CSS color.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    setBackgroundColor: function (canvas, color) {

        color = color || 'rgb(0,0,0)';

        canvas.style.backgroundColor = color;
        
        return canvas;

    },

    /**
    * Sets the touch-action property on the canvas style. Can be used to disable default browser touch actions.
    *
    * @method setTouchAction
    * @param {HTMLCanvasElement} canvas The canvas to set the touch action on.
    * @param {String} value The touch action to set. Defaults to 'none'.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    setTouchAction: function (canvas, value) {

        value = value || 'none';

        canvas.style.msTouchAction = value;
        canvas.style['ms-touch-action'] = value;
        canvas.style['touch-action'] = value;

        return canvas;

    },

    /**
    * Adds the given canvas element to the DOM. The canvas will be added as a child of the given parent.
    * If no parent is given it will be added as a child of the document.body.
    *
    * @method addToDOM
    * @param {HTMLCanvasElement} canvas The canvas to set the touch action on.
    * @param {String} parent The DOM element to add the canvas to. Defaults to ''.
    * @param {bool} overflowHidden If set to true it will add the overflow='hidden' style to the parent DOM element.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    addToDOM: function (canvas, parent, overflowHidden) {

        parent = parent || '';
        overflowHidden = overflowHidden || true;

        if ((parent !== '' || parent !== null) && document.getElementById(parent))
        {
            document.getElementById(parent).appendChild(canvas);

            if (overflowHidden)
            {
                document.getElementById(parent).style.overflow = 'hidden';
            }
        }
        else
        {
            document.body.appendChild(canvas);
        }

        return canvas;

    },

    /**
    * Sets the transform of the given canvas to the matrix values provided.
    *
    * @method setTransform
    * @param {CanvasRenderingContext2D} context The context to set the transform on.
    * @param {Number} translateX The value to translate horizontally by.
    * @param {Number} translateY The value to translate vertically by.
    * @param {Number} scaleX The value to scale horizontally by.
    * @param {Number} scaleY The value to scale vertically by.
    * @param {Number} skewX The value to skew horizontaly by.
    * @param {Number} skewY The value to skew vertically by.
    * @return {CanvasRenderingContext2D} Returns the source context.
    */
    setTransform: function (context, translateX, translateY, scaleX, scaleY, skewX, skewY) {

        context.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);

        return context;

    },

    /**
    * Sets the Image Smoothing property on the given context. Set to false to disable image smoothing.
    * By default browsers have image smoothing enabled, which isn't always what you visually want, especially
    * when using pixel art in a game. Note that this sets the property on the context itself, so that any image
    * drawn to the context will be affected. This sets the property across all current browsers but support is
    * patchy on earlier browsers, especially on mobile.
    *
    * @method setSmoothingEnabled
    * @param {CanvasRenderingContext2D} context The context to enable or disable the image smoothing on.
    * @param {bool} value If set to true it will enable image smoothing, false will disable it.
    * @return {CanvasRenderingContext2D} Returns the source context.
    */
    setSmoothingEnabled: function (context, value) {

        context['imageSmoothingEnabled'] = value;
        context['mozImageSmoothingEnabled'] = value;
        context['oImageSmoothingEnabled'] = value;
        context['webkitImageSmoothingEnabled'] = value;
        context['msImageSmoothingEnabled'] = value;

        return context;

    },

    /**
    * Sets the CSS image-rendering property on the given canvas to be 'crisp' (aka 'optimize contrast on webkit').
    * Note that if this doesn't given the desired result then see the setSmoothingEnabled.
    *
    * @method setImageRenderingCrisp
    * @param {HTMLCanvasElement} canvas The canvas to set image-rendering crisp on.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    setImageRenderingCrisp: function (canvas) {

        canvas.style['image-rendering'] = 'crisp-edges';
        canvas.style['image-rendering'] = '-moz-crisp-edges';
        canvas.style['image-rendering'] = '-webkit-optimize-contrast';
        canvas.style.msInterpolationMode = 'nearest-neighbor';

        return canvas;

    },

    /**
    * Sets the CSS image-rendering property on the given canvas to be 'bicubic' (aka 'auto').
    * Note that if this doesn't given the desired result then see the CanvasUtils.setSmoothingEnabled method.
    *
    * @method setImageRenderingBicubic
    * @param {HTMLCanvasElement} canvas The canvas to set image-rendering bicubic on.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    setImageRenderingBicubic: function (canvas) {

        canvas.style['image-rendering'] = 'auto';
        canvas.style.msInterpolationMode = 'bicubic';

        return canvas;

    }

};
