/// <reference path="../_definitions.ts" />

/**
* Phaser - CanvasUtils
*
* A collection of methods useful for manipulating canvas objects.
*/

module Phaser {

    export class CanvasUtils {

        public static getAspectRatio(canvas: HTMLCanvasElement): number {
            return canvas.width / canvas.height;
        }

        public static setBackgroundColor(canvas: HTMLCanvasElement, color: string = 'rgb(0,0,0)'): HTMLCanvasElement {

            canvas.style.backgroundColor = color;
            return canvas;

        }

        public static setTouchAction(canvas: HTMLCanvasElement, value: string= 'none'): HTMLCanvasElement {

            canvas.style.msTouchAction = value;
            canvas.style['ms-touch-action'] = value;
            canvas.style['touch-action'] = value;

            return canvas;

        }

        public static addToDOM(canvas: HTMLCanvasElement, parent: string = '', overflowHidden: boolean = true): HTMLCanvasElement {

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

        }

        public static setTransform(context: CanvasRenderingContext2D, translateX: number, translateY: number, scaleX: number, scaleY: number, skewX: number, skewY: number): CanvasRenderingContext2D {

            context.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);

            return context;

        }

        public static setSmoothingEnabled(context: CanvasRenderingContext2D, value: boolean): CanvasRenderingContext2D {

            context['imageSmoothingEnabled'] = value;
            context['mozImageSmoothingEnabled'] = value;
            context['oImageSmoothingEnabled'] = value;
            context['webkitImageSmoothingEnabled'] = value;
            context['msImageSmoothingEnabled'] = value;
            return context;

        }

        public static setImageRenderingCrisp(canvas: HTMLCanvasElement): HTMLCanvasElement {

            canvas.style['image-rendering'] = 'crisp-edges';
            canvas.style['image-rendering'] = '-moz-crisp-edges';
            canvas.style['image-rendering'] = '-webkit-optimize-contrast';
            canvas.style.msInterpolationMode = 'nearest-neighbor';
            return canvas;

        }

        public static setImageRenderingBicubic(canvas: HTMLCanvasElement): HTMLCanvasElement {

            canvas.style['image-rendering'] = 'auto';
            canvas.style.msInterpolationMode = 'bicubic';
            return canvas;

        }

    }

}