module Phaser {

    /**
    * Constants used to define game object types (faster than doing typeof object checks in core loops)
    */
    export class Types {

        static RENDERER_AUTO_DETECT: number = 0;
        static RENDERER_HEADLESS: number = 1;
        static RENDERER_CANVAS: number = 2;
        static RENDERER_WEBGL: number = 3;

        static GROUP: number = 0;
        static SPRITE: number = 1;
        static GEOMSPRITE: number = 2;
        static PARTICLE: number = 3;
        static EMITTER: number = 4;
        static TILEMAP: number = 5;
        static SCROLLZONE: number = 6;

        static GEOM_POINT: number = 0;
        static GEOM_CIRCLE: number = 1;
        static GEOM_RECTANGLE: number = 2;
        static GEOM_LINE: number = 3;
        static GEOM_POLYGON: number = 4;

    }

}
