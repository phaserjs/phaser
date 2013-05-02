/**
* Phaser - FX - Camera - Flash
*
* The camera is filled with the given color and returns to normal at the given duration.
*/
module Phaser.FX.Camera {
    class Flash {
        constructor(game: Game);
        private _game;
        private _fxFlashColor;
        private _fxFlashComplete;
        private _fxFlashDuration;
        private _fxFlashAlpha;
        /**
        * The camera is filled with this color and returns to normal at the given duration.
        *
        * @param	Color		The color you want to use in 0xRRGGBB format, i.e. 0xffffff for white.
        * @param	Duration	How long it takes for the flash to fade.
        * @param	OnComplete	An optional function you want to run when the flash finishes. Set to null for no callback.
        * @param	Force		Force an already running flash effect to reset.
        */
        public start(color?: number, duration?: number, onComplete?, force?: bool): void;
        public postUpdate(): void;
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
/**
* Phaser - FX - Camera - Template
*
* A Template FX file you can use to create your own Camera FX.
* If you don't use any of the methods below (i.e. preUpdate, render, etc) then DELETE THEM to avoid un-necessary calls by the FXManager.
*/
module Phaser.FX.Camera {
    class Template {
        constructor(game: Game, parent: Camera);
        private _game;
        private _parent;
        /**
        * You can name the function that starts the effect whatever you like, but we used 'start' in our effects.
        */
        public start(): void;
        /**
        * Pre-update is called at the start of the objects update cycle, before any other updates have taken place.
        */
        public preUpdate(): void;
        /**
        * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
        */
        public postUpdate(): void;
        /**
        * Pre-render is called at the start of the object render cycle, before any transforms have taken place.
        * It happens directly AFTER a canvas context.save has happened if added to a Camera.
        */
        public preRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        /**
        * render is called during the objects render cycle, right after all transforms have finished, but before any children/image data is rendered.
        */
        public render(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        /**
        * Post-render is called during the objects render cycle, after the children/image data has been rendered.
        * It happens directly BEFORE a canvas context.restore has happened if added to a Camera.
        */
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
/**
* Phaser - FX - Camera - Mirror
*
* Creates a mirror effect for a camera.
* Can mirror the camera image horizontally, vertically or both with an optional fill color overlay.
*/
module Phaser.FX.Camera {
    class Mirror {
        constructor(game: Game, parent: Camera);
        private _game;
        private _parent;
        private _canvas;
        private _context;
        private _sx;
        private _sy;
        private _mirrorX;
        private _mirrorY;
        private _mirrorWidth;
        private _mirrorHeight;
        private _mirrorColor;
        public flipX: bool;
        public flipY: bool;
        public x: number;
        public y: number;
        public cls: bool;
        /**
        * This is the rectangular region to grab from the Camera used in the Mirror effect
        * It is rendered to the Stage at Mirror.x/y (note the use of Stage coordinates, not World coordinates)
        */
        public start(x: number, y: number, region: Quad, fillColor?: string): void;
        /**
        * Post-render is called during the objects render cycle, after the children/image data has been rendered.
        * It happens directly BEFORE a canvas context.restore has happened if added to a Camera.
        */
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
/**
* Phaser - FX - Camera - Scanlines
*
* Give your game that classic retro feel!
*/
module Phaser.FX.Camera {
    class Scanlines {
        constructor(game: Game, parent: Camera);
        private _game;
        private _parent;
        public spacing: number;
        public color: string;
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
/**
* Phaser - FX - Camera - Shake
*
* A simple camera shake effect.
*/
module Phaser.FX.Camera {
    class Shake {
        constructor(game: Game, camera: Camera);
        private _game;
        private _parent;
        private _fxShakeIntensity;
        private _fxShakeDuration;
        private _fxShakeComplete;
        private _fxShakeOffset;
        private _fxShakeDirection;
        private _fxShakePrevX;
        private _fxShakePrevY;
        static SHAKE_BOTH_AXES: number;
        static SHAKE_HORIZONTAL_ONLY: number;
        static SHAKE_VERTICAL_ONLY: number;
        /**
        * A simple camera shake effect.
        *
        * @param	Intensity	Percentage of screen size representing the maximum distance that the screen can move while shaking.
        * @param	Duration	The length in seconds that the shaking effect should last.
        * @param	OnComplete	A function you want to run when the shake effect finishes.
        * @param	Force		Force the effect to reset (default = true, unlike flash() and fade()!).
        * @param	Direction	Whether to shake on both axes, just up and down, or just side to side (use class constants SHAKE_BOTH_AXES, SHAKE_VERTICAL_ONLY, or SHAKE_HORIZONTAL_ONLY).
        */
        public start(intensity?: number, duration?: number, onComplete?, force?: bool, direction?: number): void;
        public postUpdate(): void;
        public preRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
/**
* Phaser - FX - Camera - Fade
*
* The camera is filled with the given color and returns to normal at the given duration.
*/
module Phaser.FX.Camera {
    class Fade {
        constructor(game: Game);
        private _game;
        private _fxFadeColor;
        private _fxFadeComplete;
        private _fxFadeDuration;
        private _fxFadeAlpha;
        /**
        * The camera is gradually filled with this color.
        *
        * @param	Color		The color you want to use in 0xRRGGBB format, i.e. 0xffffff for white.
        * @param	Duration	How long it takes for the flash to fade.
        * @param	OnComplete	An optional function you want to run when the flash finishes. Set to null for no callback.
        * @param	Force		Force an already running flash effect to reset.
        */
        public start(color?: number, duration?: number, onComplete?, force?: bool): void;
        public postUpdate(): void;
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
