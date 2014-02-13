declare class SAT {

    flattenPointsOn(points: Array<SAT.Vector>, normal: SAT.Vector, result: Array<number>): Array<number>;
    isSeparatingAxis(aPos: SAT.Vector, bPos: SAT.Vector, aPoints: Array<SAT.Vector>, bPoints: Array<SAT.Vector>, axis: SAT.Vector, response: SAT.Response): boolean;
    vornoiRegion(line: SAT.Vector, point: SAT.Vector): number;
    testCircleCircle(a: SAT.Circle, b: SAT.Circle, response: SAT.Response): boolean;
    testPolygonCircle(a: SAT.Polygon, b: SAT.Circle, response: SAT.Response): boolean;
    testCirclePolygon(a: SAT.Circle, b: SAT.Polygon, response: SAT.Response): boolean;
    testPolygonPolygon(a: SAT.Polygon, b: SAT.Polygon, response: SAT.Response): boolean;

}

declare module SAT {

    class Vector {
        constructor(x: number, y: number);
        x: number;
        y: number;
        copy(other: SAT.Vector): SAT.Vector;
        perp(): SAT.Vector;
        rotate(angle: number): SAT.Vector;
        rotatePrecalc(sin: number, cos: number): SAT.Vector;
        reverse(): SAT.Vector;
        normalize(): SAT.Vector;
        add(other: SAT.Vector): SAT.Vector;
        sub(other: SAT.Vector): SAT.Vector;
        scale(x: number, y: number): SAT.Vector;
        project(other: SAT.Vector): SAT.Vector;
        projectN(other: SAT.Vector): SAT.Vector;
        reflect(axis: SAT.Vector): SAT.Vector;
        reflectN(axis: SAT.Vector): SAT.Vector;
        dot(other: SAT.Vector): SAT.Vector;
        len2(): SAT.Vector;
        len(): SAT.Vector;
    }

    class Circle {
        constructor(pos: SAT.Vector, radius: number);
        pos: SAT.Vector;
        r: number;
    }

    class Polygon {
        constructor(pos: SAT.Vector, points: Array<SAT.Vector>);
        pos: SAT.Vector;
        points: Array<SAT.Vector>;
        recalc(): SAT.Polygon;
        rotate(angle: number): SAT.Polygon;
        scale(x: number, y: number): SAT.Polygon;
        translate(x: number, y: number): SAT.Polygon;
    }

    class Box {
        constructor(pos: SAT.Vector, w: number, h: number);
        pos: SAT.Vector;
        w: number;
        h: number;
        toPolygon(): SAT.Polygon;
    }

    class Response {
        constructor();
        a: any;
        b: any;
        overlapN: SAT.Vector;
        overlapV: SAT.Vector;
        clear(): SAT.Response;
        aInB: boolean;
        bInA: boolean;
        overlap: number;
    }
}

declare class Phaser {

    static VERSION: string;
    static DEV_VERSION: string;
    static GAMES: Phaser.Game[];

    static AUTO: number;
    static CANVAS: number;
    static WEBGL: number;
    static HEADLESS: number;

    static SPRITE: number;
    static BUTTON: number;
    static BULLET: number;
    static GRAPHICS: number;
    static TEXT: number;
    static TILESPRITE: number;
    static BITMAPTEXT: number;
    static GROUP: number;
    static RENDERTEXTURE: number;
    static TILEMAP: number;
    static TILEMAPLAYER: number;
    static EMITTER: number;
    static POLYGON: number;
    static BITMAPDATA: number;
    static CANVAS_FILTER: number;
    static WEBGL_FILTER: number;

    static NONE: number;
    static LEFT: number;
    static RIGHT: number;
    static UP: number;
    static DOWN: number;

    static CANVAS_PX_ROUND: boolean;
    static CANVAS_CLEAR_RECT: boolean;
}

declare module Phaser {

    class Animation {
        //constructor
        constructor(game: Phaser.Game, parent: Phaser.Sprite, name: string, frameData: Phaser.FrameData, frames: string[], delay: number, looped: boolean);
        constructor(game: Phaser.Game, parent: Phaser.Sprite, name: string, frameData: Phaser.FrameData, frames: number[], delay: number, looped: boolean);
        //properties
        currentFrame: Phaser.Frame;
        delay: number;
        frame: number;
        frameTotal: number;
        game: Phaser.Game;
        isFinished: boolean;
        isPaused: boolean;
        isPlaying: boolean;
        killOnComplete: boolean;
        looped: boolean;
        name: string;
        paused: boolean;
        //static methods
        static generateFrameNames(prefix: string, start: number, stop: number, suffix?: string, zeroPad?: number);
        //methods
        destroy(): void;
        onComplete(): void;
        play(frameRate?: number, loop?: boolean, killOnComplete?: boolean): Phaser.Animation;
        restart(): void;
        stop(resetFrame?: boolean): void;
        update(): boolean;
    }

    class AnimationManager {
        //constructor
        constructor(sprite: Phaser.Sprite);
        //members
        currentFrame: Phaser.Frame;
        frame: number;
        frameData: Phaser.FrameData;
        frameName: string;
        frameTotal: number;
        game: Phaser.Game;
        isLoaded: boolean;
        paused: boolean;
        sprite: Phaser.Sprite;
        updateIfVisible: boolean;
        //methods
        add(name: string, frames?: number[], frameRate?: number, loop?: boolean, useNumericIndex?: boolean): Phaser.Animation;
        add(name: string, frames?: string[], frameRate?: number, loop?: boolean, useNumericIndex?: boolean): Phaser.Animation;
        destroy(): void;
        getAnimation(name: string): Phaser.Animation;
        loadFrameData(frameData: Phaser.FrameData): void;
        play(name: string, frameRate?: number, loop?: boolean): Phaser.Animation;
        refreshFrame();
        stop(name?: string, resetFrame?: boolean): void;
        update(): boolean;
        validateFrames(frames: Phaser.Frame[], useNumericIndex?: boolean): boolean;
    }

    class AnimationParser {
        //static methods
        static JSONData(game: Phaser.Game, json: Object, cacheKey: string): Phaser.FrameData;
        static JSONDataHash(game: Phaser.Game, json: Object, cacheKey: string): Phaser.FrameData;
        static spriteSheet(game: Phaser.Game, key: string, frameWidth: number, frameHeight: number, frameMax?: number, margin?: number, spacing?: number): Phaser.FrameData;
        static XMLData(game: Phaser.Game, xml: Object, cacheKey: string): Phaser.FrameData;
    }

    class BitmapData {
        //constructor
        constructor(game: Phaser.Game, width?: number, height?: number);
        //members
        baseTexture: any;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        game: Phaser.Game;
        height: number;
        imageData: any[];
        name: string;
        pixels: number;
        texture: any;
        textureFrame: Phaser.Frame;
        type: number;
        width: number;
        //methods
        add(sprite: Phaser.Sprite): void;
        addTo(sprites: Phaser.Sprite[]): void;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean):Phaser.BitmapData;
        arcTo(x1: number, y1: number, x2: number, y2: number): Phaser.BitmapData;
        beginFill(color: string): Phaser.BitmapData;
        beginLinearGradientFill(colors: string[], ratios: number[], x0: number, y0: number, x1: number, y1: number): Phaser.BitmapData;
        beginPath(): Phaser.BitmapData;
        beginRadialGradientStroke(colors: string[], ratios: number[], x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): Phaser.BitmapData;
        beginStoke(color: string): Phaser.BitmapData;
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): Phaser.BitmapData;
        circle(x: number, y: number, radius: number): Phaser.BitmapData;
        clear(): void;
        clearRect(x: number, y: number, width: number, height: number): Phaser.BitmapData;
        clip(): Phaser.BitmapData;
        closePath(): Phaser.BitmapData;
        createLinearGradient(x: number, y: number, width: number, height: number): CanvasGradient;
        createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
        ellipse(x: number, y: number, w: number, h: number): Phaser.BitmapData;
        fill(): Phaser.BitmapData;
        fllRect(x: number, y: number, width: number, height: number): Phaser.BitmapData;
        fillStyle(color: string): Phaser.BitmapData;
        font(font: any): Phaser.BitmapData;
        getPixel(x: number, y: number): number;
        getPixel32(x: number, y: number): number;
        getPixels(rect: Phaser.Rectangle): number[];
        globalAlpha(alpha: number): Phaser.BitmapData;
        globalCompositeOperation(operation: any): Phaser.BitmapData;
        lineCap(style: any): Phaser.BitmapData;
        lineDashOffset(offset: number): Phaser.BitmapData;
        lineJoin(join: any): Phaser.BitmapData;
        lineTo(x: number, y: number): Phaser.BitmapData;
        lineWidth(width: number): Phaser.BitmapData;
        miterLimit(limit: number): Phaser.BitmapData;
        moveTo(x: number, y: number): Phaser.BitmapData;
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): Phaser.BitmapData;
        rect(x: number, y: number, width: number, height: number): Phaser.BitmapData;
        render(): void;
        restore(): Phaser.BitmapData;
        rotate(angle: number): void;
        save(): Phaser.BitmapData;
        scale(x: number, y: number): Phaser.BitmapData;
        scrollPathIntoView(): Phaser.BitmapData;
        setPixel(x: number, y: number, red: number, green: number, blue: number): void;
        setPixel32(x: number, y: number, red: number, green: number, blue: number, alpha: number): void;
        setStrokeStyle(thickness: number, caps?: string, joints?: string, miterLimit?: number, ignoreScale?: boolean): Phaser.BitmapData;
        setStrokeStyle(thickness: number, caps?: number, joints?: number, miterLimit?: number, ignoreScale?: boolean): Phaser.BitmapData;
        stroke(): Phaser.BitmapData;
        strokeRect(x: number, y: number, width: number, height: number): Phaser.BitmapData;
        strokeStyle(style: string): Phaser.BitmapData;
    }

    class BitmapText extends Phaser.Text {
        //constructor
        constructor(game: Phaser.Game, x?: number, y?: number, text?: string, style?: Object);
        //members
        alive: boolean;
        anchor: Phaser.Point;
        angle: number;
        exists: boolean;
        game: Phaser.Game;
        group: Phaser.Group;
        name: string;
        scale: Phaser.Point;
        type: number;
        x: number;
        y: number;
        //still valid member? It is not in the JS
        renderable: boolean;
        //methods
        update(): void;
    }

    class Button extends Phaser.Sprite {
        //constructor
        constructor(game: Phaser.Game, x?: number, y?: number, key?: string, callback?: Function, callbackContext?: Object, overFrame?: string, outFrame?: string, downFrame?: string, upFrame?: string);
        constructor(game: Phaser.Game, x?: number, y?: number, key?: string, callback?: Function, callbackContext?: Object, overFrame?: number, outFrame?: number, downFrame?: number, upFrame?: number);
        //members
        forceOut: boolean;
        freezeFrames: boolean;
        onDownSound: Phaser.Sound;
        onDownSoundMarker: string;
        onInputDown: Phaser.Signal;
        onInputOut: Phaser.Signal;
        onInputOver: Phaser.Signal;
        onInputUp: Phaser.Signal;
        onOutSound: Phaser.Sound;
        onOutSoundMarker: string;
        onOverSound: Phaser.Sound;
        onOverSoundMarker: string;
        onUpSound: Phaser.Sound;
        onUpSoundMaker: string;
        type: number;
        //methods
        clearFrames(): void;
        setDownSound(sound: Phaser.Sound, marker?: string): void;
        setFrames(overFrame?: string, outFrame?: string, downFrame?: string, upFrame?: string): void;
        setFrames(overFrame?: number, outFrame?: number, downFrame?: number, upFrame?: number): void;
        setOutSound(sound: Phaser.Sound, marker?: string): void;
        setOverSound(sound: Phaser.Sound, marker?: string): void;
        setSounds(overSound?: Phaser.Sound, overMarker?: string, downSound?: Phaser.Sound, downMarker?: string, outSound?: Phaser.Sound, outMarker?: string, upSound?: Phaser.Sound, upMarker?: string): void;
    }

    class Cache {
        //constructor
        constructor(game: Phaser.Game);
        //members
        game: Phaser.Game;
        onSoundUnlock: Phaser.Signal;
        //methods
        addBinary(key: string, binaryData: Object): void;
        addBitmapData(key: string, bitmapData: Phaser.BitmapData): Phaser.BitmapData;
        addBitmapFont(key: string, url: string, data: Object, xmlData: Object): void;
        addCanvas(key: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void;
        addDefaultImage(): void;
        addImage(key: string, url: string, data: Object): void;
        addMisingImage(): void;
        addRenderTexture(key: string, texture: RenderTexture): void;
        addSound(key: string, url: string, data: Object, webAudio: boolean, audioTag: boolean): void;
        addSpriteSheet(key: string, url: string, data: Object, frameWidth: number, frameHeight: number, frameMax?: number, margin?: number, spacing?: number): void;
        addText(key: string, url: string, data: Object): void;
        addTextureAtlas(key: string, url: string, data: Object, atlasData: Object, format: number): void;
        addTilemap(key: string, url: string, mapData: Object, format: number): void;
        checkImageKey(key: string): boolean;
        decodedSound(key: string, data: Object): void;
        destroy(): void;
        getBinary(key: string): Object;
        getBitmapData(key: string): Phaser.BitmapData;
        getCanvas(key: string): Object;
        getFrame(key: string): Phaser.Frame;
        getFrameByIndex(key: string, frame: string): Phaser.Frame;
        getFrameByName(key: string, frame: string): Phaser.Frame;
        getFrameData(key: string): Phaser.FrameData;
        getImage(key: string): Object;
        getImageKeys(): string[];
        getKeys(array: string[]): string[];
        getSound(key: string): Phaser.Sound;
        getSoundData(key: string): Object;
        getSoundKeys(): string[];
        getText(key: string): Object;
        getTextKeys(): string[];
        getTexture(key: string): Phaser.RenderTexture;
        getTextureFrame(key: string): Phaser.Frame;
        getTilemap(key: string): Phaser.Tilemap;
        isSoundDecoded(key: string): boolean;
        isSoundReady(key: string): boolean;
        isSpriteSheet(key: string): boolean;
        reloadSound(key: string): void;
        reloadSoundComplete(key: string): void;
        removeCanvas(key: string): void;
        removeImage(key: string): void;
        removeSound(key: string): void;
        removeText(key: string): void;
        updateSound(key: string, property: string, value: Phaser.Sound): void;
    }

    class Camera {
        //constructor
        constructor(game: Phaser.Game, id: number, x: number, y: number, width: number, height: number);
        //static members
        static FOLLOW_LOCKON: number;
        static FOLLOW_PLATFORMER: number;
        static FOLLOW_TOPDOWN: number;
        static FOLLOW_TOPDOWN_TIGHT: number;
        //members
        atLimit: { x: boolean; y: boolean; };
        bounds: Phaser.Rectangle;
        deadzone: Phaser.Rectangle;
        displayObject: Object;
        game: Phaser.Game;
        height: number;
        id: number;
        screenView: Phaser.Rectangle;
        target: Phaser.Sprite;
        view: Phaser.Rectangle;
        visible: boolean;
        width: number;
        world: Phaser.World;
        x: number;
        y: number;
        //methods
        checkWorldBounds(): void;
        focusOn(displayObject: any): void;
        focusOnXY(x: number, y: number): void;
        follow(target: Phaser.Sprite, style?: number): void;
        setBoundsToWorld(): void;
        setPosition(x: number, y: number): void;
        setSize(width: number, height: number): void;
        update(): void;
    }

    class Canvas {
        //static methods
        static addToDOM(canvas: HTMLCanvasElement, parent: string, overflowHidden?: boolean): HTMLCanvasElement;
        static addToDOM(canvas: HTMLCanvasElement, parent: HTMLCanvasElement, overflowHidden?: boolean): HTMLCanvasElement;
        static create(width?: number, height?: number, id?: string): HTMLCanvasElement;
        static getAspectRatio(canvas: HTMLCanvasElement): number;
        static getOffset(element: HTMLElement, point?: Phaser.Point): Phaser.Point;
        static setBackgroundColor(canvas: HTMLCanvasElement, color: string): HTMLCanvasElement;
        static setImageRenderingBicubic(canvas: HTMLCanvasElement): HTMLCanvasElement;
        static setImageRenderingCrisp(canvas: HTMLCanvasElement): HTMLCanvasElement;
        static setSmoothingEnabled(context: CanvasRenderingContext2D, value: boolean): CanvasRenderingContext2D;
        static setTouchAction(canvas: HTMLCanvasElement, value: string): HTMLCanvasElement;
        static setTransform(context: CanvasRenderingContext2D, translateX: number, translateY: number, scaleX: number, scaleY: number, skewX: number, skewY: number): CanvasRenderingContext2D;
        static setUserSelect(canvas: HTMLCanvasElement, value?: string): HTMLCanvasElement;
    }

    class Circle {
        //constructor
        constructor(x?: number, y?: number, diameter?: number);
        //members
        area: number;
        bottom: number;
        diameter: number;
        empty: boolean;
        left: number;
        radius: number;
        right: number;
        top: number;
        x: number;
        y: number;
        //static methods
        static circumferencePoint(a: Phaser.Circle, angle: number, asDegrees: boolean, output?: Phaser.Point): Phaser.Point;
        static contains(a: Phaser.Circle, x: number, y: number): boolean;
        static equals(a: Phaser.Circle, b: Phaser.Circle): boolean;
        static intersects(a: Phaser.Circle, b: Phaser.Circle): boolean;
        static intersectsRectangle(c: Phaser.Circle, r: Phaser.Rectangle): boolean;
        //methods
        circumference(): number;
        circumferencePoint(angle: number, asDegrees: number, output?: Phaser.Point): Phaser.Point;
        clone(out: Phaser.Circle): Phaser.Circle;
        contains(x: number, y: number): boolean;
        copyFrom(source: any): Circle;
        copyTo(dest: Object): Object;
        distance(dest: Object, round?: boolean): number;
        offset(dx: number, dy: number): Phaser.Circle;
        offsetPoint(point: Phaser.Point): Phaser.Circle;
        setTo(x: number, y: number, diameter: number): Circle;
        toString(): string;
    }

    class Color {
        //static methods
        static colorToHexstring(color: number): string;
        static getAlpha(color: number): number;
        static getAlphaFloat(color: number): number;
        static getBlue(color: number): number;
        static getColor(red: number, green: number, blue: number): number;
        static getColor32(alpha: number, red: number, green: number, blue: number): number;
        static getColorInfo(color: number): string;
        static getGreen(color: number): number;
        static getRandomColor(min?: number, max?: number, alpha?: number): number;
        static getRed(color: number): number;
        static getRGB(color: number): Object;
        static getWebRGB(color: number): string;
        static hexToRGB(h: string): number;
        static interpolateColor(color1: number, color2: number, steps: number, currentStep: number, alpha: number): number;
        static interpolateColorWithRGB(color: number, r: number, g: number, b: number, steps: number, currentStep: number): number;
        static interpolateRGB(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, steps: number, currentStep: number): number;
        static RGBtoHexstring(color: number): string;
        static RGBtoWebstring(color: number): string;
    }

    interface CursorKeys {
        up: Phaser.Key;
        down: Phaser.Key;
        left: Phaser.Key;
        right: Phaser.Key;
    }   

    class Device {
        //members
        android: boolean;
        arora: boolean;
        audioData: boolean;
        canvas: boolean;
        chrome: boolean;
        chromeOS: boolean;
        cocoonJS: boolean;
        css3D: boolean;
        desktop: boolean;
        ejecta: boolean;
        epiphany: boolean;
        file: boolean;
        fileSystem: boolean;
        firefox: boolean;
        ie: boolean;
        ieVersion: number;
        iOS: boolean;
        iPad: boolean;
        iPhone: boolean;
        iPhone4: boolean;
        linux: boolean;
        littleEndian: boolean;
        localStorage: boolean;
        m4a: boolean;
        macOS: boolean;
        midori: boolean;
        mobileSafari: boolean;
        mp3: boolean;
        mspointer: boolean;
        ogg: boolean;
        opera: boolean;
        opus: boolean;
        patchAndroidClearRect: boolean;
        pixelRatio: number;
        pointerLock: boolean;
        quirksMode: boolean;
        safari: boolean;
        silk: boolean;
        touch: boolean;
        trident: boolean;
        tridentVersion: number;
        typedArray: boolean;
        vibration: boolean;
        wav: boolean;
        webApp: boolean;
        webAudio: boolean;
        webGL: boolean;
        webm: boolean;
        windows: boolean;
        worker: boolean;
        //methods
        canPlayAudio(type: string): boolean;
        isConsoleOpen(): boolean;
    }

    class DOMSprite {
        //constructor
        constructor(game: Phaser.Game, id: string, x: number, y: number, text: string, style: Object);
        //members
        alive: boolean;
        exists: boolean;
        game: Phaser.Game;
        group: Phaser.Group;
        name: string;
        type: number;
        visible: boolean;
    }

    module Easing {

        class Back {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

        class Bounce {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

        class Circular {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

        class Cubic {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

        class Elastic {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

        class Exponential {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

        class Linear {
            static None(k: number): number;
        }

        class Quadratic {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

        class Quartic {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

        class Quintic {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

        class Sinusoidal {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }
    }

    class Events {
        //constuctor
        constructor(sprite: Phaser.Sprite);
        //methods
        parent: Phaser.Sprite;
        onAddedToGroup: Phaser.Signal;
        onRemovedFromGroup: Phaser.Signal;
        onKilled: Phaser.Signal;
        onRevived: Phaser.Signal;
        onOutOfBounds: Phaser.Signal;
        onInputOver: Phaser.Signal;
        onInputOut: Phaser.Signal;
        onInputDown: Phaser.Signal;
        onInputUp: Phaser.Signal;
        onDragStart: Phaser.Signal;
        onDragStop: Phaser.Signal;
        onAnimationStart: Phaser.Signal;
        onAnimationComplete: Phaser.Signal;
        onAnimationLoop: Phaser.Signal;
        onBeginContact: Phaser.Signal;
        onEndContact: Phaser.Signal;
    }

    class Filter {
        //constructor
        constructor(game: Phaser.Game, uniforms: Object, fragmentSrc: any[]);
        //members
        dirty: boolean;
        fragmentSrc: any[];
        game: Phaser.Game;
        height: number;
        padding: number;
        type: number;
        uniform: Object;
        width: number;
        //methods
        destroy(): void;
        init(): void;
        setResolution(width: number, height: number);
        update(pointer?: Phaser.Pointer): void;
    }

    class Frame {
        //constructor
        constructor(index: number, x: number, y: number, width: number, height: number, name: string, uuid: string);
        //members
        centerX: number;
        centerY: number;
        distance: number;
        height: number;
        index: number;
        name: string;
        rotated: boolean;
        rotationDirection: string;
        sourceSizeH: number;
        sourceSizeW: number;
        spriteSourcesizeH: number;
        spriteSourceSizeW: number;
        spriteSourceSizeX: number;
        spriteSourceSizeY: number;
        trimmed: boolean;
        uuid: string;
        width: number;
        x: number;
        y: number;
        //methods      
        setTrim(trimmed: boolean, actualWidth: number, actualHeight: number, destX: number, destY: number, destWidth: number, destHeight: number): void;
    }

    class FrameData {
        //members
        total: number;
        //methods
        addFrame(frame: Frame): Phaser.Frame;
        checkFrameName(name: string): boolean;
        getFrame(index: number): Phaser.Frame;
        getFrameByName(name: string): Phaser.Frame;
        getFrameIndexes(frames: number[], useNumericIndex?: boolean, output?: number[]): number[]
        getFrameRange(start: number, end: number, output: Phaser.Frame[]): Phaser.Frame[];
        getFrames(frames: number[], useNumericIndex?: boolean, output?: Phaser.Frame[]): Phaser.Frame[];
        //this method no longer exists and can be deleted?
        checkFrame(name: string): boolean;
    }

    class Game {
        //constructor
        constructor(width?: number, height?: number, renderer?: number, parent?: string, state?: Object, transparent?: boolean, antialias?: boolean);
        constructor(width?: number, height?: number, renderer?: number, parent?: HTMLElement, state?: Object, transparent?: boolean, antialias?: boolean);
        //members
        add: Phaser.GameObjectFactory;
        antialias: boolean;
        cache: Phaser.Cache;
        camera: Phaser.Camera;
        canvas: HTMLCanvasElement;
        config: Object;
        context: Object;
        debug: Phaser.Utils.Debug;
        device: Phaser.Device;
        height: number;
        id: number;
        input: Phaser.Input;
        isBooted: boolean;
        isRunning: boolean;
        load: Phaser.Loader;
        math: Phaser.Math;
        net: Phaser.Net;
        parent: HTMLElement;
        particles: Phaser.Particles;
        paused: boolean;
        pendingStep: boolean;
        physics: Phaser.Physics.Arcade
        raf: Phaser.RequestAnimationFrame;
        renderer: number;
        renderType: number;
        rnd: Phaser.RandomDataGenerator;
        sound: Phaser.SoundManager;
        stage: Phaser.Stage;
        state: Phaser.StateManager;
        stepCount: number;
        stepping: boolean;
        time: Phaser.Time;
        transparent: boolean;
        tweens: Phaser.TweenManager;
        width: number;
        world: Phaser.World;
        //methods
        boot(): void;
        destroy(): void;
        disableStep(): void;
        enableStep(): void;
        loadComplete(): void;
        parseConfig(): void;
        parseDimensions(): void;
        setUpRenderer(): void;
        showDebugHeader(): void;
        step();
        update(time: number): void;
    }

    class GameObjectFactory {
        //constructor
        constructor(game: Phaser.Game);
        //members
        game: Phaser.Game;
        world: Phaser.World;
        //methods
        audio(key: string, volume?: number, loop?: boolean, connect?: boolean): Phaser.Sound;
        bitmapData(width?: number, height?: number): Phaser.BitmapData;
        bitmapText(x: number, y: number, text: string, style: Object, group?: Phaser.Group): Phaser.BitmapText;
        button(x?: number, y?: number, key?: string, callback?: Function, callbackContext?: Object, overFrame?: any, outFrame?: any, downFrame?: any, upFrame?: any, group?: Phaser.Group): Phaser.Button;
        child(parent: any, x: number, y: number, key?: any, frame?: any): Phaser.Sprite;
        emitter(x?: number, y?: number, maxParticles?: number): Phaser.Particles.Arcade.Emitter;
        existing(object: any): any;
        filter(filer: string, args: any): Phaser.Filter;
        graphics(x: number, y: number, group?: Phaser.Group): Phaser.Graphics;
        group(parent?: any, name?: string): Phaser.Group;
        renderTexture(key: string, width: number, height: number): Phaser.RenderTexture;
        sound(key: string, volume?: number, loop?: number, connect?: boolean): Phaser.Sound; 
        sprite(x: number, y: number, key?: any, frame?: any, group?: Phaser.Group): Phaser.Sprite;
        text(x: number, y: number, text: string, style: any, group?: Phaser.Group): Phaser.Text;
        tilemap(key: string, tilesets: any): Phaser.Tilemap;
        tileSprite(x: number, y: number, width: number, height: number, key?: any, group?: Phaser.Group): Phaser.TileSprite;
        tween(obj: Object): Phaser.Tween;
    }

    class GamePad {
        //constructor
        constructor(game: Phaser.Game);
        //members
        active: boolean;
        callbackContext: Object;
        disable: boolean;
        game: Phaser.Game;
        onAxisCallBack: Function;
        onConnectCallback: Function;
        onDisconnectCallback: Function;
        onDownCallback: Function;
        onFloatCallback: Function;
        onUpCallback: Function;
        pad1: boolean;
        pad2: boolean;
        pad3: boolean;
        pad4: boolean;
        padsConnected: boolean;
        supported: boolean;
        //methods
        addCallbacks(context: Object, callbacks: Object): void;
        isDown(buttonCode: number): boolean;
        justPressed(buttonCode: number, duration?: number): boolean;
        reset(): void;
        setDeadZones(): void;
        start();
        stop();
    }

    class GamepadButton {
        //constuctor
        constructor(game: Phaser.Game, buttonCode: number);
        //members
        buttonCode: number;
        duration: number;
        game: Phaser.Game;
        isDown: boolean;
        isUp: boolean;
        onDown: boolean;
        onFloat: Phaser.Signal;
        onUp: Phaser.Signal;
        repeats: number;
        timeDown: number;
        timeUp: number;
        value: number;
        //methods
        justPressed(duration?: number): boolean;
        processButtonDown(value: Object): void;
        processButtonFloat(value: Object): void;
        processButtonUp(value: Object): void;
    }

    // Actually extends PIXI.Graphics but we skip the abstraction here, since pixi is "part" of phaser
    // PIXI.Graphics extends PIXI.DisplayObjectContainer extends DisplayObject
    class Graphics extends Phaser.Sprite {
        //constructor
        constructor(game: Phaser.Game, x: number, y: number);
        //members
        angle: number;
        x: number;
        y: number;
        //methods
        lineStyle(lineWidth: number, color?: number, alpha?: number): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        beginFill(color: number, alpha?: number): void;
        endFill(): void;
        drawRect(x: number, y: number, width: number, height: number): void;
        drawCircle(x: number, y: number, radius: number): void;
        drawElipse(x: number, y: number, width: number, height: number): void;
        clear(): void;
        updateFilterBounds(): void;
    }

    // Wraps a PIXI.DisplayObjectContainer
    class Group {
        //constructor
        constructor(game: Phaser.Game, parent?: any, name?: string, useStage?: boolean);
        //static members
        static RETURN_CHILD: number;
        static RETURN_NONE: number;
        static RETURN_TOTAL: number;
        static SORT_ASCENDING: number;
        static SORT_DESCENDING: number;
        //members
        alive: boolean;
        alpha: number;
        angle: number;
        cursor: any;
        exists: boolean;
        game: Phaser.Game;
        group: Phaser.Group;
        length: number;
        name: string;
        pivot: Phaser.Point;
        rotation: number;
        scale: Phaser.Point;
        total: number;
        type: number;
        visible: boolean;
        x: number;
        y: number;
        //methods
        add(child: any): any;
        addAll(property: string, amount: number, checkAlive: boolean, checkVisible: boolean): void
        addAt(child: any, index: number): any;
        bringToTop(child: any): any;
        callAll(callback: string, callbackContext?: Object, parameter?: any): void;
        callAllExists(callback: Function, callbackContext: Object, existsValue: boolean): void;
        callbackFromArray(child: Object, callback: Function, callbackContext: Object, length: number): void;
        childTest(): void;
        countDead(): number;
        countLiving(): number;
        create(x: number, y: number, key: string, frame?: any, exists?: boolean): Phaser.Sprite;
        createMultiple(quantity: number, key: string, frame?: any, exists?: boolean): Phaser.Sprite;
        destroy(destroyChildren?: boolean): void;
        divideAll(property: string, amount: number, checkAlive?: boolean, checkVisible?: boolean): void;
        forEach(callback: Function, callbackContext: Object, checkExists: boolean): void;
        forEachAlive(callback: Function, callbackContext: Object): void;
        forEachDead(callback: Function, callbackContext: Object): void;
        getAt(index: number): any;
        getFirstAlive(): any;
        getFirstDead(): any;
        getFirstExists(state: boolean): any;
        getIndex(child: any): number;
        getRandom(startIndex: number, length: number): any;
        iterate(key: string, value: any, returnType: number, callback?: Function, callbackContext?: Object): any;
        multiplyAll(property: string, amount: number, checkAlive: boolean, checkVisible: boolean): void;
        next(): void;
        previous(): void;
        remove(child: any): boolean;
        removeAll(): void;
        removeBetween(startIndex: number, endIndex: number): void;
        replace(oldChild: any, newChild: any): void;
        set(child: Phaser.Sprite, key: string, value: any, checkAlive?: boolean, checkVisible?: boolean, operation?: number)
        setAll(key: string, value: any, checkAlive?: boolean, checkVisible?: boolean, operation?: number): void;
        setProperty(child: any, key: string[], value: any, operation?: number): void;
        sort(index?: string, order?: number): void;
        subAll(property: string, amount: number, checkAlive: boolean, checkVisible: boolean): void;
        swap(child1: any, child2: any): boolean;
        swapIndex();
    }

    class Input {
        //constructor
        constructor(game: Phaser.Game);
        //static members
        static MOUSE_OVERRIDES_TOUCH: number;
        static MOUSE_TOUCH_COMBINE: number;
        static TOUCH_OVERRIDES_MOUSE: number;
        //members
        activePointer: Phaser.Pointer;
        circle: Phaser.Circle;
        currentPointers: number;
        disabled: boolean;
        doubleTapRate: number;
        game: Phaser.Game;
        gamepad: Phaser.GamePad;
        hitCanvas: HTMLCanvasElement;
        hitContext: CanvasRenderingContext2D;
        holdRate: number;
        interactiveItems: Phaser.LinkedList;
        justPressedRate: number;
        justReleasedRate: number;
        keyboard: Phaser.Keyboard;
        maxPointers: number;
        mouse: Phaser.Mouse;
        mousePointer: Phaser.Pointer;
        moveCallback: Function;
        moveCallbackContext: Object;
        mspointer: Phaser.MSPointer;
        multiInputOverride: any;
        onDown: Phaser.Signal;
        onHold: Phaser.Signal;
        onTap: Phaser.Signal;
        onUp: Phaser.Signal;
        pointer1: Phaser.Pointer;
        pointer2: Phaser.Pointer;
        pointer3: Phaser.Pointer;
        pointer4: Phaser.Pointer;
        pointer5: Phaser.Pointer;
        pointer6: Phaser.Pointer;
        pointer7: Phaser.Pointer;
        pointer8: Phaser.Pointer;
        pointer9: Phaser.Pointer;
        pointer10: Phaser.Pointer;
        pollLocked: boolean;
        pollRate: number;
        position: Phaser.Point;
        recordLimit: number;
        recordPointerHistory: boolean;
        recordRate: number;
        scale: Phaser.Point;
        speed: Phaser.Point;
        tapRate: number;
        totalActivePointers: number;
        totalInactivePointers: number;
        touch: Phaser.Touch;
        worldX: number;
        worldY: number;
        x: number;
        y: number;
        //methods
        addPointer(): Phaser.Pointer;
        boot(): void;
        destroy(): void;
        getPointer(state: boolean): Phaser.Pointer;
        getPointerFromIdentifier(identifier: number): Phaser.Pointer;
        reset(hard?: boolean): void;
        resetSpeed(x: number, y: number): void;
        setMoveCallback(callBack: Function, callbackContext: Object): void;
        startPointer(event: Event): Phaser.Pointer;
        stopPointer(event: Event): Phaser.Pointer;
        update(): void;
        updatePointer(event: Event): Phaser.Pointer;
    }

    class InputHandler extends Phaser.LinkedListItem {
        //constructor
        constructor(sprite: Phaser.Sprite);
        //members
        allowHorizontalDrag: boolean;
        allowVerticalDrag: boolean;
        boundwsRect: Phaser.Rectangle;
        boundsSprite: Phaser.Sprite;
        bringToTop: boolean;
        consumePointerEvent: boolean;
        draggable: boolean;
        enabled: boolean;
        game: Phaser.Game;
        isDragged: boolean;
        pixelPerfect: boolean;
        pixelPerfectAlpha: number;
        priorityID: number;
        snapOffset: Phaser.Point;
        snapOffsetX: number;
        snapOffsetY: number;
        snapOnDrag: boolean;
        snapOnRelease: boolean;
        snapX: number;
        snapY: number;
        sprite: Phaser.Sprite;
        useHandCursor: boolean;
        //methods
        checkBoundsRect(): void;
        checkBoundsSprite(): void;
        checkPixel(x: number, y: number): boolean;
        checkPointerOver(pointer: number): boolean;
        destroy(): void;
        disableDrag(): void;
        disableSnap(): void;
        downDuration(pointer: number): number;
        enableDrag(lockCenter?: boolean, bringToTop?: boolean, pixelPerfect?: boolean, alphaThreshold?: number, boundsRect?: Phaser.Rectangle, boundsSprite?: Phaser.Rectangle): void;
        enableSnap(snapX: number, snapY: number, onDrag?: boolean, onRelease?: boolean, snapOffsetX?: number, snapOffsetY?: number): void;
        justOut(pointer: number, delay: number): boolean;
        justOver(pointer: number, delay: number): boolean;
        justPressed(pointer: number, delay: number): boolean;
        justReleased(pointer: number, delay: number): boolean;
        overDuration(pointer: number): number;
        pointerDown(pointer: number): boolean;
        pointerDragged(pointer: number): boolean;
        pointerOut(pointer: number): boolean;
        pointerOver(pointer: number): boolean;
        pointerTimeDown(pointer: number): number;
        pointerTimeOut(pointer: number): number;
        pointerTimeOver(pointer: number): number;
        pointerTimeUp(pointer: number): number;
        pointerUp(pointer: number): boolean;
        pointerX(pointer: number): number;
        pointerY(pointer: number): number;
        reset(): void;
        setDragLock(allowHorizontal?: boolean, allowVertical?: boolean): void;
        start(priority: number, useHandCursor: boolean): Phaser.Sprite;
        startDrag(pointer: Phaser.Pointer): void;
        stop(): void;
        stopDrag(pointer: Phaser.Pointer): void;
        update(pointer: Phaser.Pointer): void;
        updateDrag(pointer: Phaser.Pointer): boolean;
    }

    class Key {
        //constructor
        constructor(game: Phaser.Game, keycode: number)
        //members
        altKey: boolean;
        ctrlKey: boolean;
        duration: number;
        game: Phaser.Game;
        isDown: boolean;
        isUp: boolean;
        keyCode: number;
        onDown: Phaser.Signal;
        onUp: Phaser.Signal;
        repeats: number;
        shiftKey: boolean;
        timeDown: number;
        timeUp: number;
        //methods
        justPressed(duration?: number): boolean;
        justReleased(duration?: number): boolean;
    }

    class Keyboard {
        //constructor
        constructor(game: Phaser.Game);
        //static members
        static A: number;
        static B: number;
        static C: number;
        static D: number;
        static E: number;
        static F: number;
        static G: number;
        static H: number;
        static I: number;
        static J: number;
        static K: number;
        static L: number;
        static M: number;
        static N: number;
        static O: number;
        static P: number;
        static Q: number;
        static R: number;
        static S: number;
        static T: number;
        static U: number;
        static V: number;
        static W: number;
        static X: number;
        static Y: number;
        static Z: number;
        static ZERO: number;
        static ONE: number;
        static TWO: number;
        static THREE: number;
        static FOUR: number;
        static FIVE: number;
        static SIX: number;
        static SEVEN: number;
        static EIGHT: number;
        static NINE: number;
        static NUMPAD_0: number;
        static NUMPAD_1: number;
        static NUMPAD_2: number;
        static NUMPAD_3: number;
        static NUMPAD_4: number;
        static NUMPAD_5: number;
        static NUMPAD_6: number;
        static NUMPAD_7: number;
        static NUMPAD_8: number;
        static NUMPAD_9: number;
        static NUMPAD_MULTIPLY: number;
        static NUMPAD_ADD: number;
        static NUMPAD_ENTER: number;
        static NUMPAD_SUBTRACT: number;
        static NUMPAD_DECIMAL: number;
        static NUMPAD_DIVIDE: number;
        static F1: number;
        static F2: number;
        static F3: number;
        static F4: number;
        static F5: number;
        static F6: number;
        static F7: number;
        static F8: number;
        static F9: number;
        static F10: number;
        static F11: number;
        static F12: number;
        static F13: number;
        static F14: number;
        static F15: number;
        static COLON: number;
        static EQUALS: number;
        static UNDERSCORE: number;
        static QUESTION_MARK: number;
        static TILDE: number;
        static OPEN_BRACKET: number;
        static BACKWARD_SLASH: number;
        static CLOSED_BRACKET: number;
        static QUOTES: number;
        static BACKSPACE: number;
        static TAB: number;
        static CLEAR: number;
        static ENTER: number;
        static SHIFT: number;
        static CONTROL: number;
        static ALT: number;
        static CAPS_LOCK: number;
        static ESC: number;
        static SPACEBAR: number;
        static PAGE_UP: number;
        static PAGE_DOWN: number;
        static END: number;
        static HOME: number;
        static LEFT: number;
        static UP: number;
        static RIGHT: number;
        static DOWN: number;
        static INSERT: number;
        static DELETE: number;
        static HELP: number;
        static NUM_LOCK: number;
        //members
        callbackContext: Object;
        disabled: boolean;
        game: Phaser.Game;
        onDownCallback: Function;
        onUpCallback: Function;
        //methods
        addCallbacks(context: Object, onDown: Function, onUp?: Function): void;
        addKey(keycode: number): Phaser.Key;
        addKeyCapture(keycode: any): void;
        createCursorKeys(): Phaser.CursorKeys;
        clearCaptures(): Object;
        isDown(keycode: number): boolean;
        justPressed(keycode: number, duration?: number): boolean;
        justReleased(keycode: number, duration?: number): boolean;
        removeKey(keycode: number): void;
        removeKeyCapture(keycode: number): void;
        reset(): void;
        start(): void;
        stop(): void;
    }

    class Line {
        //constructor
        constructor(x1?: number, y1?: number, x2?: number, y2?: number);
        //members
        angle: number;
        end: Phaser.Point;
        length: number;
        perpSlope: number;
        slope: number;
        start: Phaser.Point;
        //static methods
        static intersectsPoints(a: Phaser.Point, b: Phaser.Point, e: Phaser.Point, f: Phaser.Point, asSegment?: boolean, result?: Phaser.Point): Phaser.Point;
        static intersects(a: Phaser.Line, b: Phaser.Line, asSegment?: boolean, result?: Phaser.Point): Phaser.Point;
        //methods
        fromSprite(startSprite: Phaser.Sprite, endSprite: Phaser.Sprite, useCenter?: boolean): Phaser.Line;
        intersects(line: Phaser.Line, asSegment?: boolean, result?: Phaser.Point): Phaser.Point;
        pointOnLine(x: number, y: number): boolean;
        pointOnSegment(x: number, y: number): boolean;
        setTo(x1?: number, y1?: number, x2?: number, y2?: number): Phaser.Line;
    }

    class LinkedListItem {
        //members
        next: LinkedListItem;
        prev: LinkedListItem;
        first: LinkedListItem;
        last: LinkedListItem;
    }

    class LinkedList extends LinkedListItem {
        //members
        first: LinkedListItem;
        last: LinkedListItem;
        next: LinkedListItem;
        prev: LinkedListItem;
        total: number;
        //methods
        add(child: LinkedListItem): LinkedListItem;
        callAll(callback: Function): void;
        remove(child: LinkedListItem): void;
    }

    class Loader {
        //constructor
        constructor(game: Phaser.Game);
        //static members
        static TEXTURE_ATLAS_JSON_ARRAY: number;
        static TEXTURE_ATLAS_JSON_HASH: number;
        static TEXTURE_ATLAS_XML_STARLING: number;
        //members
        baseURL: string;
        crossOrigin: string;
        game: Phaser.Game;
        hasLoaded: boolean;
        isLoading: boolean;
        onFileComplete: Phaser.Signal;
        onFileError: Phaser.Signal;
        onLoadComplete: Phaser.Signal;
        onLoadStart: Phaser.Signal;
        preloadSprite: Phaser.Sprite;
        progress: number;
        progressFloat: number;
        //methods
        addToFileList(type: string, key: string, url: string, properties: any): void;
        atlas(key: string, textureURL: string, atlasURL?: string, atlasData?: Object, format?: number): Phaser.Loader;
        atlasJSONArray(key: string, textureURL: string, atlasURL?: string, atlasData?: Object): Phaser.Loader;
        atlasJSONHash(key: string, textureURL: string, atlasURL?: string, atlasData?: Object): Phaser.Loader;
        atlasXML(key: string, textureURL: string, atlasURL?: string, atlasData?: Object): Phaser.Loader;
        audio(key: string, urls: any, autoDecode?: boolean): Phaser.Loader;
        binary(key: string, url: string, callback?: Function, callbackContext?: Function): Phaser.Loader;
        bitmapFont(key: string, textureURL: string, xmlURL?: string, xmlData?: Object): Phaser.Loader;
        checkKeyExists(type: string, key: string): boolean;
        csvLoadComplete(index: number): void;
        dataLoadError(index: number): void;
        fileComplete(key: number): void;
        fileError(key: number): void;
        getAsset(type: string, key: string): any;
        image(key: string, url: string, overwrite?: boolean): Phaser.Loader;
        jsonLoadComplete(index: number): void;
        removeAll(): void;
        removeFile(key: string, type: string): void;
        reset(): void;
        script(key: string, url: String): Phaser.Loader;
        setPreloadSprite(sprite: Phaser.Sprite, direction?: number): void;
        spritesheet(key: string, url: string, frameWidth: number, frameHeight: number, frameMax?: number, margin?: number, spacing?: number): Phaser.Loader;
        start(): void;
        text(key: string, url: string, overwrite?: boolean): Phaser.Loader;
        tilemap(key: string, mapDataURL?: string, mapData?: Object, format?: string): Phaser.Loader;
        totalLoadedFiles(): number;
        totalQueuedFiles(): number;
        xmlLoadComplete(index:number): void;
        //members no longer used?
        tileset(key: string, url: string, tileWidth: number, tileHeight: number, tileMargin?: number, tileSpacing?: number, rows?: number, columns?: number, limit?: number): void;
    }

    class LoaderParser {
        //static methods
        static bitmapFont(game: Phaser.Game, xml: Object, cacheKey: Phaser.FrameData): Phaser.FrameData;
    }

    class Math {
        //static methods
        static angleBetween(x1: number, y1: number, x2: number, y2: number): number;
        static angleLimit(angle: number, min: number, max: number): number;
        static average(...numbers: number[]): number;
        static bernstein(n: number, i: number): number;
        static bezierInterpolation(v: number[], k: number): number;
        static catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number;
        static catmullRomInterpolation(v: number[], k: number): number;
        static ceil(value: number): number;
        static ceilTo(value: number, place?: number, base?: number): number;
        static chanceRoll(chance: number): boolean;
        static clamp(x: number, a: number, b: number): number;
        static clampBottom(x: number, a: number): number;
        static degToRad(degrees: number): number;
        static difference(a: number, b: number): number;
        static distance(x1: number, y1: number, x2: number, y2: number): number;
        static distancePow(xy: number, y1: number, x2: number, y2: number, pow?: number): number;
        static distanceRounded(x1: number, y1: number, x2: number, y2: number): number;
        static floor(value: number): number;
        static floorTo(value: number, place: number, base: number): number;
        static fuzzyCeil(val: number, epsilon?: number): boolean;
        static fuzzyEqual(a: number, b: number, epsilon?: number): boolean;
        static fuzzyFloor(val: number, epsilon?: number): boolean;
        static fuzzyGreaterThan(a: number, b: number, epsilon?: number): boolean;
        static fuzzyLessThan(a: number, b: number, epsilon?: number): boolean;
        static getRandom(objects: Object[], startIndex?: number, length?: number): Object;
        static interpolateAngles(a1: number, a2: number, weight: number, radians?: boolean, ease?: any): number;
        static interpolateFloat(a: number, b: number, weight: number): number;
        static isEven(n: number): boolean;
        static isOdd(n: number): boolean;
        static linear(p0: number, p1: number, t: number): number;
        static linearInterpolation(v: number[], k: number): number;
        static mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number;
        static max(...numbers: number[]): number;
        static maxAdd(value: number, amount: number, max: number): number;
        static maxProperty(...numbers: number[]): number;
        static min(...numbers: number[]): number;
        static minProperty(...numbers: number[]): number;
        static minSub(value: number, amount: number, min: number): number;
        static nearestAngleBetween(a1: number, a2: number, radians?: boolean): number;
        static normalizeAngle(angle: number, radians?: boolean): number;
        static normalizeLatitude(lat: number): number;
        static normalizeLongitude(lng: number): number;
        static numberArray(min: number, max: number): number[];
        static PI2: number;
        static radToDeg(radians: number): number;
        static randomSign(): number;
        static reverseAngle(angleRed: number): number;
        static roundTo(value: number, place?: number, base?: number): number;
        static shear(n: number): number;
        static shift(stack: any[]): any;
        static shuffleArray(array: any[]): any[];
        static sign(x: number): number;
        static sinCosGenerator(length: number, sinAmplitude?: number, cosAmplitude?: number, frequency?: number): { sin: number[]; cos: number[]; };
        static smootherstep(x: number, min: number, max: number): number;
        static smoothstep(x: number, min: number, max: number): number;
        static snapTo(input: number, gap: number, start?: number): number;
        static snapToCeil(input: number, gap: number, start?: number): number;
        static snapToFloor(input: number, gap: number, start?: number): number;
        static snapToInArray(input: number, arr: number[], sort?: boolean): number;
        static truncate(n: number): number;
        static within(a: number, b: number, tolerance: number): boolean;
        static wrap(value: number, min: number, max: number): number;
        static wrapAngle(angle: number): number;
        static wrapValue(value: number, amount: number, max: number): number;       
    }

    class Mouse {
        //constructor
        constructor(game: Phaser.Game)
        //static members
        static LEFT_BUTTON: number;
        static MIDDLE_BUTTON: number;
        static NO_BUTTON: number;
        static RIGHT_BUTTON: number;
        //members
        button: number;
        callbackContext: Object;
        capture: boolean;
        disabled: boolean;
        event: MouseEvent;
        game: Phaser.Game;
        locked: boolean;
        mouseDownCallback: Function;
        mouseMoveCallback: Function;
        mouseUpCallback: Function;
        pointerLock: Phaser.Signal;
        //methods
        onMouseDown(): void;
        onMouseMove(): void;
        onMouseUp(): void;
        pointerLockChange(): void;
        releasePointerLock(): void;
        requestPointerLock(): void;
        start(): void;
        stop();
    }

    class MSPointer {
        //constructor
        constructor(game: Phaser.Game);
        //members
        callbackContext: Object;
        disabled: boolean;
        game: Phaser.Game;
        //methods
        onPointerDown(): void;
        onPointerMove(): void;
        onPointerUp(): void;
        mouseDownCallback(): void;
        mouseMoveCallback(): void;
        mouseUpCallback(): void;
        start(): void;
        stop(): void;
    }

    class Net {
        //constructor
        constructor(game: Phaser.Game);
        //members
        game: Phaser.Game;
        //methods
        checkDomainName(domain: string): boolean;
        decodeURI(value: string): string;
        getHostName(): string;
        updateQueryString(key: string, value: any, redirect?: boolean, url?: string): string;
        getQueryString(parameter?: string): string;
    }

    class Particles {
        //constructor
        constructor(game: Phaser.Game);
        //members
        emitters: Object;
        game: Phaser.Game;
        ID: number;
        //methods
        add(emitter: Phaser.Particles.Arcade.Emitter): Phaser.Particles.Arcade.Emitter;
        remove(emitter: Phaser.Particles.Arcade.Emitter): void;
    }

    module Particles {
        module Arcade {
            class Emitter extends Phaser.Group {
                //constructor
                constructor(game: Phaser.Game, x?: number, y?: number, maxParticles?: number);
                //members
                alpha: number;
                angularDrag: number;
                bottom: number;
                bounce: Phaser.Point;
                emitX: number;
                emitY: number;
                exists: boolean;
                frequency: number;
                gravity: number;
                group: Phaser.Group;
                height: number;
                left: number;
                lifespan: number;
                maxParticles: number;
                maxParticleScale: number;
                maxParticleSpeed: Phaser.Point;
                maxRotation: number;
                minParticleScale: number;
                minParticleSpeed: Phaser.Point;
                minRotation: number;
                name: string;
                on: boolean;
                particleClass: any;
                particleFriction: number;
                right: number;
                top: number;
                type: number;
                visible: boolean;
                width: number;
                x: number;
                y: number;
                //this old and no longer used?
                particleDrag: Phaser.Point;
                //methods
                at(object: any): void;
                emitParticle(): void;
                kill(): void;
                makeParticles(keys: string[], frames: number[], quantity: number, collide?: boolean, collideWorldBounds?: boolean): Phaser.Particles.Arcade.Emitter;
                setRotation(min?: number, max?: number): void;
                setSize(width: number, height: number): void;
                setXSpeed(min: number, max: number): void;
                setYSpeed(min: number, max: number): void;
                start(explode?: boolean, lifespan?: number, frequency?: number, quantity?: number): void;
                update(): void;
                revive(): void;
            }
        }
    }

    module Physics {

        class Arcade {
            //constructor
            constructor(game: Phaser.Game);
            //static methods
            static CIRCLE: number;
            static POLYGON: number;
            static RECT: number;
            //members
            game: Phaser.Game;
            gravity: Phaser.Point;
            maxLevels: number;
            maxObjects: number;
            quadTree: Phaser.QuadTree;
            worldBottom: SAT.Box;
            worldLeft: SAT.Box;
            worldPolys: SAT.Polygon;
            worldRight: SAT.Box;
            worldTop: SAT.Box;
            //methods
            accelerateToObject(displayObject: any, destination: any, speed?: number, xSpeedMax?: number, ySpeedMax?: number): number;
            accelerateToPointer(displayObject: any, pointer: any, speed?: number, xSpeedMax?: number, ySpeedMax?: number): number;
            accelerateToXY(displayObject: any, x: number, y: number, speed?: number, xSpeedMax?: number, ySpeedMax?: number): number;
            angleBetween(source: any, target: any): number;
            angleToPointer(displayObject: any, pointer: number): number;
            angleToXY(displayObject: any, x: number, y: number): number;
            checkBounds(body: Phaser.Physics.Arcade.Body): boolean;
            collide(object1: any, object2: any, collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
            distanceBetween(source: any, target: any): number;
            distanceToPointer(displayObject: any, pointer: Phaser.Pointer): number;
            distanceToXY(displayObject: any, x: number, y: number): number;
            intersects(a: Object, b: Object): boolean;
            moveToObject(displayObject: any, destination: any, speed?: number, maxTime?: number): number;
            moveToPointer(displayObject: any, speed?: number, pointer?: Phaser.Pointer, maxTime?: number): number;
            moveToXY(displayObject: any, x: number, y: number, speed?: number, maxTime?: number): number;
            overlap(object1: any, object2: any, overlapCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
            processTileSeparation(body: Phaser.Physics.Arcade.Body): boolean;
            separate(body: Phaser.Physics.Arcade.Body, body2: Phaser.Physics.Arcade.Body, processCallback?: Function, callbackContext?: any, overlapOnly?: boolean): boolean;
            separateTile(body: Phaser.Physics.Arcade.Body, tile: Phaser.Tile): boolean;
            separateTiles(body: Phaser.Physics.Arcade.Body, tiles: Phaser.Tile[]): boolean;
            setBounds(x: number, y: number, width: number, height: number, left?: boolean, right?: boolean, top?: boolean, bottom?: boolean): void;
            setBoundsToWorld(left?: boolean, right?: boolean, top?: boolean, bottom?: boolean): void;
            tileIntersects(body: Phaser.Physics.Arcade.Body, tile: Phaser.Tile): boolean;
            updateMotion(body: Phaser.Physics.Arcade.Body): Phaser.Point;
            velocityFromAngle(angle: number, speed?: number, point?: any): Phaser.Point;
            velocityFromRotation(rotation: number, speed?: number, point?: any): Phaser.Point;
            //I left these methods but I do not think they should be here?
            collideHandler(object1: any, object2: any, collideCallback: Function, processCallback: Function, callbackContext: any, overlapOnly: boolean): boolean;
            collideSpriteVsSprite(sprite1: Phaser.Sprite, sprite2: Phaser.Sprite, collideCallback: Function, processCallback: Function, callbackContext: any, overlapOnly: boolean): boolean;
            collideSpriteVsGroup(sprite1: Phaser.Sprite, group: Phaser.Group, collideCallback: Function, processCallback: Function, callbackContext: any, overlapOnly: boolean): boolean;
            collideGroupVsSelf(group: Phaser.Group, collideCallback: Function, processCallback: Function, callbackContext: any, overlapOnly: boolean): boolean;
            collideGroupVsGroup(group: Phaser.Group, group2: Phaser.Group, collideCallback: Function, processCallback: Function, callbackContext: any, overlapOnly: boolean): boolean;
            collideSpriteVsTilemapLayer(sprite: Phaser.Sprite, tilemapLayer: Phaser.TilemapLayer, collideCallback: Function, processCallback: Function, callbackContext: any): boolean;
            collideGroupVsTilemapLayer(group: Phaser.Group, tilemapLayer: Phaser.TilemapLayer, collideCallback: Function, processCallback: Function, callbackContext: any): boolean;
            distanceTo(source: Phaser.Sprite, target: Phaser.Sprite): number;
        }

        module Arcade {

            class Body {
                //constructor
                constructor(sprite: Phaser.Sprite);
                //static members
                static CIRCLE: number;
                static POLYGON: number;
                static RECT: number;
                //members
                acceleration: Phaser.Point;
                allowGravity: boolean;
                allowRotation: boolean;
                angle: number;
                angularAcceleration: number;
                angularDrag: number;
                angularVelocity: number;
                blocked: FaceChoices;
                bottom: number;
                bounce: Phaser.Point;
                checkCollision: FaceChoices;
                collideCallback: any;
                collideCallbackContext: any;
                collideWorldBounds: boolean;
                contacts: Phaser.Physics.Arcade.Body[];
                customSeparateCallback: Function;
                customSeparateContext: any;
                facing: number;
                game: Phaser.Game;
                gravity: Phaser.Point;
                height: number;
                immovable: boolean;
                left: number;
                linearDamping: number;
                mass: number;
                maxAngular: number;
                maxVelocity: Phaser.Point;
                minVelocity: Phaser.Point;
                moves: boolean;
                offset: Phaser.Point;
                overlapX: number;
                overlapY: number;
                polygon: SAT.Polygon;
                preRotation: number;
                preX: number;
                preY: number;
                rebound: boolean;
                right: number;
                rotation: number;
                shape: any;
                speed: number;
                sprite: Phaser.Sprite;
                top: number;
                touching: FaceChoices;
                type: any;
                velocity: Phaser.Point;
                width: number;
                x: number;
                y: number;
                //methods
                add(v:SAT.Vector): void;
                addContact(body: Phaser.Physics.Arcade.Body): boolean;
                applyDamping(): void;
                checkBlocked(): void;
                deltaX(): number;
                deltaY(): number;
                deltaZ(): number;
                destroy(): void;
                exchange(body: Phaser.Physics.Arcade.Body): void;
                getDownwardForce(): number;
                getUpwardForce(): number;
                give(body: Phaser.Physics.Arcade.Body, response: SAT.Response): void;
                hitBottom(body: Phaser.Physics.Arcade.Body, response: SAT.Response): void;
                hitLeft(body: Phaser.Physics.Arcade.Body, response: SAT.Response): void;
                hitRight(body: Phaser.Physics.Arcade.Body, response: SAT.Response): void;
                hitTop(body: Phaser.Physics.Arcade.Body, response: SAT.Response): void;
                inContact(body: Phaser.Physics.Arcade.Body): boolean;
                integrateVelocity(): void;
                onFloor(): boolean;
                onWall(): boolean;
                overlap(body: Phaser.Physics.Arcade.Body, response: SAT.Response): boolean;
                postUpdate(): void;
                preUpdate(): void;
                processRebound(body: Phaser.Physics.Arcade.Body): void;
                reboundCheck(x: number, y: number, rebound: boolean): void;
                removeContact(body: Phaser.Physics.Arcade.Body): boolean;
                reset(full: boolean): void;
                separate(body: Phaser.Physics.Arcade.Body, response: SAT.Response): boolean;
                setCircle(radius: number, offsetX?: number, offsetY?: number): void;
                setPolygon(points: any[]): void; 
                setRectangle(width?: number, height?: number, translateX?: number, translateY?: number): void;
                split(body: Phaser.Physics.Arcade.Body, response: SAT.Response): void;
                sub(v: SAT.Vector): void;
                take(body: Phaser.Physics.Arcade.Body, response: SAT.Response): void;
                translate(x: number, y: number): void;
                updateBounds(): void;
                updateScale(): void;
            }

            class FaceChoices {
                none: boolean;
                any: boolean;
                up: boolean;
                down: boolean;
                left: boolean;
                right: boolean;
                x: number;
                y: number;
            }
        }
    }

    class Plugin extends StateCycle {
        //constrctor
        constructor(game: Phaser.Game, parent: any);
        //members
        active: boolean;
        game: Phaser.Game;
        hasPostRender: boolean;
        hasPostUpdate: boolean;
        hasPreUpdate: boolean;
        hasRender: boolean;
        hasUpdate: boolean;
        parent: any;
        visible: boolean;
        //methods
        destroy(): void;
        postRender(): void;
        preUpdate(): void;
        render(): void;
        update(): void;
    }

    class PluginManager extends StateCycle {
        //constructor
        constructor(game: Phaser.Game, parent: any);
        //members
        game: Phaser.Game;
        plugins: Phaser.Plugin[];
        //methods
        add(plugin: Phaser.Plugin): Phaser.Plugin;
        destroy(): void;
        postRender(): void;
        postUpdate(): void;
        preUpdate(): void;
        remove(plugin: Phaser.Plugin): void;
        removeAll(): void;
        render();
        update();
    }

    class Point {
        //constructor
        constructor(x?: number, y?: number);
        //members
        x: number;
        y: number;
        //static methods
        static add(a: Phaser.Point, b: Phaser.Point, out?: Phaser.Point): Phaser.Point;
        static distance(a: Phaser.Point, b: Phaser.Point, round?: boolean): number;
        static divide(a: Phaser.Point, b: Phaser.Point, out?: Phaser.Point): Phaser.Point;
        static equals(a: Phaser.Point, b: Phaser.Point): boolean;
        static multiply(a: Phaser.Point, b: Phaser.Point, out?: Phaser.Point): Phaser.Point;
        static rotate(a: Phaser.Point, x: number, y: number, angle: number, asDegrees: boolean, distance: boolean): Phaser.Point;
        static subtract(a: Phaser.Point, b: Phaser.Point, out?: Phaser.Point): Phaser.Point;
        //methods
        add(x: number, y: number): Phaser.Point;
        clamp(min: number, max: number): Phaser.Point;
        clampX(min: number, max: number): Phaser.Point;
        clampY(min: number, max: number): Phaser.Point;
        clone(output: Phaser.Point): Phaser.Point;
        copyFrom(source: any): Phaser.Point;
        copyTo(dest: any): Object;
        distance(dest: Object, round?: boolean): number;
        divide(x: number, y: number): Phaser.Point;
        equals(a: Phaser.Point): boolean;
        getMagnitude(): number;
        getMagnitude(magnitude): Phaser.Point;
        invert(): Phaser.Point;
        isZero(): boolean;
        multiply(x: number, y: number): Phaser.Point;
        normalise(): Phaser.Point;
        rotate(x: number, y: number, angle: number, asDegrees: boolean, distance?: number): Phaser.Point;
        setTo(x: number, y: number): Phaser.Point;
        subtract(x: number, y: number): Phaser.Point;
        toString(): string;
    }

    class Pointer {
        //constrctor
        constructor(game: Phaser.Game, id: number);
        //members
        active: boolean;
        circle: Phaser.Circle;
        clientX: number;
        clientY: number;
        duation: number;
        game: Phaser.Game;
        id: number;
        isDown: boolean;
        isMouse: boolean;
        isUp: boolean;
        msSinceLastClick: number;
        pageX: number;
        pageY: number;
        position: Phaser.Point;
        positionDown: Phaser.Point;
        previousTapTime: number;
        screenX: number;
        screenY: number;
        targetObject: any;
        timeDown: number;
        timeUp: number;
        totalTouches: number;
        withinGame: boolean;
        worldX: number;
        worldY: number;
        x: number;
        y: number;
        //methods
        justPressed(duration?: number): boolean;
        justReleased(duration?: number): boolean;
        leave(event: any): void;
        move(event: any): void;
        reset(): void;
        start(event: any): Phaser.Pointer;
        stop(event: any): void;
        update(): void;
        toString(): string;
    }

    class QuadTree {
        //constructor
        constructor(x: number, y: number, width: number, height: number, maxObject?: number, maxLevels?: number, level?: number);
        //methods
        clear(): void;
        getIndex(rect: Object): number;
        insert(body: any): void;
        populate(group: Phaser.Group): void;
        populateHandler(sprite: Phaser.Sprite): void;
        retrieve(sprite: Object): any[];
        split(): void;
        //I am not sure these are relevant? Searching in the code yeilds no result
        maxObjects: number;
        maxLevels: number;
        level: number;
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
            subWidth: number;
            subHeight: number;
            right: number;
            bottom: number;
        };
        objects: Array<any>;
        nodes: Array<any>;
    }

    class RandomDataGenerator {
        //constructor
        constructor(seeds: number[]);
        //members
        c: number;
        s0: number;
        s1: number;
        s2: number;
        //methods
        angle(): number;
        frac(): number;
        hash(data: any): number;
        integer(): number;
        integerInRange(min: number, max: number): number;
        normal(): number;
        pick(ary: number[]): number;
        real(): number;
        realInRange(min: number, max: number): number;
        rnd(): void;
        sow(seeds: any[]): void;
        timestamp(a?: number, b?: number): number;
        uuid(): number;
        weightedPick(ary: number[]): number;
    }

    class Rectangle {
        //constructor
        constructor(x: number, y: number, width: number, height: number);
        //members
        bottom: number;
        bottomRight: Phaser.Point;
        centerX: number;
        centerY: number;
        empty: boolean;
        halfHeight: number;
        halfWidth: number;
        height: number;
        left: number;
        perimeter: number;
        right: number;
        top: number;
        topLeft: Phaser.Point;
        volume: number;
        width: number;
        x: number;
        y: number;
        //static methods
        static clone(a: Phaser.Rectangle, output?: Phaser.Rectangle): Phaser.Rectangle;
        static contains(a: Phaser.Rectangle, x: number, y: number): boolean;
        static containsPoint(a: Phaser.Rectangle, point: Phaser.Point): boolean;
        static containsRect(a: Phaser.Rectangle, b: Phaser.Rectangle): boolean;
        static equals(a: Phaser.Rectangle, b: Phaser.Rectangle): boolean;
        static inflate(a: Phaser.Rectangle, dx: number, dy: number): Phaser.Rectangle;
        static inflatePoint(a: Phaser.Rectangle, point: Phaser.Point): Phaser.Rectangle;
        static intersection(a: Phaser.Rectangle, b: Phaser.Rectangle, out?: Phaser.Rectangle): Phaser.Rectangle;
        static intersects(a: Phaser.Rectangle, b: Phaser.Rectangle, tolerance: number): boolean;
        static intersectsRaw(left: number, right: number, top: number, bottom: number, tolerance: number): boolean;
        static size(a: Phaser.Rectangle, output?: Phaser.Point): Phaser.Point;
        static union(a: Phaser.Rectangle, b: Phaser.Rectangle, out?: Phaser.Rectangle): Phaser.Rectangle;
        //methods
        clone(output: Phaser.Rectangle): Phaser.Rectangle;
        contains(x: number, y: number): boolean;
        containsRect(b: Phaser.Rectangle): boolean;
        copyFrom(source: any): Phaser.Rectangle;
        copyTo(dest: any): Object;
        equals(b: Phaser.Rectangle): boolean;
        floor(): void;
        floorAll(): void;
        inflate(dx: number, dy: number): Phaser.Rectangle;
        intersection(b: Phaser.Rectangle, out: Phaser.Rectangle): Phaser.Rectangle;
        intersects(b: Phaser.Rectangle, tolerance: number): boolean;
        intersectsRaw(left: number, right: number, top: number, bottom: number, tolerance: number): boolean;
        offset(dx: number, dy: number): Phaser.Rectangle;
        offsetPoint(point: Phaser.Point): Phaser.Rectangle;
        setTo(x: number, y: number, width: number, height: number): Phaser.Rectangle;
        size(output?: Phaser.Point): Phaser.Point;
        toString(): string;
        union(b: Phaser.Rectangle, out?: Phaser.Rectangle): Phaser.Rectangle;
    }

    class RenderTexture {
        //constructor
        constructor(game: Phaser.Game, key: string, width: number, height: number);
        //members
        frame: any;
        game: Phaser.Game;
        height: number;
        indentityMatrix: any;
        name: string;
        type: number;
        width: number;
        //methods
        render(displayObject: any, position?: Phaser.Point, clear?: boolean, renderHidden?: boolean): void;
        renderXY(displayObject: any, x: number, y: number, clear?: boolean, renderHidden?: boolean): void;
        resize(): void;
    }

    class RequestAnimationFrame {
        //constructor
        constructor(game: Phaser.Game);
        //members
        game: Phaser.Game;
        isRunning: boolean;
        //methods
        isRAF(): boolean;
        isSetTimeOut(): boolean;
        start(): boolean;
        stop(): void;
        updateRAF(time: number): void;
        updateSetTimeout(): void;
    }

    class Signal {
        //members
        active: boolean;
        memorize: boolean;
        //methods
        add(listener: Function, listenerContext?: any, priority?: number): Phaser.SignalBinding;
        addOnce(listener: Function, listenerContext?: any, priority?: number): Phaser.SignalBinding;
        dispatch(...params: any[]): void;
        dispose(): void;
        forget(): void;
        getNumListeners(): number;
        halt(): void;
        has(listener: Function, context?: any): boolean;
        remove(listener: Function, context?: any): Function;
        removeAll(): void;
        toString(): string;
        validateListener(listener: Function, fnName: string): void;
    }

    class SignalBinding {
        //constructor
        constructor(signal: Phaser.Signal, listener: Function, isOnce: boolean, listenerContext?: Object, priority?: number);
        //members
        active: boolean;
        context: Object;
        params: any[];
        //methods
        execute(paramsArr?: any[]): void;
        detach(): Function;
        isBound(): boolean;
        isOnce(): boolean;
        getListener(): Function;
        getSignal(): Phaser.Signal;
        toString(): string;
    }

    class SinglePad {
        //constructor
        constructor(game: Phaser.Game, padParent: Object);
        //members
        callbackContext: Object;
        connected: boolean;
        deadZone: number;
        game: Phaser.Game;
        index: number;
        onAxisCallback: Function;
        onConnectCallback: Function;
        onDisconnectCallback: Function;
        onDownCallback: Function;
        onFloatCallback: Function;
        onUpCallback: Function;
        //methods
        addButton(buttonCode: number): Phaser.GamepadButton;
        buttonValue(buttonCode: number): boolean;
        connect(rawPad: Object): void;
        disconnect(): void;
        axis(axisCode: number): number;
        isDown(buttonCode: number): boolean;
        justPressed(buttonCode: number, duration?: number): boolean;
        justReleased(buttonCode: number, duration?: number): boolean;
        pollStatus(): void;
        processAxisChange(axisState: Object): void;
        processButtonDown(buttonCode: number, value: Object): void;
        processButtonFloat(buttonCode: number, value: Object): void;
        processButtonUp(buttonCode: number, value: Object): void;
        reset(): void;
    }

    class Sound {
        //constructor
        constructor(game: Phaser.Game, key: string, volume?: number, loop?: boolean);
        //members
        autoplay: boolean;
        context: any;
        currentMarker: string;
        currentTime: number;
        duration: number;
        externalNode: Object;
        game: Phaser.Game;
        isDecoded: boolean;
        isDecoding: boolean;
        isPlaying: boolean;
        key: string;
        loop: boolean;
        markers: Object;
        mute: boolean;
        name: string;
        onDecoded: Phaser.Signal;
        onLoop: Phaser.Signal;
        onMarkerComplete: Phaser.Signal;
        onMute: Phaser.Signal;
        onPause: Phaser.Signal;
        onPlay: Phaser.Signal;
        onResume: Phaser.Signal;
        onStop: Phaser.Signal;
        override: boolean;
        paused: boolean;
        pausedPosition: number;
        pausedTime: number;
        pendingPlayback: boolean;
        startTime: number;
        stopTime: number;
        totalDuration: number;
        usingAudioTag: boolean;
        usingWebAudio: boolean;
        volume: number;
        //methods
        addMarker(name: string, start: number, stop: number, volume?: number, loop?: boolean): void;
        pause(): void;
        play(marker?: string, position?: number, volume?: number, loop?: boolean, forceRestart?: boolean): Phaser.Sound;
        removeMarker(name: string): void;
        restart(marker: string, position: number, volume?: number, loop?: boolean): void;
        resume(): void;
        soundHasUnlocked(key: string): void;
        stop(): void;
        update(): void;
    }

    class SoundManager {
        //constructor
        constructor(game: Phaser.Game);
        //members
        channels: number;
        connectToMaster: boolean;
        context: any;
        game: Phaser.Game;
        mute: boolean;
        noAudio: boolean;
        onSoundDecode: Phaser.Signal;
        touchLocked: boolean;
        usingAudioTag: boolean;
        usingWebAudio: boolean;
        volume: number;
        //methods
        add(key: string, volume?: number, loop?: boolean, connect?: boolean): Phaser.Sound;
        boot(): void;
        decode(key: string, sound?: Phaser.Sound): void;
        pauseAll(): void;
        play(key: string, volume?: number, loop?: boolean, destroyOnComplete?: boolean): Phaser.Sound;
        resumeAll(): void;
        stopAll(): void;
        unlock(): void;
        update(): void;
    }

    class Sprite {
        //constructor
        constructor(game: Phaser.Game, x?: number, y?: number, key?: any, frame?: any);
        //members
        alive: boolean;
        anchor: Phaser.Point;
        angle: number;
        animations: Phaser.AnimationManager;
        autoCull: boolean;
        body: Phaser.Physics.Arcade.Body;
        bottomLeft: Phaser.Point;
        bottomRight: Phaser.Point;
        bounds: Phaser.Rectangle;
        cameraOffset: Phaser.Point;
        center: Phaser.Point;
        crop: Phaser.Rectangle;
        cropEnabled: boolean;
        currentFrame: Phaser.Frame;
        debug: boolean;
        deltaX: number;
        deltaY: number;
        events: Phaser.Events;
        exists: boolean;
        fixedToCamera: boolean;
        frame: number;
        frameName: string;
        game: Phaser.Game;
        group: Phaser.Group;
        health: number;
        height: number;
        inCamera: boolean;
        input: Phaser.InputHandler;
        inputEnabled: boolean;
        inWorld: boolean;
        inWorldThreshold: number;
        key: any;
        lifespan: number;
        name: string;
        offset: Phaser.Point;
        outOfBoundsKill: boolean;
        position: Phaser.Point;
        renderable: boolean;
        renderOrderID: number;
        scale: Phaser.Point;
        textureRegion: Phaser.Rectangle;
        topLeft: Phaser.Point;
        topRight: Phaser.Point;
        type: number;
        visible: boolean;
        width: number;
        world: Phaser.Point;
        worldCenterX: number;
        worldCenterY: number;
        x: number;
        y: number;
        //members
        bringToTop(): Phaser.Sprite;
        centerOn(x: number, y: number): Phaser.Sprite;
        damage(amount: number): Phaser.Sprite;
        destroy(): void;
        getLocalPosition(p: Phaser.Point, x: number, y: number): Phaser.Point;
        getLocalUnmodifiedPosition(p: Phaser.Point, x: number, y: number): Phaser.Point;
        kill(): Phaser.Sprite;
        loadTexture(key: any, frame: any): void;
        play(name: string, frameRate?: number, loop?: boolean, killOnComplete?: boolean): Phaser.Animation;
        postUpdate(): void;
        preUpdate(): void;
        reset(x: number, y: number, health?: number): Phaser.Sprite;
        resetCrop(): void;
        revive(health?: number): Phaser.Sprite;
        updateAnimation(): void;
        updateBounds(): void;
        updateCache(): void;
        updateCrop(): void;
        //unknown/still applicable?
        scrollFactor: Phaser.Point;
        //I cannot see this in the Sprite.JS code!
        alpha: number;
    }

    class Stage {
        //constructor
        constructor(game: Phaser.Game, width: number, height: number);
        //members
        aspectRatio: number;
        backgroundColor: any;
        canvas: HTMLCanvasElement;
        checkOffsetInterval: any;
        disableVisibilityChange: boolean;
        display: any;
        game: Phaser.Game;
        offset: Phaser.Point;
        scale: Phaser.StageScaleMode;
        scaleMode: number;
        //methods
        parseConfig(): void;
        boot(): void;
        visibilityChange(event: Event): void;
    }

    class StageScaleMode {
        //constructor
        constructor(game: Phaser.Game, width: number, height: number);
        //static members
        static EXACT_FIT: number;
        static NO_SCALE: number;
        static SHOW_ALL: number;
        //members
        aspectRatio: number;
        enterIncorrectOrientation: Phaser.Signal;
        enterLandscape: Phaser.Signal;
        enterPortrait: Phaser.Signal;
        event: any;
        forceLandscape: boolean;
        forcePortrait: boolean;
        game: Phaser.Game;
        hasResized: Phaser.Signal;
        height: number;
        incorrectOrientation: boolean;
        isFullScreen: boolean;
        isLandscape: boolean;
        isPortrait: boolean;
        leaveIncorrectOrientation: Phaser.Signal;
        margin: Phaser.Point;
        maxHeight: number;
        maxIterations: number;
        maxWidth: number;
        minHeight: number;
        minWidth: number;
        orientation: number;
        orientationSprite: any;
        pageAlignHorizontally: boolean;
        pageAlignVertically: boolean;
        scaleFactor: Phaser.Point;
        scaleFactorInversed: Phaser.Point;
        width: number;
        //methods
        checkOrientation(event: any): void;
        checkOrientationState(): void;
        checkResize(event: any): void;
        forceOrientation(forceLandscape: boolean, forcePortrait?: boolean, orientationImage?: string): void;
        fullScreenChange(event: any): void;
        refresh(): void;
        setExactFit(): void;
        setMaximum(): void;
        setScreenSize(force: boolean): void;
        setShowAll(): void;
        setSize(): void;
        startFullScreen(antialias:boolean): void;
        stopFullScreen(): void;
    }

    class State {
        //members
        add: Phaser.GameObjectFactory;
        cache: Phaser.Cache;
        camera: Phaser.Camera;
        game: Phaser.Game;
        input: Phaser.Input;
        load: Phaser.Loader;
        math: Phaser.Math;
        particles: Phaser.Particles;
        physics: Phaser.Physics.Arcade;
        sound: Phaser.SoundManager;
        stage: Phaser.Stage;
        time: Phaser.Time;
        tweens: Phaser.TweenManager;
        world: Phaser.World;
        //methods
        create(): void;
        destroy(): void;
        loadRender(): void;
        loadUpdate(): void;
        paused(): void;
        preload(): void;
        render(): void;
        update(): void;
    }

    class StateCycle {
        preUpdate(): void;
        update(): void;
        render(): void;
        postRender(): void;
        destroy(): void;
    }

    class StateManager {
        //constructor
        constructor(game: Phaser.Game, pendingState?: Phaser.State);
        //members
        current: string;
        game: Phaser.Game;
        onCreateCallback: Function;
        onInitCallback: Function;
        onLoadRenderCallback: Function;
        onLoadUpdateCallback: Function;
        onPausedCallback: Function;
        onPreloadCallback: Function;
        onPreRenderCallback: Function;
        onRenderCallback: Function;
        onShutDownCallback: Function;
        onUpdateCallback: Function;
        states: Object;
        //methods
        add(key: string, state: any, autoStart?: boolean): void;
        boot(): void;
        checkState(key: string): boolean;
        destroy(): void;
        dummy(): void;
        getCurrentState(): Phaser.State;
        link(key: string): void;
        loadComplete(): void;
        pause(): void;
        preRender(): void;
        remove(key: string): void;
        render(): void;
        resume(): void;
        start(key: string, clearWorld?: boolean, clearCache?: boolean): void;
        update(): void;
    }

    class Text {
        //constructor
        constructor(game: Phaser.Game, x: number, y: number, text: string, style: any);
        //members
        alive: boolean;
        anchor: Phaser.Point;
        angle: number;
        cameraOffset: Phaser.Point;
        content: string;
        exists: boolean;
        fixedToCamera: boolean;
        font: string;
        game: Phaser.Game;
        group: Phaser.Group;
        name: string;
        position: Phaser.Point;
        renderable: boolean;
        scale: Phaser.Point;
        type: number;
        text: string;
        style: any;
        x: number;
        y: number;
        visible: boolean;
        //is this member still used?
        scrollFactor: Phaser.Point;
        //methods
        destroy(): void;
        update(): void;
    }

    class Tile {
        //constructor
        constructor(layer: Object, index: number, x: number, y: Number, width: number, height: number);
        //members
        alpha: number;
        bottom: number;
        callback: Function;
        callbackContext: Object;
        canCollide: boolean;
        collideDown: boolean;
        collideLeft: boolean;
        collideNone: boolean;
        collideRight: boolean;
        collides: boolean;
        collideUp: boolean;
        faceBottom: boolean;
        faceLeft: boolean;
        faceRight: boolean;
        faceTop: boolean;
        game: Phaser.Game;
        height: number;
        index: number;
        layer: number;
        left: number;
        properties: Object;
        right: number;
        scanned: boolean;
        top: number;
        width: number;
        x: number;
        y: number;
        //are these members still used?
        mass: number;
        separateX: boolean;
        separateY: boolean;
        tilemap: Tilemap;
        //methods
        destroy(): void;
        resetCollsion(): void;
        setCollision(left: boolean, right: boolean, up: boolean, down: boolean, reset: boolean, seperateX: boolean, seperateY: boolean): void;
        setCollisionCallback(callback: Function, context: Object): void;
        //is this method still valid?
        toString(): string;
        copy(tile: Phaser.Tile): void;
    }

    class Tilemap {
        //constructor
        constructor(game: Phaser.Game, key?: string);
        //static members
        static CSV: number;
        static TILED_JSON: number;
        //members
        currentLayer: number;
        debugMap: any[];
        game: Phaser.Game;
        height: number;
        heightInPixels: number;
        images: any[];
        key: string;
        layers: Phaser.TilemapLayer[];
//review
        objects: any[];
        orientation: string;
        properties: Object;
        tileHeight: number;
        tiles: Phaser.Tile[];
        tilesets: Phaser.Tileset[];
        tileWidth: number;
        version: number;
        width: number;
        widthInPixels: number;
        //are these members still valid?
        group: Phaser.Group;
        name: string;
        renderOrderID: number;
        collisionCallback: Function;
        exists: boolean;
        visible: boolean;
        position: Phaser.Point;
        type: number;
        renderer: Phaser.TilemapRenderer;
        mapFormat: string;
        //methods
        addTilesetImage(tileset: string, key?: string): void;
        calculateFaces(layer: number): void;
        copy(x: number, y: number, width: number, height: number, layer?: any): Phaser.Tile[];
        create(name: string, width: number, height: number): void;
        createFromObjects(name: string, gid: number, key: string, frame?: any, exists?: boolean, autoCull?: boolean, group?: Phaser.Group): void;
        createLayer(layer: any, width?: number, height?: number, group?: Phaser.Group): Phaser.TilemapLayer;
        destroy(): void;
        dump(): void;
        fill(index: number, x: number, y: number, width: number, height: number, layer?: any): void;
        forEach(callback: number, context: any, x: number, y: Number, width: number, height: number, layer?: any): void;
        getImageIndex(name: string): number;
        getIndex(location: any[], name: string): number;
        getLayer(layer: any): number;
        getLayerIndex(name: string): number;
        getObjectIndex(name: string): number;
        getTile(x: number, y: number, layer?: any): Phaser.Tile;
        getTileAbove(layer: number, x: number, y: number): Phaser.Tile;
        getTileBelow(layer: number, x: number, y: number): Phaser.Tile;
        getTileLeft(layer: number, x: number, y: number): Phaser.Tile;
        getTileRight(layer: number, x: number, y: number): Phaser.Tile;
        getTilesetIndex(name: string): number;
        getTileWorld(x: number, y: number, layer?: any): Phaser.Tile;
        paste(x: number, y: number, tileblock: Phaser.Tile[], layer?: any): void;
        putTile(tile: any, x: number, y: number, layer?: any): void;
        putTileWorldXY(tile: any, x: number, y: number, tileWidth: number, tileHeight: number, layer?: any): void;
        random(x: number, y: number, width: number, height: number, layer?: any): void;
        removeAllLayers(): void;
        replace(source: number, dest: number, x: number, y: number, width: number, height: number, layer?: any): void;
        setCollision(indexes: any, collides?: boolean, layer?: any): void;
        setCollisionBetween(start: number, stop: number, collides?: boolean, layer?: any): void;
        setCollisionByExclusion(indexes: any[], collides?: boolean, layer?: any): void;
        setCollisionByIndex(index: number, collides?: boolean, layer?: number, recalculate?: boolean): void;
        setCollisionCallback(callback: Function, callbackContext: Object): void;
        setLayer(layer: any): void;
        setTileIndexCallback(indes: any, callback: Function, callbackContext: Object, layer?: any): void;
        setTileLocationCallback(x: number, y: number, width: number, height: number, callback: Function, callbackContext: Object, layer?: any): void;
        shuffle(x: number, y: number, width: number, height: number, layer: any): void;
        swapTile(tileA: number, tileB: number, x: number, y: number, width: number, height: number, layer: any): void;
        //are these methods still valid?
        parseCSV(data: string, key: string, tileWidth: number, tileHeight: number): void;
        parseTiledJSON(json: string, key: string): void;
        generateTiles(quantity: number): void;
        setCollisionRange(start: number, end: number, collision: number, resetCollisions?: boolean, separateX?: boolean, separateY?: boolean): void;
        getTileByIndex(value: number): Tile;
        getTileFromWorldXY(x: number, y: number, layer?: number): Tile;
        getTileFromInputXY(layer?: number): Tile;
        getTileOverlaps(object: Object): Array<any>;
        collide(objectOrGroup: any, callback: Function, context: Object): boolean;
        collideGameObject(object: Object): boolean;
        update(): void;
    }

    class TilemapLayer {
        //constructor
        constructor(game: Phaser.Game, tilemap: Phaser.Tilemap, index: number, width: number, height: number);
        //members
        alpha: number;
        baseTexture: any;
        cameraOffset: Phaser.Point;
        canvas: HTMLCanvasElement;
        collisionHeight: number;
        collisionWidth: number;
        context: CanvasRenderingContext2D;
        debug: boolean;
        debugAlpha: number;
        debugCallbackColor: string;
        debugColor: string;
        debugFill: boolean;
        debugFillColor: string;
        dirty: boolean;
        fixedToCamera: boolean;
        game: Phaser.Game;
        index: number;
        layer: Object;
        map: Phaser.Tilemap;
        name: string;
        scrollFactorX: number;
        scrollFactorY: number;
        scrollX: number;
        scrollY: number;
        texture: any;
        textureFrame: Phaser.Frame;
        tileColor: string;
        type: number;
        visible: boolean;
        //methods
        getTiles(x: number, y: number, width: number, height: number, collides?: boolean): any[];
        getTileX(x: number): Phaser.Tile;
        getTileXY(x: number, y: number, point: Object): any;
        getTileY(y: number): Phaser.Tile;
        postUpdate(): void;
        render(): void;
        renderDebug(): void;
        resizeWorld(): void;
        updateMax(): void;
    }

    class TilemapParser {
        //static methods
        static parse(game: Phaser.Game, key: string): Phaser.Tileset;
        static parseCSV(data: string): Phaser.Tilemap;
        static parseJSON(json: Object): Phaser.Tilemap;
        static tileset(game: Phaser.Game, key: string, tileWidth: number, tileHeight: number, tileMargin?: number, tileSpacing?: number, rows?: number, colums?: number, total?: number): Phaser.Tileset;
    }

    //may be unused
    class TilemapRenderer {
        //constructor
        constructor(game: Phaser.Game);
        //members
        game: Phaser.Game;
        //methods
        render(tilemap: Tilemap): void;
    }

    class Tileset {
        //constructor
        constructor(name: string, firstgid: number, width: number, height: number, margin: number, spacing: number, properties: Object);
        //members
        colums: number;
        firstgid: number;
        image: Object;
        name: string;
        properties: Object;
        rows: number;
        tileHeight: number;
        tileMargin: number;
        tileSpacing: number;
        tileWidth: number;
        total: number;
        //methods
        checkTileIndex(index: number): boolean;
        getTile(index: number): Phaser.Tile;
        getTileX(index: number): Phaser.Tile;
        getTileY(index: number): Phaser.Tile;
        setSpacing(tileMargin?: number, tileSpacing?: number): void;
    }

    class TileSprite extends Sprite {
        //constructor
        constructor(game: Phaser.Game, x: number, y: number, width: number, height: number, key?: any);
        //members
        texture: any;
        tilePosition: Phaser.Point;
        tileScale: Phaser.Point;
    }

    class Time {
        //constructor
        constructor(game: Phaser.Game);
        //members
        elapsed: number;
        events: Phaser.Timer;
        fps: number;
        fpsMax: number;
        fpsMin: number;
        frames: number;
        game: Phaser.Game;
        lastTime: number;
        msMax: number;
        msMin: number;
        now: number;
        pausedTime: number;
        pauseDuration: number;
        physicsElapsed: number;
        time: number;
        timeToCall: number;
        //methods
        boot(): void;
        create(autoDestroy?: boolean): Phaser.Timer;
        elapsedSecondsSince(since: number): number;
        elapsedSince(since: number): number;
        removeAll(): void;
        reset(): void;
        totalElapsedSeconds(): number;
        update(time: number): void;
    }

    class Timer {
        //constructor
        constructor(game: Phaser.Game, autoDestroy?: boolean);
        //static members
        static HALF: number;
        static MINUTE: number;
        static QUARTER: number;
        static SECOND: number;
        //members
        autoDestroy: boolean;
        duration: number;
        events: Phaser.TimerEvent[];
        expired: boolean;
        game: Phaser.Game;
        length: number;
        ms: number;
        next: number;
        nextTick: number;
        onComplete: Phaser.Signal;
        running: boolean;
        paused: boolean;
        seconds: number;
        //methods
        add(delay: number, callback: Function, callbackContext: Object, ...args: any[]): Phaser.TimerEvent;
        destroy(): void;
        loop(delay: number, callback: Function, callbackContext: Object, ...args: any[]): Phaser.TimerEvent;
        order(): void;
        pause(): void;
        remove(event: Phaser.TimerEvent): boolean;
        repeat(delay: number, repeatCount: number, callback: Function, callbackContext: Object, ...args: any[]): Phaser.TimerEvent;
        resume(): void;
        sortHandler(): number;
        start(): void;
        stop(): void;
        update(time: number): boolean;
    }

    class TimerEvent {
        //constructor
        constructor(timer: Phaser.Timer, delay: number, tick: number, repeatCount: number, loop: boolean, callback: Function, callbackContext, Object, args: any[]);
        //members
        args: any[];
        callback: Function;
        callbackContext: Object;
        delay: number;
        loop: boolean;
        pendingDelete: boolean;
        repeatCount: number;
        tick: number;
        timer: Phaser.Timer;
    }

    class Touch {
        //constructor
        constructor(game: Phaser.Game);
        //members
        callbackContext: Object;
        disabled: boolean;
        event: any;
        game: Phaser.Game;
        preventDefault: boolean;
        touchCancelCallback: Function;
        touchEndCallback: Function;
        touchEnterCallback: Function;
        touchLeaveCallback: Function;
        touchMoveCallback: Function;
        touchStartCallback: Function;
        //methods
        consumeTouchMove(): void;
        onTouchCancel(event: any): void;
        onTouchEnd(event: any): void;
        onTouchEnter(event: any): void;
        onTouchLeave(event: any): void;
        onTouchMove(event: any): void;
        onTouchStart(event: any): void;
        start(): void;
        consumeDocumentTouches(): void;
        stop(): void;
    }

    class Tween {
        //constructor
        constructor(object: Object, game: Phaser.Game);
        //members
        game: Phaser.Game;
        isRunning: boolean;
        onComplete: Phaser.Signal;
        onLoop: Phaser.Signal;
        onStart: Phaser.Signal;
        pendingDelete: boolean;
        //methods:
        chain(...tweens: Phaser.Tween[]): Phaser.Tween;
        delay(amount: number): Phaser.Tween;
        easing(easing: Function): Phaser.Tween;
        interpolation(interpolation: Function): Phaser.Tween;
        loop(): Phaser.Tween;
        onUpdateCallback(callback: Function): Phaser.Tween;
        onStartCallback(callback: Function): Phaser.Tween;
        onCompleteCallback(callback: Function): Phaser.Tween;
        pause(): void;
        repeat(times: number): Phaser.Tween;
        resume(): void;
        start(time: number): Phaser.Tween;
        stop(): Phaser.Tween;
        to(properties: Object, duration?: number, ease?: Function, autoStart?: boolean, delay?: number, repeat?: boolean, yoyo?: boolean): Phaser.Tween;
        update(time: number): boolean;
        yoyo(yoyo: boolean): Phaser.Tween;
    }

    class TweenManager {
        //constructor
        constructor(game: Phaser.Game);
        //members
        game: Phaser.Game;
        //methods
        add(tween: Phaser.Tween): Phaser.Tween;
        create(object: Object): Phaser.Tween;
        getAll(): Phaser.Tween[];
        isTweening(object: Object): boolean;
        remove(tween: Phaser.Tween): Phaser.Tween;
        removeAll(): void;
        resumeAll(): void;
        update(): boolean;
        pauseAll(): void;
    }

    module Utils {
        class Debug {
            //constructor
            constructor(game: Phaser.Game);
            //members
            columnWidth: number;
            context: CanvasRenderingContext2D;
            currentAlpha: number;
            currentX: number;
            currentY: number;
            font: string;
            game: Phaser.Game;
            lineHeight: number;
            renderShadow: boolean;
            //methods
            line(text: string, x: number, y: number): void;
            renderBodyInfo(sprite: Phaser.Sprite, x: number, y: Number, color?: string): void;
            renderCameraInfo(camera: Phaser.Camera, x: number, y: number, color?: string): void;
            renderCircle(circle: Phaser.Circle, color?: string): void;
            renderInputInfo(x: number, y: number, color?: string): void;
            renderLine(line: Phaser.Line, color: string): void;
            renderLineInfo(line: Phaser.Line, x: number, y: number, color?: string): void;
            renderPhysicsBody(body: Phaser.Physics.Arcade.Body, color?: string): void;
            renderPixel(x: number, y: number, color?: string): void;
            renderPoint(point: Phaser.Point, color?: string): void;
            renderPointer(pointer: Phaser.Pointer, hideIfUp?: boolean, downColor?: string, upColor?: string, color?: string): void;
            renderPointInfo(point: Phaser.Point, x: number, y: number, color?: string): void;
            renderPolygon(polygon: any[], color?: string): void;
            renderQuadTree(quadtree: Phaser.QuadTree, color: string): void;
            renderRectangle(rect: Phaser.Rectangle, color?: string): void;
            renderSoundInfo(sound: Phaser.Sound, x: number, y: number, color?: string): void;
            renderSpriteBody(sprite: Phaser.Sprite, color?: string): void;
            renderSpriteBounds(sprite: Phaser.Sprite, color?: string, fill?: boolean): void;
            renderSpriteCoords(line: Phaser.Sprite, x: number, y: number, color?: string): void;
            renderSpriteCorners(sprite: Phaser.Sprite, showText?: boolean, showBounds?: boolean, color?: string): void;
            renderSpriteInfo(sprite: Phaser.Sprite, x: number, y: number, color?: string): void;
            renderSpriteInputInfo(sprite: Phaser.Sprite, x: number, y: number, color?: string): void;
            renderText(text: string, x: number, y: number, color?: string, font?: string): void;
            splitline(text: string): void;
            start(x?: number, y?: number, color?: string, columnWidth?:number): void;
            stop(): void;
        }
    }

    class World extends Phaser.Group{
        //constructor
        constructor(game: Phaser.Game);
        //members
        bounds: Phaser.Rectangle;
        camera: Phaser.Camera;
        centerX: number;
        centerY: number;
        currentRenderOrderID: number;
        game: Phaser.Game;
        height: number;
        randomX: number;
        randomY: number;
        visible: boolean;
        width: number;
        //methods
        boot(): void;
        destroy(): void;
        preUpdate(): void;
        postUpdate(): void;
        setBounds(x: number, y: number, width: number, height: number): void;
        update(): void;
    }
}
