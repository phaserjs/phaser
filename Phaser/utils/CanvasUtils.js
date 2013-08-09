/// <reference path="../_definitions.ts" />
/**
* Phaser - CanvasUtils
*
* A collection of methods useful for manipulating canvas objects.
*/
var Phaser;
(function (Phaser) {
    var CanvasUtils = (function () {
        function CanvasUtils() {
        }
        CanvasUtils.getAspectRatio = function (canvas) {
            return canvas.width / canvas.height;
        };

        CanvasUtils.setBackgroundColor = function (canvas, color) {
            if (typeof color === "undefined") { color = 'rgb(0,0,0)'; }
            canvas.style.backgroundColor = color;
            return canvas;
        };

        CanvasUtils.setTouchAction = function (canvas, value) {
            if (typeof value === "undefined") { value = 'none'; }
            canvas.style.msTouchAction = value;
            canvas.style['ms-touch-action'] = value;
            canvas.style['touch-action'] = value;

            return canvas;
        };

        CanvasUtils.addToDOM = function (canvas, parent, overflowHidden) {
            if (typeof parent === "undefined") { parent = ''; }
            if (typeof overflowHidden === "undefined") { overflowHidden = true; }
            if ((parent !== '' || parent !== null) && document.getElementById(parent)) {
                document.getElementById(parent).appendChild(canvas);

                if (overflowHidden) {
                    document.getElementById(parent).style.overflow = 'hidden';
                }
            } else {
                document.body.appendChild(canvas);
            }

            return canvas;
        };

        CanvasUtils.setTransform = function (context, translateX, translateY, scaleX, scaleY, skewX, skewY) {
            context.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);

            return context;
        };

        CanvasUtils.setSmoothingEnabled = function (context, value) {
            context['imageSmoothingEnabled'] = value;
            context['mozImageSmoothingEnabled'] = value;
            context['oImageSmoothingEnabled'] = value;
            context['webkitImageSmoothingEnabled'] = value;
            context['msImageSmoothingEnabled'] = value;
            return context;
        };

        CanvasUtils.setImageRenderingCrisp = function (canvas) {
            canvas.style['image-rendering'] = 'crisp-edges';
            canvas.style['image-rendering'] = '-moz-crisp-edges';
            canvas.style['image-rendering'] = '-webkit-optimize-contrast';
            canvas.style.msInterpolationMode = 'nearest-neighbor';
            return canvas;
        };

        CanvasUtils.setImageRenderingBicubic = function (canvas) {
            canvas.style['image-rendering'] = 'auto';
            canvas.style.msInterpolationMode = 'bicubic';
            return canvas;
        };
        return CanvasUtils;
    })();
    Phaser.CanvasUtils = CanvasUtils;
})(Phaser || (Phaser = {}));
