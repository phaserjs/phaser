/// <reference path="../_definitions.ts" />
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/
var Phaser;
(function (Phaser) {
    /**
    * A collection of methods useful for manipulating canvas objects.
    *
    * @class CanvasUtils
    */
    var CanvasUtils = (function () {
        function CanvasUtils() { }
        CanvasUtils.getAspectRatio = /**
        * Returns the aspect ratio of the given canvas.
        *
        * @method getAspectRatio
        * @param {HTMLCanvasElement} canvas The canvas to get the aspect ratio from.
        * @return {Number} Returns true on success
        */
        function getAspectRatio(canvas) {
            return canvas.width / canvas.height;
        };
        CanvasUtils.setBackgroundColor = /**
        * Sets the background color behind the canvas. This changes the canvas style property.
        *
        * @method setBackgroundColor
        * @param {HTMLCanvasElement} canvas The canvas to set the background color on.
        * @param {String} color The color to set. Can be in the format 'rgb(r,g,b)', or '#RRGGBB' or any valid CSS color.
        * @return {HTMLCanvasElement} Returns the source canvas.
        */
        function setBackgroundColor(canvas, color) {
            if (typeof color === "undefined") { color = 'rgb(0,0,0)'; }
            canvas.style.backgroundColor = color;
            return canvas;
        };
        CanvasUtils.setTouchAction = /**
        * Sets the touch-action property on the canvas style. Can be used to disable default browser touch actions.
        *
        * @method setTouchAction
        * @param {HTMLCanvasElement} canvas The canvas to set the touch action on.
        * @param {String} value The touch action to set. Defaults to 'none'.
        * @return {HTMLCanvasElement} Returns the source canvas.
        */
        function setTouchAction(canvas, value) {
            if (typeof value === "undefined") { value = 'none'; }
            canvas.style.msTouchAction = value;
            canvas.style['ms-touch-action'] = value;
            canvas.style['touch-action'] = value;
            return canvas;
        };
        CanvasUtils.addToDOM = /**
        * Adds the given canvas element to the DOM. The canvas will be added as a child of the given parent.
        * If no parent is given it will be added as a child of the document.body.
        *
        * @method addToDOM
        * @param {HTMLCanvasElement} canvas The canvas to set the touch action on.
        * @param {String} parent The DOM element to add the canvas to. Defaults to ''.
        * @param {bool} overflowHidden If set to true it will add the overflow='hidden' style to the parent DOM element.
        * @return {HTMLCanvasElement} Returns the source canvas.
        */
        function addToDOM(canvas, parent, overflowHidden) {
            if (typeof parent === "undefined") { parent = ''; }
            if (typeof overflowHidden === "undefined") { overflowHidden = true; }
            if((parent !== '' || parent !== null) && document.getElementById(parent)) {
                document.getElementById(parent).appendChild(canvas);
                if(overflowHidden) {
                    document.getElementById(parent).style.overflow = 'hidden';
                }
            } else {
                document.body.appendChild(canvas);
            }
            return canvas;
        };
        CanvasUtils.setTransform = /**
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
        function setTransform(context, translateX, translateY, scaleX, scaleY, skewX, skewY) {
            context.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);
            return context;
        };
        CanvasUtils.setSmoothingEnabled = /**
        * Sets the Image Smoothing property on the given context. Set to false to disable image smoothing.
        * By default browsers have image smoothing enabled, which isn't always what you visually want, especially
        * when using pixel art in a game. Note that this sets the property on the context itself, so that any image
        * drawn to the context will be affected. This sets the property across all current browsers but support is
        * patchy on earlier browsers, especially on mobile.
        *
        * @method setSmoothingEnabled
        * @param {CanvasRenderingContext2D} context The context to enable or disable the image smoothing on.
        * @param {bool} overflowHidden If set to true it will enable image smoothing, false will disable it.
        * @return {CanvasRenderingContext2D} Returns the source context.
        */
        function setSmoothingEnabled(context, value) {
            context['imageSmoothingEnabled'] = value;
            context['mozImageSmoothingEnabled'] = value;
            context['oImageSmoothingEnabled'] = value;
            context['webkitImageSmoothingEnabled'] = value;
            context['msImageSmoothingEnabled'] = value;
            return context;
        };
        CanvasUtils.setImageRenderingCrisp = /**
        * Sets the CSS image-rendering property on the given canvas to be 'crisp' (aka 'optimize contrast on webkit').
        * Note that if this doesn't given the desired result then see the CanvasUtils.setSmoothingEnabled method.
        *
        * @method setImageRenderingCrisp
        * @param {HTMLCanvasElement} canvas The canvas to set image-rendering crisp on.
        * @return {HTMLCanvasElement} Returns the source canvas.
        */
        function setImageRenderingCrisp(canvas) {
            canvas.style['image-rendering'] = 'crisp-edges';
            canvas.style['image-rendering'] = '-moz-crisp-edges';
            canvas.style['image-rendering'] = '-webkit-optimize-contrast';
            canvas.style.msInterpolationMode = 'nearest-neighbor';
            return canvas;
        };
        CanvasUtils.setImageRenderingBicubic = /**
        * Sets the CSS image-rendering property on the given canvas to be 'bicubic' (aka 'auto').
        * Note that if this doesn't given the desired result then see the CanvasUtils.setSmoothingEnabled method.
        *
        * @method setImageRenderingBicubic
        * @param {HTMLCanvasElement} canvas The canvas to set image-rendering bicubic on.
        * @return {HTMLCanvasElement} Returns the source canvas.
        */
        function setImageRenderingBicubic(canvas) {
            canvas.style['image-rendering'] = 'auto';
            canvas.style.msInterpolationMode = 'bicubic';
            return canvas;
        };
        return CanvasUtils;
    })();
    Phaser.CanvasUtils = CanvasUtils;    
})(Phaser || (Phaser = {}));
