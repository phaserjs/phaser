module Phaser.FX.Camera {
    class Flash {
        constructor(game: Game);
        private _game;
        private _fxFlashColor;
        private _fxFlashComplete;
        private _fxFlashDuration;
        private _fxFlashAlpha;
        public start(color?: number, duration?: number, onComplete?, force?: bool): void;
        public postUpdate(): void;
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
module Phaser.FX.Camera {
    class Border {
        constructor(game: Game, parent: Camera);
        private _game;
        private _parent;
        public showBorder: bool;
        public borderColor: string;
        public start(): void;
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
module Phaser.FX.Camera {
    class Template {
        constructor(game: Game, parent: Camera);
        private _game;
        private _parent;
        public start(): void;
        public preUpdate(): void;
        public postUpdate(): void;
        public preRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        public render(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
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
        public start(x: number, y: number, region: Rectangle, fillColor?: string): void;
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
module Phaser.FX.Camera {
    class Shadow {
        constructor(game: Game, parent: Camera);
        private _game;
        private _parent;
        public showShadow: bool;
        public shadowColor: string;
        public shadowBlur: number;
        public shadowOffset: Point;
        public start(): void;
        public preRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        public render(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
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
        public start(intensity?: number, duration?: number, onComplete?, force?: bool, direction?: number): void;
        public postUpdate(): void;
        public preRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
module Phaser.FX.Camera {
    class Fade {
        constructor(game: Game);
        private _game;
        private _fxFadeColor;
        private _fxFadeComplete;
        private _fxFadeDuration;
        private _fxFadeAlpha;
        public start(color?: number, duration?: number, onComplete?, force?: bool): void;
        public postUpdate(): void;
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
