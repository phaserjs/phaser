// Type definitions for PIXI 1.5.2
// Project: https://github.com/GoodBoyDigital/pixi.js/
// Original 1.3 by: xperiments <http://github.com/xperiments> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module PIXI {

    /* CONSTANTS */
    export var WEBGL_RENDERER: number;
    export var CANVAS_RENDERER: number;
    export var VERSION: string;

    export enum blendModes {

        NORMAL,
        ADD,
        MULTIPLY,
        SCREEN,
        OVERLAY,
        DARKEN,
        LIGHTEN,
        COLOR_DODGE,
        COLOR_BURN,
        HARD_LIGHT,
        SOFT_LIGHT,
        DIFFERENCE,
        EXCLUSION,
        HUE,
        SATURATION,
        COLOR,
        LUMINOSITY

    }

    export enum scaleModes {

        DEFAULT,
        LINEAR,
        NEAREST

    }

    export var INTERACTION_FREQUENCY: number;
    export var AUTO_PREVENT_DEFAULT: boolean;
    export var RAD_TO_DEG: number;
    export var DEG_TO_RAD: number;

    /* MODULE FUNCTIONS */
    export function autoDetectRenderer(width: number, height: number, view?: HTMLCanvasElement, transparent?: boolean, antialias?: boolean): IPixiRenderer;
    export function AjaxRequest(): XMLHttpRequest;
    export function canUseNewCanvasBlendModes(): boolean;
    export function getNextPowerOfTwo(): number;
    export function rgb2hex(rgb: any): number;
    export function hex2rgb(hex: number): any;

    /*INTERFACES*/
    export interface IBasicCallback {
        (): void
    }

    export interface IEventCallback {
        (e?: IEvent): void
    }

    export interface IEvent {
        type: string;
        content: any;
    }

    export interface IHitArea {
        contains(x: number, y: number): boolean;
    }

    export interface IInteractionDataCallback {
        (interactionData: InteractionData): void
    }

    export interface IPixiRenderer {
        view: HTMLCanvasElement;
        render(stage: Stage): void;
    }

    export interface IBitmapTextStyle {
        font?: string;
        align?: string;
        tint?: string;
    }

    export interface ITextStyle {
        font?: string;
        stroke?: string;
        fill?: string;
        align?: string;
        strokeThickness?: number;
        wordWrap?: boolean;
        wordWrapWidth?: number;
    }

    export interface IUniform {
        type: string;
        value: any;
    }

    export interface ILoader {

        constructor(url: string, crossorigin: boolean);

        load();
    }

    export interface ITintMethod {
        (texture: Texture, color: number, canvas: HTMLCanvasElement): void;
    }

    export interface IMaskData {
        alpha: number;
        worldTransform: number[];
    }

    export interface IRenderSession // unclear; Taken from DisplayObjectContainer:152
    {
        context: CanvasRenderingContext2D;
        maskManager: CanvasMaskManager;
        scaleMode: scaleModes;
        smoothProperty: string;
    }

    export interface IShaderAttribute {
        // TODO: Find signature of shader attributes
    }

    export interface IFilterBlock {
        // TODO: Find signature of filterBlock
    }

    export interface IMatrix {
        // TODO: Find signature of Matrix
    }

    /* CLASSES */

    export class AbstractFilter {

        passes: AbstractFilter[];
        shaders: PixiShader[];
        dirty: boolean;
        padding: number;
        uniforms: { [name: string]: IUniform };
        fragmentSrc: any[];

    }

    export class AlphaMaskFilter extends AbstractFilter {

        map: Texture;

        constructor(texture: Texture);

        onTextureLoaded(): void;

    }

    export class AssetLoader extends EventTarget {

        assetURLs: string[];
        crossorigin: boolean;
        loadersByType: { [key: string]: ILoader };

        constructor(assetURLs: string[], crossorigin: boolean);

        load(): void;

    }

    export class AtlasLoader extends EventTarget {

        url: string;
        baseUrl: string;
        crossorigin: boolean;
        loaded: boolean;

        constructor(url: string, crossorigin: boolean);

        load(): void;

    }

    export class BaseTexture extends EventTarget {

        id: number;
        height: number;
        width: number;
        source: HTMLImageElement;
        scaleMode: scaleModes;
        hasLoaded: boolean;

        constructor(source: HTMLImageElement, scaleMode: scaleModes);
        constructor(source: HTMLCanvasElement, scaleMode: scaleModes);

        destroy(): void;
        updateSourceImage(newSrc: string): void;

        static fromImage(imageUrl: string, crossorigin: boolean, scaleMode: scaleModes): BaseTexture;
        static fromCanvas(canvas: HTMLCanvasElement, scaleMode: scaleModes): BaseTexture;

    }

    export class BitmapFontLoader extends EventTarget {

        baseUrl: string;
        crossorigin: boolean;
        texture: Texture;
        url: string;

        constructor(url: string, crossorigin: boolean);

        load(): void;

    }

    export class BitmapText extends DisplayObjectContainer {

        width: number;
        height: number;
        fontName: string;
        fontSize: number;
        tint: number;
        textWidth: number;
        textHeight: number;

        constructor(text: string, style: IBitmapTextStyle);

        setText(text: string): void;
        setStyle(style: IBitmapTextStyle): void;

    }

    export class BlurFilter extends AbstractFilter {

        blur: number;
        blurX: number;
        blurY: number;

    }

    export class BlurXFilter extends AbstractFilter {

        blur: number;

    }

    export class BlurYFilter extends AbstractFilter {

        blur: number;

    }

    export class CanvasMaskManager {

        pushMask(maskData: IMaskData, context: CanvasRenderingContext2D): void;
        popMask(context: CanvasRenderingContext2D): void;

    }

    export class CanvasRenderer implements IPixiRenderer {

        type: number;
        clearBeforeRender: boolean;
        roundPixels: boolean;
        transparent: boolean;
        width: number;
        height: number;
        view: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        refresh: boolean;
        count: number;
        maskManager: CanvasMaskManager;
        renderSession: IRenderSession;

        constructor(width: number, height: number, view?: HTMLCanvasElement, transparent?: boolean);

        render(stage: Stage): void;
        resize(width: number, height: number): void;

    }

    export class CanvasTinter {

        canvas: HTMLCanvasElement;

        getTintedTexture(sprite: Sprite, color: number): HTMLCanvasElement;
        tintWithMultiply(texture: Texture, color: number, canvas: HTMLCanvasElement): void;
        tintWithOverlay(texture: Texture, color: number, canvas: HTMLCanvasElement): void;
        tintWithPerPixel(texture: Texture, color: number, canvas: HTMLCanvasElement): void;

        static cacheStepsPerColorChannel: number;
        static convertTintToImage: boolean;
        static canUseMultiply: boolean;
        static tintMethod: ITintMethod;

        static roundColor(color: number): number;

    }

    export class Circle implements IHitArea {

        x: number;
        y: number;
        radius: number;

        constructor(x: number, y: number, radius: number);

        clone(): Circle;
        contains(x: number, y: number): boolean;

    }

    export class ColorMatrixFilter extends AbstractFilter {

        matrix: number[];

    }

    export class ColorStepFilter extends AbstractFilter {

        step: number;

    }

    export class CrossHatchFilter extends AbstractFilter {

        blur: number;

    }

    export class DisplacementFilter extends AbstractFilter {

        map: Texture;
        offset: Point;
        scale: Point;

        constructor(texture: Texture);

    }

    export class DotScreenFilter extends AbstractFilter {

        scale: Point;
        angle: number;

    }

    export class DisplayObject {

        alpha: number;
        buttonMode: boolean;
        defaultCursor: string;
        filterArea: Rectangle;
        filters: AbstractFilter[];
        hitArea: IHitArea;
        interactive: boolean;
        mask: Graphics;
        parent: DisplayObjectContainer;
        pivot: Point;
        position: Point;
        renderable: boolean;
        rotation: number;
        scale: Point;
        stage: Stage;
        visible: boolean;
        worldAlpha: number;
        worldVisible: boolean;
        worldTransform: IMatrix;
        x: number;
        y: number;

        click(e: InteractionData): void;
        getBounds(matrix?: IMatrix): Rectangle;
        getLocalBounds(): Rectangle;
        generateTexture(renderer: PIXI.IPixiRenderer): RenderTexture;
        mousedown(e: InteractionData): void;
        mouseout(e: InteractionData): void;
        mouseover(e: InteractionData): void;
        mouseup(e: InteractionData): void;
        mouseupoutside(e: InteractionData): void;
        setStageReference(stage: Stage): void;
        tap(e: InteractionData): void;
        touchend(e: InteractionData): void;
        touchendoutside(e: InteractionData): void;
        touchstart(e: InteractionData): void;

    }

    export class DisplayObjectContainer extends PIXI.DisplayObject {

        height: number;
        width: number;
        children: DisplayObject[];

        addChild(child: DisplayObject): void;
        addChildAt(child: DisplayObject, index: number): void;
        getChildAt(index: number): DisplayObject;
        removeChild(child: DisplayObject): void;
        removeStageReference(): void;

    }

    export class Ellipse implements IHitArea {

        x: number;
        y: number;
        width: number;
        height: number;

        constructor(x: number, y: number, width: number, height: number);

        clone(): Ellipse;
        contains(x: number, y: number): boolean;
        getBounds(): Rectangle;
    }

    export class EventTarget {

        listeners: { [key: string]: IEventCallback[] };

        addEventListener(type: string, listener: IEventCallback): void;
        dispatchEvent(event: IEvent): void;
        removeAllEventListeners(type: string): void;
        removeEventListener(type: string, listener: IEventCallback): void;

    }

    export class FilterBlock {

        visible: boolean;
        renderable: boolean;

    }

    export class FilterTexture {

        fragmentSrc: string[];
        gl: any;
        program: any;

        constructor(gl: any, width: number, height: number);
        clear(): void;
        resize(width: number, height: number): void;
        destroy(): void;

    }

    export class Graphics extends Texture {

        blendMode: blendModes;
        bounds: Rectangle;
        boundsPadding: number;
        fillAlpha: number;
        isMask: boolean;
        lineColor: string;
        lineWidth: number;
        renderable: boolean;
        tint: number;

        beginFill(color: number, alpha: number): void;
        clear(): void;
        drawCircle(x: number, y: number, radius: number): void;
        drawEllipse(x: number, y: number, width: number, height: number): void;
        drawRect(x: number, y: number, width: number, height: number): void;
        endFill(): void;
        generateTexture(): Texture;
        getBounds(): Rectangle;
        lineStyle(lineWidth: number, color: number, alpha: number): void;
        lineTo(x: number, y: number): void;
        moveTo(x: number, y: number): void;
        updateBounds(): void;

    }

    export class GrayFilter extends AbstractFilter {

        gray: number;

    }

    export class ImageLoader extends EventTarget {

        texture: Texture;

        constructor(url: string, crossorigin?: boolean);
        load(): void;
        loadFramedSpriteSheet(frameWidth: number, frameHeight: number, textureName: string): void;

    }

    export class InteractionData {

        global: Point;
        target: Sprite;
        originalEvent: Event;

        getLocalPosition(displayObject: DisplayObject): Point;

    }

    export class InteractionManager {

        currentCursorStyle: string;
        mouse: InteractionData;
        mouseOut: boolean;
        mouseoverEnabled: boolean;
        pool: InteractionData[];
        stage: Stage;
        touchs: { [id: string]: InteractionData };

        constructor(stage: Stage);

        removeEvents(): void;
    }

    export class InvertFilter {

        invert: number;

    }

    export class JsonLoader extends EventTarget {

        baseUrl: string;
        crossorigin: boolean;
        loaded: boolean;
        url: string;

        constructor(url: string, crossorigin?: boolean);

        load(): void;

    }

    export class MovieClip extends Sprite {

        animationSpeed: number;
        currentFrame: number;
        loop: boolean;
        playing: boolean;
        textures: Texture[];
        totalFrames: number;

        constructor(textures: Texture[]);

        onComplete: IBasicCallback;

        gotoAndPlay(frameNumber: number): void;
        gotoAndStop(frameNumber: number): void;
        play(): void;
        stop(): void;

    }

    export class NormalMapFilter extends AbstractFilter {

        map: Texture;
        offset: Point;
        scale: Point;

    }

    export class PixelateFilter extends AbstractFilter {

        size: number;

    }

    export class PixiFastShader {

        gl: any;
        fragmentSrc: string[];
        program: any;
        textureCount: number;
        vertexSrc: string[];

        constructor(gl: any);

        destroy(): void;
        init(): void;

    }

    export class PixiShader {

        defaultVertexSrc: string;
        fragmentSrc: string[];
        gl: any;
        program: any;
        textureCount: number;
        attributes: IShaderAttribute[];
        defaultVertexSr: string;

        constructor(gl: any);

        destroy(): void;
        init(): void;
        initSampler2D(): void;
        initUniforms(): void;
        syncUniforms(): void;

    }

    export class Point {

        x: number;
        y: number;

        constructor(x?: number, y?: number);

        clone(): Point;
        set(x: number, y: number): void;

    }

    export class Polygon implements IHitArea {

        points: Point[];

        constructor(points: Point[]);
        constructor(points: number[]);
        constructor(...points: Point[]);
        constructor(...points: number[]);

        clone(): Polygon;
        contains(x: number, y: number): boolean;

    }

    export class PrimitiveShader {

        gl: any;
        program: any;
        fragmentSrc: string[];
        vertextSrc: string[];

        destroy(): void;
        init(): void;

    }

    export class Rectangle implements IHitArea {

        x: number;
        y: number;
        width: number;
        height: number;

        constructor(x?: number, y?: number, width?: number, height?: number);

        clone(): Rectangle;
        contains(x: number, y: number): boolean;

    }

    export class RenderTexture extends Texture {

        width: number;
        height: number;
        frame: Rectangle;
        baseTexture: BaseTexture;

        constructor(width: number, height: number, renderer: IPixiRenderer);

        resize(width: number, height: number): void;

    }

    export class RGBSplitFilter extends AbstractFilter {

        angle: number;

    }

    export class Rope {

        points: Point[];
        vertices: Float32Array;
        uvs: Float32Array;
        colors: Float32Array;
        indices: Uint16Array;

        constructor(texture: Texture, points: Point[]);

        refresh(): void;
        setTexture(texture: Texture);

    }

    export class SepiaFilter {

        sepia: number;

    }

    export class SmartBlurFilter {

        blur: number;

    }

    export class Spine {

        url: string;
        crossorigin: boolean;
        loaded: boolean;

        constructor(url: string);

        createSprite(slot: any, descriptor: string): Sprite;

        load();
    }

    export class SpineLoader extends EventTarget {

        url: string;
        crossorigin: boolean;
        loaded: boolean;

        constructor(url: string, crossorigin?: boolean);

        load(): void;

    }

    export class Sprite extends DisplayObjectContainer {

        anchor: Point;
        blendMode: number;
        texture: Texture;
        height: number;
        width: number;
        tint: number;

        constructor(texture: Texture);

        getBounds(matrix?: IMatrix): Rectangle;
        setTexture(texture: Texture): void;

        static fromFrame(frameId: string): Sprite;
        static fromImage(url: string): Sprite;

    }

    export class SpriteBatch {

        constructor(texture: Texture);

    }

    /* TODO determine type of frames */
    export class SpriteSheetLoader extends EventTarget {

        url: string;
        crossorigin: boolean;
        baseUrl: string;
        texture: Texture;
        frames: Object;

        constructor(url: string, crossorigin?: boolean);

        load();
    }

    export class Stage extends DisplayObjectContainer {

        interactive: boolean;
        interactionManager: InteractionManager;
        worldTransform: IMatrix;

        constructor(backgroundColor: number);

        getMousePosition(): Point;
        setBackgroundColor(backgroundColor: number): void;
        setInteractionDelegate(domElement: HTMLElement): void;

    }

    export class Strip extends DisplayObjectContainer {

        constructor(texture: Texture, width: number, height: number);

    }

    export class StripShader {

        program: any;
        fragmentSrc: string[];
        vertexSrc: string[];

        init(): void;

    }

    export class Text extends Sprite {

        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;

        constructor(text: string, style: ITextStyle);

        destroy(destroyTexture: boolean): void;
        setText(text: string): void;
        setStyle(style: ITextStyle): void;

    }

    export class Texture extends EventTarget {

        baseTexture: BaseTexture;
        frame: Rectangle;
        trim: Point;
        width: number;
        height: number;

        constructor(baseTexture: BaseTexture, frame?: Rectangle);

        destroy(destroyBase?: boolean): void;
        setFrame(frame: Rectangle): void;
        render(displayObject: DisplayObject, position: Point, clear: boolean): void;

        static fromImage(imageUrl: string, crossorigin: boolean, scaleMode: scaleModes): Texture;
        static fromFrame(frameId: string): Texture;
        static fromCanvas(canvas: HTMLCanvasElement, scaleMode: scaleModes): Texture;
        static addTextureToCache(texture: Texture, id: string): void;
        static removeTextureFromCache(id: string): Texture;

    }

    export class TilingSprite extends DisplayObjectContainer {

        width: number;
        height: number;
        renderable: boolean;
        texture: Texture;
        tint: number;
        tilePosition: Point;
        tileScale: Point;
        tileScaleOffset: Point;
        blendMode: blendModes;

        constructor(texture: Texture, width: number, height: number);

        generateTilingTexture(forcePowerOfTwo: boolean): void;

    }

    export class TwistFilter extends AbstractFilter {

        size: Point;
        angle: number;
        radius: number;

    }

    export class WebGLFastSpriteBatch {

        vertSize: number;
        maxSize: number;
        size: number;
        vertices: Float32Array;
        indices: Uint16Array;
        vertextBuffer: any;
        indexBuffer: any;
        lastIndexCount: number;
        drawing: boolean;
        currentBatchSize: number;
        currentBaseTexture: Texture;
        currentBlendMode: number;
        renderSession: any;
        shader: any;
        matrix: any;

        begin(spriteBatch: any, renderSession: any): void;
        end(): void;
        flush(): void;
        render(spriteBatch: any): void;
        renderSprite(sprite: any): void;
        stop(): void;
        start(): void;
        setContext(gl: any): void;
        setBlendMode(blendMode: PIXI.blendModes): void;

    }

    export class WebGLFilterManager {

        filterStack: AbstractFilter[];
        transparent: boolean;
        offsetX: number;
        offsetY: number;

        constructor(gl: any, transparent: boolean);

        applyFilterPass(filter: AbstractFilter, filterArea: Texture, width: number, height: number): void;
        begin(renderSession: IRenderSession, buffer: ArrayBuffer): void;
        destroy(): void;
        initShaderBuffers(): void;
        pushFilter(filterBlock: IFilterBlock): void;
        popFilter(): void;
        setContext(gl: any);

    }

    export class WebGLGraphics {

    }

    export class WebGLMaskManager {

        constructor(gl: any);

        destroy(): void;
        pushMask(maskData: any[], renderSession: IRenderSession): void;
        popMask(renderSession: IRenderSession): void;
        setContext(gl: any);

    }

    export class WebGLRenderer implements IPixiRenderer {

        contextLost: boolean;
        width: number;
        height: number;
        transparent: boolean;
        view: HTMLCanvasElement;

        constructor(width: number, height: number, view?: HTMLCanvasElement, transparent?: boolean, antialias?: boolean);

        destroy(): void;
        render(stage: Stage): void;
        renderDisplayObject(displayObject: DisplayObject, projection: Point, buffer: any): void;
        resize(width: number, height: number): void;

        static createWebGLTexture(texture: Texture, gl: any): void;

    }

    export class WebGLShaderManager {

        activatePrimitiveShader(): void;
        activateShader(shader: PixiShader): void;
        deactivatePrimitiveShader(): void;
        destroy(): void;
        setAttribs(attribs: IShaderAttribute[]): void;
        setContext(gl: any, transparent: boolean);

    }

    export class WebGLShaderUtils {



    }

    export class WebGLSpriteBatch {

        currentBatchSize: number;
        currentBaseTexture: any;
        drawing: boolean;
        indices: Uint16Array;
        lastIndexCount: number;
        size: number;
        vertices: Float32Array;
        vertSize: number;

        constructor(gl: any);

        begin(renderSession: IRenderSession): void;
        flush(): void;
        end(): void;
        destroy(): void;
        render(sprite: Sprite): void;
        renderTilingSprite(sprite: TilingSprite): void;
        setBlendMode(blendMode: blendModes): void;
        setContext(gl: any): void;
        start(): void;
        stop(): void;

    }
}

declare module PIXI.PolyK {

    export function Triangulate(p: number[]): number[];

}

declare function canUseNewCanvasBlendModes(): boolean;
declare function getBounds(): Phaser.Rectangle;
declare function getNextPowerOfTwo(value: number): number;
declare function hex2rgb(hex: number): number[];
declare function hitText(displayObject: any): boolean;
declare function rgb2hex(rgb: number[]): number;

declare class Phaser {

    static VERSION: string;
    static DEV_VERSION: string;
    static GAMES: Phaser.Game[];

    static AUTO: number;
    static CANVAS: number;
    static WEBGL: number;
    static HEADLESS: number;

    static BITMAPDATA: number;
    static BITMAPTEXT: number;
    static BUTTON: number;
    static CANVAS_FILTER: number;
    static ELLIPSE: number;
    static EMITTER: number;
    static GRAPHICS: number;
    static GROUP: number;
    static IMAGE: number;
    static POLYGON: number;
    static RENDERTEXTURE: number;
    static RETROFONT: number;
    static SPRITE: number;
    static SPRITEBATCH: number;
    static TEXT: number;
    static TILEMAP: number;
    static TILEMAPLAYER: number;
    static TILESPRITE: number;
    static WEBGL_FILTER: number;

    static NONE: number;
    static LEFT: number;
    static RIGHT: number;
    static UP: number;
    static DOWN: number;

}

declare module Phaser {

    class Animation {

        constructor(game: Phaser.Game, parent: Phaser.Sprite, name: string, frameData: Phaser.FrameData, frames: any[], delay: number, loop: boolean);

        currentFrame: Phaser.Frame;
        delay: number;
        frame: number;
        frameTotal: number;
        game: Phaser.Game;
        isFinished: boolean;
        isPaused: boolean;
        isPlaying: boolean;
        killOnComplete: boolean;
        loop: boolean;
        loopCount: number;
        name: string;
        onComplete: Phaser.Signal;
        onLoop: Phaser.Signal;
        onStart: Phaser.Signal;
        paused: boolean;
        speed: number;

        complete(): void;
        destroy(): void;
        generateFrameNames(prefix: string, start: number, stop: number, suffix?: string, zeroPad?: number): void;
        onPause(): void;
        onResume(): void;
        play(frameRate?: number, loop?: boolean, killOnComplete?: boolean): Phaser.Animation;
        restart(): void;
        stop(resetFrame?: boolean, dispatchComplete?:boolean): void;
        update(): boolean;

    }

    class AnimationManager {

        constructor(sprite: Phaser.Sprite);

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

        add(name: string, frames?: any[], frameRate?: number, loop?: boolean, useNumericIndex?: boolean): Phaser.Animation;
        destroy(): void;
        getAnimation(name: string): Phaser.Animation;
        play(name: string, frameRate?: number, loop?: boolean, killOnComplete?:boolean): Phaser.Animation;
        refreshFrame();
        stop(name?: string, resetFrame?: boolean): void;
        update(): boolean;
        validateFrames(frames: Phaser.Frame[], useNumericIndex?: boolean): boolean;

    }

    class AnimationParser {

        static JSONData(game: Phaser.Game, json: Object, cacheKey: string): Phaser.FrameData;
        static JSONDataHash(game: Phaser.Game, json: Object, cacheKey: string): Phaser.FrameData;
        static spriteSheet(game: Phaser.Game, key: string, frameWidth: number, frameHeight: number, frameMax?: number, margin?: number, spacing?: number): Phaser.FrameData;
        static XMLData(game: Phaser.Game, xml: Object, cacheKey: string): Phaser.FrameData;

    }

    class BitmapData {

        constructor(game: Phaser.Game, key: string, width?: number, height?: number);

        baseTexture: PIXI.BaseTexture;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        ctx: CanvasRenderingContext2D;
        dirty: boolean;
        game: Phaser.Game;
        height: number;
        imageData: any[];
        key: string;
        pixels: number;
        texture: PIXI.Texture;
        textureFrame: Phaser.Frame;
        type: number;
        width: number;

        add(object: any): void;
        alphaMask(source: any, mask: any): void
        clear(): void;
        copyPixels(source: any, area: Phaser.Rectangle, destX: number, destY: number): void;
        draw(source: any, destX: number, destY: number): void;
        getPixel(x: number, y: number): number;
        getPixel32(x: number, y: number): number;
        getPixels(rect: Phaser.Rectangle): number[];
        refreshBuffer(): void;
        render(): void;
        resize(width: number, height: number): void;
        setPixel(x: number, y: number, red: number, green: number, blue: number): void;
        setPixel32(x: number, y: number, red: number, green: number, blue: number, alpha: number): void;

    }

    class BitmapText extends PIXI.BitmapText {

        constructor(game: Phaser.Game, x: number, y: number, font: string, text?: string, size?: number);

        align: string;
        angle: number;
        cameraOffset: Phaser.Point;
        events: Phaser.Events;
        exists: boolean;
        fixedToCamera: boolean;
        font: string;
        fontSize: number;
        game: Phaser.Game;
        input: Phaser.InputHandler;
        inputEnabled: boolean;
        name: string;
        position: Phaser.Point;
        text: string;
        tint: number;
        type: number;
        world: Phaser.Point;
        z: number;

        destroy(destroyChildren?: boolean): void;
        postUpdate(): void;
        preUpdate(): void;
        update(): void;

    }

    class Button extends Phaser.Image {
  
        constructor(game: Phaser.Game, x?: number, y?: number, key?: string, callback?: Function, callbackContext?: Object, overFrame?: any, outFrame?: any, downFrame?: any, upFrame?: any);

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

        clearFrames(): void;
        setDownSound(sound: Phaser.Sound, marker?: string): void;
        setFrames(overFrame?: any, outFrame?: any, downFrame?: any, upFrame?: any): void;
        onInputDownHandler(sprite: Phaser.Button, pointer: Phaser.Pointer): void;
        onInputUpHandler(sprite: Phaser.Button, pointer: Phaser.Pointer, isOver: boolean): void;
        setOutSound(sound: Phaser.Sound, marker?: string): void;
        setOverSound(sound: Phaser.Sound, marker?: string): void;
        setSounds(overSound?: Phaser.Sound, overMarker?: string, downSound?: Phaser.Sound, downMarker?: string, outSound?: Phaser.Sound, outMarker?: string, upSound?: Phaser.Sound, upMarker?: string): void;
        setState(newState: number): void;
        setUpSound(sound: Phaser.Sound, marker?: string): void;

    }

    class Cache {

        constructor(game: Phaser.Game);

        static BINARY: number;
        static BITMAPDATA: number;
        static BITMAPFONT: number;
        static CANVAS: number;
        static IMAGE: number;
        static JSON: number;
        static PHYSICS: number;
        static SOUND: number;
        static TEXT: number;
        static TEXTURE: number;
        static TILEMAP: number;
 
        game: Phaser.Game;
        onSoundUnlock: Phaser.Signal;
 
        addBinary(key: string, binaryData: Object): void;
        addBitmapData(key: string, bitmapData: Phaser.BitmapData): Phaser.BitmapData;
        addBitmapFont(key: string, texture: Phaser.RetroFont): void;
        addBitmapFont(key: string, url: string, data: Object, xmlData: Object, xSpacing?: number, ySpacing?: number): void;
        addCanvas(key: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void;
        addDefaultImage(): void;
        addImage(key: string, url: string, data: Object): void;
        addJSON(key: string, urL: string, data: Object): void;
        addMisingImage(): void;
        addPhysicsData(key: string, url: string, JSONData: Object, format: number): void;
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
        getBitmapFont(key: string): Phaser.RetroFont;
        getCanvas(key: string): Object;
        getFrame(key: string): Phaser.Frame;
        getFrameByIndex(key: string, frame: string): Phaser.Frame;
        getFrameByName(key: string, frame: string): Phaser.Frame;
        getFrameData(key: string): Phaser.FrameData;
        getImage(key: string): Object;
        getJSON(key:string): Object
        getKeys(array: string[]): string[];
        getPhysicsData(key: string, object?: string): Object;
        getSound(key: string): Phaser.Sound;
        getSoundData(key: string): Object;
        getText(key: string): Object;
        getTextKeys(): string[];
        getTexture(key: string): Phaser.RenderTexture;
        getTextureFrame(key: string): Phaser.Frame;
        getTilemapData(key: string): Object;
        getTilemap(key: string): Object;
        isSoundDecoded(key: string): boolean;
        isSoundReady(key: string): boolean;
        isSpriteSheet(key: string): boolean;
        reloadSound(key: string): void;
        reloadSoundComplete(key: string): void;
        removeBinary(key: string): void;
        removeBitmapData(key: string): void;
        removeBitmapFont(key: string): void;
        removeCanvas(key: string): void;
        removeImage(key: string): void;
        removeJSON(key: string): void;
        removePhysics(key: string): void;
        removeSound(key: string): void;
        removeText(key: string): void;
        removeTilemap(key: string): void;
        updateFrameData(key: string, frameData: any): void;
        updateSound(key: string, property: string, value: Phaser.Sound): void;

    }

    class Camera {

        constructor(game: Phaser.Game, id: number, x: number, y: number, width: number, height: number);

        static FOLLOW_LOCKON: number;
        static FOLLOW_PLATFORMER: number;
        static FOLLOW_TOPDOWN: number;
        static FOLLOW_TOPDOWN_TIGHT: number;

        atLimit: { x: boolean; y: boolean; };
        bounds: Phaser.Rectangle;
        deadzone: Phaser.Rectangle;
        displayObject: PIXI.DisplayObject;
        id: number;
        game: Phaser.Game;
        height: number;
        scale: Phaser.Point;
        screenView: Phaser.Rectangle;
        target: Phaser.Sprite;
        view: Phaser.Rectangle;
        visible: boolean;
        width: number;
        world: Phaser.World;
        x: number;
        y: number;

        checkBounds(): void;
        focusOn(displayObject: any): void;
        focusOnXY(x: number, y: number): void;
        follow(target: Phaser.Sprite, style?: number): void;
        reset(): void;
        setBoundsToWorld(): void;
        setPosition(x: number, y: number): void;
        setSize(width: number, height: number): void;
        update(): void;

    }

    class Canvas {

        static addToDOM(canvas: HTMLCanvasElement, parent: any, overflowHidden?: boolean): HTMLCanvasElement;
        static create(width?: number, height?: number, id?: string, noCocoon?: boolean): HTMLCanvasElement;
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

        constructor(x?: number, y?: number, diameter?: number);

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

        static circumferencePoint(a: Phaser.Circle, angle: number, asDegrees: boolean, out?: Phaser.Point): Phaser.Point;
        static contains(a: Phaser.Circle, x: number, y: number): boolean;
        static equals(a: Phaser.Circle, b: Phaser.Circle): boolean;
        static intersects(a: Phaser.Circle, b: Phaser.Circle): boolean;
        static intersectsRectangle(c: Phaser.Circle, r: Phaser.Rectangle): boolean;

        circumference(): number;
        circumferencePoint(angle: number, asDegrees: boolean, out?: Phaser.Point): Phaser.Point;
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

        constructor(game: Phaser.Game);

        android: boolean;
        arora: boolean;
        audioData: boolean;
        cancelFullScreen: string;
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
        fullScreen: boolean;
        fullScreenKeyboard: boolean;
        getUserMedia: boolean;
        game: Phaser.Game;
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
        pixelRatio: number;
        pointerLock: boolean;
        quirksMode: boolean;
        requestFullScreen: string;
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
        windowsPhone: boolean;
        worker: boolean;

        checkFullScreenSupport(): void;
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

    class Ellipse {

        constructor(x?: number, y?: number, width?: number, height?: number);

        bottom: number;
        empty: boolean;
        height: number;
        left: number;
        right: number;
        top: number;
        width: number;
        x: number;
        y: number;

        static constains(a: Phaser.Ellipse, x: number, y: number): boolean;

        clone(out: Phaser.Ellipse): Phaser.Ellipse;
        contains(x: number, y: number): boolean;
        copyFrom(source: any): Phaser.Ellipse;
        copyTo(dest: any): Object;
        setTo(x: number, y: number, width: number, height: number): Phaser.Ellipse;
        toString(): string;

    }

    class Events {

        constructor(sprite: Phaser.Sprite);
  
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

    }

    class Filter {
 
        constructor(game: Phaser.Game, uniforms: Object, fragmentSrc: any[]);

        dirty: boolean;
        game: Phaser.Game;
        height: number;
        padding: number;
        type: number;
        uniforms: Object;
        fragmentSrc: any[];
        width: number;

        destroy(): void;
        init(): void;
        setResolution(width: number, height: number);
        update(pointer?: Phaser.Pointer): void;

    }

    class Frame {
 
        constructor(index: number, x: number, y: number, width: number, height: number, name: string, uuid: string);

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
     
        getRect(out?: Phaser.Rectangle): Phaser.Rectangle;
        setTrim(trimmed: boolean, actualWidth: number, actualHeight: number, destX: number, destY: number, destWidth: number, destHeight: number): void;

    }

    class FrameData {

        total: number;

        addFrame(frame: Frame): Phaser.Frame;
        checkFrameName(name: string): boolean;
        getFrame(index: number): Phaser.Frame;
        getFrameByName(name: string): Phaser.Frame;
        getFrameIndexes(frames: number[], useNumericIndex?: boolean, output?: number[]): number[]
        getFrameRange(start: number, end: number, output: Phaser.Frame[]): Phaser.Frame[];
        getFrames(frames: number[], useNumericIndex?: boolean, output?: Phaser.Frame[]): Phaser.Frame[];

    }

    class Game {
 
        constructor(width?: number, height?: number, renderer?: number, parent?: any, state?: Object, transparent?: boolean, antialias?: boolean, physicsConfig?: Object);
  
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
        make: Phaser.GameObjectCreator;
        math: Phaser.Math;
        net: Phaser.Net;
        onBlur: Phaser.Signal;
        onFocus: Phaser.Signal;
        onPause: Phaser.Signal;
        onResume: Phaser.Signal;
        parent: HTMLElement;
        particles: Phaser.Particles;
        paused: boolean;
        pendingStep: boolean;
        physics: Phaser.Physics;
        physicsConfig: Object;
        raf: Phaser.RequestAnimationFrame;
        renderer: number;
        renderType: number;
        rnd: Phaser.RandomDataGenerator;
        scale: Phaser.ScaleManager;
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

        boot(): void;
        destroy(): void;
        disableStep(): void;
        enableStep(): void;
        focusGain(event: Object): void;
        focusLoss(event: Object): void;
        gamePaused(event: Object): void;
        gameResumed(event: Object): void;
        parseConfig(config:Object): void;
        setUpRenderer(): void;
        showDebugHeader(): void;
        step(): void;
        update(time: number): void;

    }

    class GameObjectCreator {

        constructor(game: Phaser.Game);
 
        game: Phaser.Game;
        world: Phaser.World;

        audio(key: string, volume?: number, loop?: boolean, connect?: boolean): Phaser.Sound;
        bitmapData(width?: number, height?: number, key?: string, addToCache?: boolean): Phaser.BitmapData;
        bitmapText(x: number, y: number, font: string, text?: string, size?: number): Phaser.BitmapText;
        button(x?: number, y?: number, key?: string, callback?: Function, callbackContext?: Object, overFrame?: any, outFrame?: any, downFrame?: any, upFrame?: any): Phaser.Button;
        emitter(x?: number, y?: number, maxParticles?: number): Phaser.Particles.Arcade.Emitter;
        filter(filter: any, any: any): Phaser.Filter;
        graphics(x: number, y: number): Phaser.Graphics;
        group(parent?: any, name?: string, addToStage?: boolean, enableBody?: boolean, physicsBodyType?: number): Phaser.Group;
        image(x: number, y: number, key: any, frame?: any): Phaser.Sprite;
        renderTexture(width?: number, height?: number, key?: any, addToCache?: boolean): Phaser.RenderTexture;
        retroFont(font: string, characterWidth: number, characterHeight: number, chars: string, charsPerRow: number, xSpacing?: number, ySpacing?: number, xOffset?: number, yOffset?: number): Phaser.RetroFont;
        sound(key: string, volume?: number, loop?: boolean, connect?: boolean): Phaser.Sound;
        sprite(x: number, y: number, key?: any, frame?: any): Phaser.Sprite;
        spriteBatch(parent: any, name?: String, addToStage?: boolean): Phaser.Group;
        text(x: number, y: number, text?: string, style?: Object): Phaser.Text;
        tileMap(key: string, tileWidth?:number, tileHeight?:number, width?:number, height?:number): Phaser.Tilemap;
        tileSprite(x: number, y: number, width: number, height: number, key: any, frame: any): Phaser.TileSprite;
        tween(obj: Object): Phaser.Tween;

    }

    class GameObjectFactory {

        constructor(game: Phaser.Game);

        game: Phaser.Game;
        world: Phaser.World;

        audio(key: string, volume?: number, loop?: boolean, connect?: boolean): Phaser.Sound;
        bitmapData(width?: number, height?: number, key?: string, addToCache?: boolean): Phaser.BitmapData;
        bitmapText(x: number, y: number, font: string, text?: string, size?: number, group?: Phaser.Group): Phaser.BitmapText;
        button(x?: number, y?: number, key?: string, callback?: Function, callbackContext?: Object, overFrame?: any, outFrame?: any, downFrame?: any, upFrame?: any, group?: Phaser.Group): Phaser.Button;
        emitter(x?: number, y?: number, maxParticles?: number): Phaser.Particles.Arcade.Emitter;
        existing(object: any): any;
        filter(filter: string, args: any): Phaser.Filter;
        graphics(x: number, y: number, group?: Phaser.Group): Phaser.Graphics;
        group(parent?: any, name?: string, addToStage?: boolean, enableBody?: boolean, physicsBodyType?: number): Phaser.Group;
        image(x: number, y: number, key: any, frame?: any, group?: Phaser.Group): Phaser.Image;
        physicsGroup(physicsBodyType: number, parent?: any, name?: string, addToStage?: boolean): Phaser.Group;
        renderTexture(width?: number, height?: number, key?: string, addToCache?: boolean): Phaser.RenderTexture;
        retroFont(font: string, characterWidth: number, characterHeight: number, chars: string, charsPerRow: number, xSpacing?: number, ySpacing?: number, xOffset?: number, yOffset?: number): Phaser.RetroFont;
        sound(key: string, volume?: number, loop?: number, connect?: boolean): Phaser.Sound; 
        sprite(x: number, y: number, key?: any, frame?: any, group?: Phaser.Group): Phaser.Sprite;
        spriteBatch(parent: any, name?: string, addToStage?: boolean): Phaser.Group;
        text(x: number, y: number, text: string, style: any, group?: Phaser.Group): Phaser.Text;
        tilemap(key: string, tileWidth?: number, tileHeight?: number, width?: number, height?: number): Phaser.Tilemap;
        tileSprite(x: number, y: number, width: number, height: number, key?: any, frame?: any, group?: Phaser.Group): Phaser.TileSprite;
        tween(obj: Object): Phaser.Tween;

    }

    class GamePad {

        constructor(game: Phaser.Game);

        static BUTTON_0: number;
        static BUTTON_1: number;
        static BUTTON_2: number;
        static BUTTON_3: number;
        static BUTTON_4: number;
        static BUTTON_5: number;
        static BUTTON_6: number;
        static BUTTON_7: number;
        static BUTTON_8: number;
        static BUTTON_9: number;
        static BUTTON_10: number;
        static BUTTON_11: number;
        static BUTTON_12: number;
        static BUTTON_13: number;
        static BUTTON_14: number;
        static BUTTON_15: number;

        static AXIS_0: number;
        static AXIS_1: number;
        static AXIS_2: number;
        static AXIS_3: number;
        static AXIS_4: number;
        static AXIS_5: number;
        static AXIS_6: number;
        static AXIS_7: number;
        static AXIS_8: number;
        static AXIS_9: number;

        static XBOX360_A: number;
        static XBOX360_B: number;
        static XBOX360_X: number;
        static XBOX360_Y: number;
        static XBOX360_LEFT_BUMPER: number;
        static XBOX360_RIGHT_BUMPER: number;
        static XBOX360_LEFT_TRIGGER: number;
        static XBOX360_RIGHT_TRIGGER: number;
        static XBOX360_BACK: number;
        static XBOX360_START: number;
        static XBOX360_STICK_LEFT_BUTTON: number;
        static XBOX360_STICK_RIGHT_BUTTON: number;

        static XBOX360_DPAD_LEFT: number;
        static XBOX360_DPAD_RIGHT: number;
        static XBOX360_DPAD_UP: number;
        static XBOX360_DPAD_DOWN: number;

        static XBOX360_STICK_LEFT_X: number;
        static XBOX360_STICK_LEFT_Y: number;
        static XBOX360_STICK_RIGHT_X: number;
        static XBOX360_STICK_RIGHT_Y: number;

        active: boolean;
        callbackContext: Object;
        disabled: boolean;
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

        addCallbacks(context: Object, callbacks: Object): void;
        isDown(buttonCode: number): boolean;
        justPressed(buttonCode: number, duration?: number): boolean;
        justReleased(buttonCode: number, duration?: number): boolean;
        reset(): void;
        setDeadZones(value: any): void;
        start(): void;
        stop(): void;

    }

    class GamepadButton {

        constructor(game: Phaser.Game, buttonCode: number);

        buttonCode: number;
        duration: number;
        game: Phaser.Game;
        isDown: boolean;
        isUp: boolean;
        onDown: Phaser.Signal;
        onFloat: Phaser.Signal;
        onUp: Phaser.Signal;
        repeats: number;
        timeDown: number;
        timeUp: number;
        value: number;

        justPressed(duration?: number): boolean;
        justReleased(duration?: number): boolean;
        processButtonDown(value: Object): void;
        processButtonFloat(value: Object): void;
        processButtonUp(value: Object): void;

    }

    class Graphics extends PIXI.Graphics {

        constructor(game: Phaser.Game, x: number, y: number);

        angle: number;
        cameraOffset: Phaser.Point;
        exists: boolean;
        fixedToCamera: boolean;
        game: Phaser.Game;
        height: number;
        name: string;
        position: Phaser.Point;
        type: number;
        world: Phaser.Point;
        z: number;

        destroy(): void;
        drawPolygon(poly: any): void;
        postUpdate(): void;
        preUpdate(): void;
        update(): void;

    }

    class Group extends PIXI.DisplayObjectContainer {

        constructor(game: Phaser.Game, parent?: any, name?: string, addToStage?: boolean, enableBody?: boolean, physicsBodyType?: number);

        static RETURN_CHILD: number;
        static RETURN_NONE: number;
        static RETURN_TOTAL: number;
        static SORT_ASCENDING: number;
        static SORT_DESCENDING: number;

        angle: number;
        alive: boolean;
        cameraOffset: Phaser.Point;
        cursor: any;
        enableBody: boolean;
        enableBodyDebug: boolean;
        exists: boolean;
        fixedToCamera: boolean;
        game: Phaser.Game;
        length: number;
        name: string;
        physicsBodyType: number;
        position: Phaser.Point;
        scale: Phaser.Point;
        total: number;
        type: number;
        z: number;

        add(child: any): any;
        addAll(property: string, amount: number, checkAlive: boolean, checkVisible: boolean): void;
        bringToTop(child: any): any;
        addAt(child: any, index: number): any;
        callAll(method: string, context:any, ...parameters: any[]): void;
        callAllExists(callback: Function, existsValue: boolean, ...parameters: any[]): void;
        callbackFromArray(child: Object, callback: Function, length: number): void;
        countDead(): number;
        countLiving(): number;
        create(x: number, y: number, key: string, frame?: any, exists?: boolean): Phaser.Sprite;
        createMultiple(quantity: number, key: string, frame?: any, exists?: boolean): Phaser.Sprite;
        destroy(destroyChildren?: boolean, soft?:boolean): void;
        divideAll(property: string, amount: number, checkAlive?: boolean, checkVisible?: boolean): void;
        forEach(callback: Function, callbackContext: Object, checkExists?: boolean): void;
        forEachAlive(callback: Function, callbackContext: Object): void;
        forEachDead(callback: Function, callbackContext: Object): void;
        forEachExists(callback: Function, callbackContext: Object): void;
        getAt(index: number): any;
        getBottom(): any;
        getFirstAlive(): any;
        getFirstDead(): any;
        getFirstExists(state: boolean): any;
        getIndex(child: any): number;
        getRandom(startIndex: number, length: number): any;
        getTop(): any;
        iterate(key: string, value: any, returnType: number, callback?: Function, callbackContext?: Object, ...args: any[]): any;
        moveDown(child: any): any;
        moveUp(child: any): any;
        multiplyAll(property: string, amount: number, checkAlive: boolean, checkVisible: boolean): void;
        next(): void;
        postUpdate(): void;
        preUpdate(): void;
        previous(): void;
        remove(child: any): boolean;
        removeAll(): void;
        removeBetween(startIndex: number, endIndex: number): void;
        replace(oldChild: any, newChild: any): any;
        reverse(): void;
        sendToBack(child: any): any;
        set(child: Phaser.Sprite, key: string, value: any, checkAlive?: boolean, checkVisible?: boolean, operation?: number): void;
        setAll(key: string, value: any, checkAlive?: boolean, checkVisible?: boolean, operation?: number): void;
        setProperty(child: any, key: string[], value: any, operation?: number): void;
        sort(index?: string, order?: number): void;
        subAll(property: string, amount: number, checkAlive: boolean, checkVisible: boolean): void;
        swap(child1: any, child2: any): boolean;
        update(): void;
        updateZ(): void;
        xy(index: number, x: number, y: number): void;

    }

    class Image extends PIXI.Sprite {

        constructor(game: Phaser.Game, x: number, y: number, key: any, frame: any);

        angle: number;
        anchor: Phaser.Point;
        autoCull: boolean;
        cameraOffset: Phaser.Point;
        deltaX: number;
        deltaY: number;
        deltaZ: number;
        events: Phaser.Events;
        exists: boolean;
        fixedToCamera: boolean;
        frame: any;
        frameName: string;
        game: Phaser.Game;
        inCamera: boolean;
        input: Phaser.InputHandler;
        inputEnabled: boolean;
        inWorld: boolean;
        key: any;
        name: string;
        position: Phaser.Point;
        renderOrderID: number;
        scale: Phaser.Point;
        smoothed: boolean;
        type: number;
        z: number;
  
        bringToTop(): Phaser.Image;
        crop(rect: Phaser.Rectangle): void;
        destroy(destroyChildren?: boolean): void;
        kill(): Phaser.Image;
        loadTexture(key: any, frame: any): void;
        postUpdate(): void;
        preUpdate(): void;
        reset(x: number, y: number): Phaser.Image;
        revive(): Phaser.Image;
        update(): void;

    }

    class Input {

        constructor(game: Phaser.Game);
  
        static MOUSE_OVERRIDES_TOUCH: number;
        static MOUSE_TOUCH_COMBINE: number;
        static TOUCH_OVERRIDES_MOUSE: number;

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
        multiInputOverride: number;
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

        addPointer(): Phaser.Pointer;
        boot(): void;
        destroy(): void;
        getLocalPosition(displayObject: any, pointer: Phaser.Pointer): Phaser.Point;
        getPointer(state: boolean): Phaser.Pointer;
        getPointerFromIdentifier(identifier: number): Phaser.Pointer;
        hitTest(displayObject: any, pointer: Phaser.Pointer, localPoint: Phaser.Point): void;
        reset(hard?: boolean): void;
        resetSpeed(x: number, y: number): void;
        setMoveCallback(callBack: Function, callbackContext: Object): void;
        startPointer(event: any): Phaser.Pointer;
        stopPointer(event: any): Phaser.Pointer;
        update(): void;
        updatePointer(event: any): Phaser.Pointer;

    }

    class InputHandler extends Phaser.LinkedListItem {

        constructor(sprite: Phaser.Sprite);
  
        allowHorizontalDrag: boolean;
        allowVerticalDrag: boolean;
        boundsRect: Phaser.Rectangle;
        boundsSprite: Phaser.Sprite;
        bringToTop: boolean;
        consumePointerEvent: boolean;
        draggable: boolean;
        enabled: boolean;
        game: Phaser.Game;
        isDragged: boolean;
        pixelPerfectAlpha: number;
        pixelPerfectClick: boolean;
        pixelPerfectOver: boolean;
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

        checkBoundsRect(): void;
        checkBoundsSprite(): void;
        checkPixel(x: number, y: number, pointer?: Phaser.Pointer): boolean;
        checkPointerDown(pointer: Phaser.Pointer): boolean;
        checkPointerOver(pointer: Phaser.Pointer): boolean;
        destroy(): void;
        disableDrag(): void;
        disableSnap(): void;
        downDuration(pointer: Phaser.Pointer): number;
        enableDrag(lockCenter?: boolean, bringToTop?: boolean, pixelPerfect?: boolean, alphaThreshold?: number, boundsRect?: Phaser.Rectangle, boundsSprite?: Phaser.Rectangle): void;
        enableSnap(snapX: number, snapY: number, onDrag?: boolean, onRelease?: boolean, snapOffsetX?: number, snapOffsetY?: number): void;
        justOut(pointer: number, delay: number): boolean;
        justOver(pointer: number, delay: number): boolean;
        justPressed(pointer: number, delay: number): boolean;
        justReleased(pointer: number, delay: number): boolean;
        overDuration(pointer: Phaser.Pointer): number;
        pointerDown(pointer: Phaser.Pointer): boolean;
        pointerDragged(pointer: Phaser.Pointer): boolean;
        pointerOut(index: number): boolean;
        pointerOver(index: number): boolean;
        pointerTimeDown(pointer: Phaser.Pointer): number;
        pointerTimeOut(pointer: Phaser.Pointer): number;
        pointerTimeOver(pointer: Phaser.Pointer): number;
        pointerTimeUp(pointer: Phaser.Pointer): number;
        pointerUp(pointer: Phaser.Pointer): boolean;
        pointerX(pointer: Phaser.Pointer): number;
        pointerY(pointer: Phaser.Pointer): number;
        reset(): void;
        setDragLock(allowHorizontal?: boolean, allowVertical?: boolean): void;
        start(priority: number, useHandCursor: boolean): Phaser.Sprite;
        startDrag(pointer: Phaser.Pointer): void;
        stop(): void;
        stopDrag(pointer: Phaser.Pointer): void;
        update(pointer: Phaser.Pointer): void;
        updateDrag(pointer: Phaser.Pointer): boolean;
        validForInput(highestID: number, highestRenderID: number): boolean;

    }

    class Key {

        constructor(game: Phaser.Game, keycode: number)

        altKey: boolean;
        ctrlKey: boolean;
        duration: number;
        event: Object;
        game: Phaser.Game;
        isDown: boolean;
        isUp: boolean;
        keyCode: number;
        onDown: Phaser.Signal;
        onHoldCallback: Function;
        onHoldContext: Object;
        onUp: Phaser.Signal;
        repeats: number;
        shiftKey: boolean;
        timeDown: number;
        timeUp: number;

        justPressed(duration?: number): boolean;
        justReleased(duration?: number): boolean;
        processKeyDown(event: KeyboardEvent): void;
        processKeyUp(event: KeyboardEvent): void;
        reset(): void;
        update(): void;

    }

    class Keyboard {

        constructor(game: Phaser.Game);

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

        callbackContext: Object;
        disabled: boolean;
        event: Object;
        game: Phaser.Game;
        onDownCallback: Function;
        onUpCallback: Function;

        addCallbacks(context: Object, onDown: Function, onUp?: Function): void;
        addKey(keycode: number): Phaser.Key;
        addKeyCapture(keycode: any): void;
        createCursorKeys(): Phaser.CursorKeys;
        clearCaptures(): void;
        isDown(keycode: number): boolean;
        justPressed(keycode: number, duration?: number): boolean;
        justReleased(keycode: number, duration?: number): boolean;
        processKeyDown(event: KeyboardEvent): void;
        processKeyUp(event: KeyboardEvent): void;
        removeKey(keycode: number): void;
        removeKeyCapture(keycode: number): void;
        reset(): void;
        start(): void;
        stop(): void;
        update(): void;
    }

    class Line {

        constructor(x1?: number, y1?: number, x2?: number, y2?: number);
  
        angle: number;
        end: Phaser.Point;
        height: number;
        left: number;
        length: number;
        perpSlope: number;
        right: number;
        slope: number;
        start: Phaser.Point;
        top: number;
        width: number;
        x: number;
        y: number;

        static intersectsPoints(a: Phaser.Point, b: Phaser.Point, e: Phaser.Point, f: Phaser.Point, asSegment?: boolean, result?: Phaser.Point): Phaser.Point;
        static intersects(a: Phaser.Line, b: Phaser.Line, asSegment?: boolean, result?: Phaser.Point): Phaser.Point;

        coordinatesOnLine(stepRate: number, results: any[]): any[];
        fromSprite(startSprite: Phaser.Sprite, endSprite: Phaser.Sprite, useCenter?: boolean): Phaser.Line;
        intersects(line: Phaser.Line, asSegment?: boolean, result?: Phaser.Point): Phaser.Point;
        pointOnLine(x: number, y: number): boolean;
        pointOnSegment(x: number, y: number): boolean;
        setTo(x1?: number, y1?: number, x2?: number, y2?: number): Phaser.Line;

    }

    class LinkedListItem {

        next: LinkedListItem;
        prev: LinkedListItem;
        first: LinkedListItem;
        last: LinkedListItem;

    }

    class LinkedList extends LinkedListItem {

        first: LinkedListItem;
        last: LinkedListItem;
        next: LinkedListItem;
        prev: LinkedListItem;
        total: number;

        add(child: LinkedListItem): LinkedListItem;
        callAll(callback: Function): void;
        remove(child: LinkedListItem): void;

    }

    class Loader {

        constructor(game: Phaser.Game);

        static PHYSICS_LIME_CORONA: number;
        static TEXTURE_ATLAS_JSON_ARRAY: number;
        static TEXTURE_ATLAS_JSON_HASH: number;
        static TEXTURE_ATLAS_XML_STARLING: number;

        baseURL: string;
        crossOrigin: boolean;
        game: Phaser.Game;
        hasLoaded: boolean;
        isLoading: boolean;
        onFileComplete: Phaser.Signal;
        onFileError: Phaser.Signal;
        onLoadComplete: Phaser.Signal;
        onLoadStart: Phaser.Signal;
        preloadSprite: any;
        progress: number;
        progressFloat: number;

        addToFileList(type: string, key: string, url: string, properties: any): void;
        atlas(key: string, textureURL: string, atlasURL?: string, atlasData?: Object, format?: number): Phaser.Loader;
        atlasJSONArray(key: string, textureURL: string, atlasURL?: string, atlasData?: Object): Phaser.Loader;
        atlasJSONHash(key: string, textureURL: string, atlasURL?: string, atlasData?: Object): Phaser.Loader;
        atlasXML(key: string, textureURL: string, atlasURL?: string, atlasData?: Object): Phaser.Loader;
        audio(key: string, urls: any, autoDecode?: boolean): Phaser.Loader;
        binary(key: string, url: string, callback?: Function, callbackContext?: Function): Phaser.Loader;
        bitmapFont(key: string, textureURL: string, xmlURL?: string, xmlData?: Object, xSpacing?: number, ySpacing?: number): Phaser.Loader;
        checkKeyExists(type: string, key: string): boolean;
        csvLoadComplete(index: number): void;
        dataLoadError(index: number): void;
        fileComplete(index: number): void;
        fileError(index: number): void;
        getAsset(type: string, key: string): any;
        getAssetIndex(type: string, key: string): number;
        image(key: string, url: string, overwrite?: boolean): Phaser.Loader;
        json(key: string, url: string, overwrite?: boolean): Phaser.Loader;
        jsonLoadComplete(index: number): void;
        physics(key: string, dataURL?: string, jsonData?: Object, format?: string): Phaser.Loader;
        removeAll(): void;
        removeFile(key: string, type: string): void;
        replaceInFileList(type: string, key: string, url: string, properties: Object): void;
        reset(): void;
        script(key: string, url: String, callback: Function, callbackContext: Object): Phaser.Loader;
        setPreloadSprite(sprite: Phaser.Sprite, direction?: number): void;
        spritesheet(key: string, url: string, frameWidth: number, frameHeight: number, frameMax?: number, margin?: number, spacing?: number): Phaser.Loader;
        start(): void;
        text(key: string, url: string, overwrite?: boolean): Phaser.Loader;
        tilemap(key: string, mapDataURL?: string, mapData?: Object, format?: number): Phaser.Loader;
        totalLoadedFiles(): number;
        totalQueuedFiles(): number;
        xmlLoadComplete(index: number): void;

    }

    class LoaderParser {

        static bitmapFont(game: Phaser.Game, xml: Object, cacheKey: string, xSpacing: number, ySpacing: number): Phaser.FrameData;

    }

    class Math {

        static angleBetween(x1: number, y1: number, x2: number, y2: number): number;
        static angleBetweenPoints(point1: Phaser.Point, point2: Phaser.Point): number;
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
        static fuzzyLessThan(a: Number, b: number, epsilon?: number): boolean;
        static fuzzyFloor(val: number, epsilon?: number): boolean;
        static fuzzyGreaterThan(a: number, b: number, epsilon?: number): boolean;
        static fuzzyLessThan(a: number, b: number, epsilon?: number): boolean;
        static getRandom<T>(objects: T[], startIndex?: number, length?: number): T;
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
        static p2px(v: number): number;
        static PI2: number;
        static radToDeg(radians: number): number;
        static randomSign(): number;
        static reverseAngle(angleRed: number): number;
        static removeRandom<T>(objects: T[], startIndex?: number, length?: number): T;
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
        static wrapAngle(angle: number, radians?:boolean): number;
        static wrapValue(value: number, amount: number, max: number): number;       

    }

    class Mouse {

        constructor(game: Phaser.Game)

        static LEFT_BUTTON: number;
        static MIDDLE_BUTTON: number;
        static NO_BUTTON: number;
        static RIGHT_BUTTON: number;

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

        onMouseDown(event: MouseEvent): void;
        onMouseMove(event: MouseEvent): void;
        onMouseUp(event: MouseEvent): void;
        pointerLockChange(event: MouseEvent): void;
        releasePointerLock(): void;
        requestPointerLock(): void;
        start(): void;
        stop(): void;

    }

    class MSPointer {

        constructor(game: Phaser.Game);
   
        callbackContext: Object;
        disabled: boolean;
        game: Phaser.Game;

        onPointerDown(event: MSPointerEvent): void;
        onPointerMove(event: MSPointerEvent): void;
        onPointerUp(event: MSPointerEvent): void;
        mouseDownCallback(event: MSPointerEvent): void;
        mouseMoveCallback(event: MSPointerEvent): void;
        mouseUpCallback(event: MSPointerEvent): void;
        start(): void;
        stop(): void;

    }

    class Net {

        constructor(game: Phaser.Game);

        game: Phaser.Game;

        checkDomainName(domain: string): boolean;
        decodeURI(value: string): string;
        getHostName(): string;
        getQueryString(parameter?: string): string;
        updateQueryString(key: string, value: any, redirect?: boolean, url?: string): string;

    }

    class Particles {

        constructor(game: Phaser.Game);

        emitters: Object;
        game: Phaser.Game;
        ID: number;

        add(emitter: Phaser.Particles.Arcade.Emitter): Phaser.Particles.Arcade.Emitter;
        remove(emitter: Phaser.Particles.Arcade.Emitter): void;
        update(): void;

    }

    module Particles {

        module Arcade {

            class Emitter extends Phaser.Group {

                constructor(game: Phaser.Game, x?: number, y?: number, maxParticles?: number);
 
                angle: number;
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
                maxParticles: number;//
                maxParticleScale: number;
                maxParticleSpeed: Phaser.Point;
                maxRotation: number;
                minParticleScale: number;
                minParticleSpeed: Phaser.Point;
                minRotation: number;
                name: string;
                on: boolean;
                particleClass: Phaser.Sprite;
                particleDrag: Phaser.Point;
                position: Phaser.Point;
                right: number;
                top: number;
                type: number;
                width: number;
                x: number;
                y: number;

                at(object: any): void;
                emitParticle(): void;
                kill(): void;
                makeParticles(keys: any, frames: any, quantity: number, collide?: boolean, collideWorldBounds?: boolean): Phaser.Particles.Arcade.Emitter;
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

    class Physics {

        constructor(game: Phaser.Game, config?: Object);

        static ARCADE: number;
        static P2JS: number;
        static NINJA: number;
        static BOX2D: number;
        static CHIPMUNK: number;

        arcade: Phaser.Physics.Arcade;
        config: Object;
        game: Phaser.Game;
        ninja: Phaser.Physics.Ninja;
        p2: Phaser.Physics.P2;

        clear(): void;
        destroy(): void;
        enable(object: any, system?: number, debug?: boolean): void;
        parseConfig(): void;
        preUpdate(): void;
        setBoundsToWorld(): void;
        startSystem(system: number): void;
        update(): void;

    }

    module Physics {

        class Arcade {

            static OVERLAP_BIAS: number;
            static TILE_BIAS: number;

            constructor(game: Phaser.Game);

            bounds: Phaser.Rectangle;
            checkCollision: { up?: boolean; down?: boolean; left?: boolean; right?: boolean; };
            forceX: boolean;
            game: Phaser.Game;
            gravity: Phaser.Point;
            quadTree: Phaser.QuadTree;
            maxObjects: number;
            maxLevels: number;

            accelerationFromRotation(rotation: number, speed?: number, point?: Phaser.Point): Phaser.Point;
            accelerateToObject(displayObject: any, destination: any, speed?: number, xSpeedMax?: number, ySpeedMax?: number): number;
            accelerateToPointer(displayObject: any, pointer?: Phaser.Pointer, speed?: number, xSpeedMax?: number, ySpeedMax?: number): number;
            accelerateToXY(displayObject: any, x: number, y: number, speed?: number, xSpeedMax?: number, ySpeedMax?: number): number;
            angleBetween(source: any, target: any): number;
            angleToPointer(displayObject: any, pointer?: Phaser.Pointer): number;
            angleToXY(displayObject: any, x: number, y: number): number;
            collide(object1: Object, object2: Object, collideCallback?: Function, processCallback?: Function, callbackContext?: Object): boolean;
            computeVelocity(axis: number, body: Phaser.Physics.Arcade.Body, velocity: number, acceleration: number, drag: number, max?: number): number;
            distanceBetween(source: any, target: any): number;
            distanceToPointer(displayObject: any, pointer?: Phaser.Pointer): number;
            distanceToXY(displayObject: any, x: number, y: number): number;
            enable(object: Object, children?: Boolean): void;
            enableBody(object: Object): void;
            intersects(body1: Phaser.Physics.Arcade.Body, body2: Phaser.Physics.Arcade.Body): boolean;
            moveToObject(displayObject: any, destination: any, speed?: number, maxTime?: number): number;
            moveToPointer(displayObject: any, speed?: number, pointer?: Phaser.Pointer, maxTime?: number): number;
            moveToXY(displayObject: any, x: number, y: number, speed?: number, maxTime?: number): number;
            overlap(object1: Object, object2: Object, overlapCallback?: Function, processCallback?: Function, callbackContext?: Object): boolean;
            processTileSeparationX(body: Phaser.Physics.Arcade.Body, x: number): boolean;
            processTileSeparationY(body: Phaser.Physics.Arcade.Body, y: number): void;
            setBounds(x: number, y: number, width: number, height: number): void;
            setBoundsToWorld(): void;
            separate(body1: Phaser.Physics.Arcade.Body, body2: Phaser.Physics.Arcade.Body, processCallback?: Function, callbackContext?: Object, overlapOnly?: boolean): boolean;
            separateX(body1: Phaser.Physics.Arcade.Body, body2: Phaser.Physics.Arcade.Body, overlapOnly: boolean): boolean;
            separateY(body1: Phaser.Physics.Arcade.Body, body2: Phaser.Physics.Arcade.Body, overlapOnly: boolean): boolean;
            separateTile(i: number, body: Phaser.Physics.Arcade.Body, tile: Phaser.Tile): boolean;
            tileCheckX(body: Phaser.Physics.Arcade.Body, tile: Phaser.Tile): number;
            tileCheckY(body: Phaser.Physics.Arcade.Body, tile: Phaser.Tile): number;
            updateMotion(body: Phaser.Physics.Arcade.Body): void;
            velocityFromAngle(angle: number, speed?: number, point?: Phaser.Point): Phaser.Point;
            velocityFromRotation(rotation: number, speed?: number, point?: Phaser.Point): Phaser.Point;

        }

        module Arcade {

            class Body {

                constructor(sprite: Phaser.Sprite);

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
                center: Phaser.Point;
                checkCollision: FaceChoices;
                collideWorldBounds: boolean;
                customSeparateX: boolean;
                customSeparateY: boolean;
                deltaMax: Phaser.Point;
                draw: Phaser.Point;
                embedded: boolean;
                facing: number;
                game: Phaser.Game;
                gravity: Phaser.Point;
                halfWidth: number;
                halfHeight: number;
                immovable: boolean;
                mass: number;
                maxAngular: number;
                maxVelocity: Phaser.Point;
                moves: boolean;
                newVelocity: Phaser.Point;
                offset: Phaser.Point;
                overlapX: number;
                overlapY: number;
                position: Phaser.Point;
                preRotation: number;
                prev: Phaser.Point;
                right: number;
                rotation: number;
                skipQuadTree: boolean;
                sourceWidth: number;
                sourceHeight: number;
                speed: number;
                sprite: Phaser.Sprite;
                tilePadding: Phaser.Point;
                touching: FaceChoices;
                type: number;
                wasTouching: FaceChoices;
                width: number;
                velocity: Phaser.Point;
                x: number;
                y: number;

                checkWorldBounds(): void;
                deltaX(): number;
                deltaY(): number;
                deltaZ(): number;
                deltaAbsX(): void;
                deltaAbsY(): void;
                destroy(): void;
                onFloor(): void;
                onWall(): void;
                preUpdate(): void;
                postUpdate(): void;
                render(context: Object, body: Phaser.Physics.Arcade.Body, filled?: boolean, color?: string): void;
                renderBodyInfo(debug: Phaser.Utils.Debug, body: Phaser.Physics.Arcade.Body): void;
                reset(x: number, y: number): void;
                setSize(width: number, height: number, offsetX: number, offsetY: number): void;
                updateBounds(): boolean;

            }

            class FaceChoices {

                none: boolean;
                any: boolean;
                up: boolean;
                down: boolean;
                left: boolean;
                right: boolean;

            }
        }

        class Ninja {

            constructor(game: Phaser.Game);

            game: Phaser.Game
            gravity: number;
            bounds: Phaser.Rectangle;
            maxObjects: number;
            maxLevels: number;
            quadTree: Phaser.QuadTree;
            time: Phaser.Time;
           
            clearTilemapLayerBodies(map: Phaser.Tilemap, layer: any): void;
            collide(object1: any, object2: any, collideCallback?: Function, processCallback?: Function, callbackContext?: Object): boolean;
            convertTilemap(map: Phaser.Tilemap, layer?: any, slopeMap?: Object): Phaser.Physics.Ninja.Tile[];
            enableAABB(object: any, children?: boolean): void;
            enableCircle(object: any, radius: number, children?: boolean);
            enableTile(object: any, id: number, children?: boolean): void;
            enable(object: any, type?: number, id?: number, radius?: number, children?: boolean): void;
            enableBody(object: any, type?: number, id?: number, radius?: number): void;
            overlap(object1: any, object2: any, overlapCallback?: Function, processCallback?: Function, callbackContext?: Object): boolean;
            separate(body1: Phaser.Physics.Ninja.Body, body2: Phaser.Physics.Ninja.Body, processCallback?: Function, callbackContext?: Object, overlapOnly?: boolean): boolean;
            setBounds(x: number, y: number, width: number, height: number): void;
            setBoundsToWorld(): void;
        }

        module Ninja {

            class Body {

                constructor(system: Phaser.Physics.Ninja, sprite: Phaser.Sprite, type?: number, id?: number, radius?: number, x?: number, y?: number, width?: number, height?: number);
                
                aabb: Phaser.Physics.Ninja.AABB;
                angle: number;
                bottom: number;
                bounce: number;
                checkCollision: Phaser.Physics.Arcade.FaceChoices;
                circle: Phaser.Physics.Ninja.Circle;
                collideWorldBounds: boolean;
                drag: number;
                facing: number;
                friction: number;
                game: Phaser.Game;
                gravityScale: number;
                height: number;
                immovable: boolean;
                maxSpeed: number;
                right: number;
                sprite: Phaser.Sprite;
                system: Phaser.Physics.Ninja;
                tile: Phaser.Physics.Ninja.Tile;
                touching: Phaser.Physics.Arcade.FaceChoices;
                type: number;
                shape: Object;
                speed: number;
                velocity: Phaser.Point;
                wasTouching: Phaser.Physics.Arcade.FaceChoices;
                width: number;
                x: number;
                y: number;

                deltaAbsX(): number;
                deltaAbsY(): number;
                deltaX(): number;
                deltaY(): number;
                destroy(): void;
                setZeroVelocity(): void;
                moveTo(speed: number, angle: number): void;
                moveFrom(speed: number, angle: number): void;
                moveLeft(speed: number): void;
                moveRight(speed: number): void;
                moveUp(speed: number): void;
                moveDown(speed: number): void;
                poseUpdate(): void;
                preUpdate(): void;
                reset(): void;

            }

            class AABB {

                constructor(body: Phaser.Physics.Ninja.Body, x: number, y: number, width: number, height: number);

                static COL_NONE: number;
                static COL_AXIS: number;
                static COL_OTHER: number;

                aabbTileProjections: Object;
                body: Phaser.Physics.Ninja.Body;
                height: number;
                oldPos: Phaser.Point;
                pos: Phaser.Point;
                system: Phaser.Physics.Ninja;
                width: number;
                velocity: Phaser.Point;
                xw: number;
                yw: number;

                collideWorldBounds(): void;
                collideAABBVsAABB(aabb: Phaser.Physics.Ninja.AABB): boolean;
                collideAABBVsTile(tile: Phaser.Physics.Ninja.Tile): boolean;
                destroy(): void;
                integrate(): void;
                reportCollisionVsWorld(px: number, py: number, dx: number, dy: number, obj: Object): void;
                reportCollisionVsBody(px: number, py: number, dx: number, dy: number, obj: Object): void;
                resolveTile(x: number, y: number, body: Phaser.Physics.Ninja.AABB, tile: Phaser.Physics.Ninja.Tile): boolean;
                reverse(): void;

            }

            class Circle {

                constructor(body: Phaser.Physics.Ninja.Body, x: number, y: number, radius: number);
 
                COL_NONE: number;
                COL_AXIS: number;
                COL_OTHER: number;
  
                body: Phaser.Physics.Ninja.Body;
                circleTileProjections: Object;
                oldPos: Phaser.Point;
                height: number;
                pos: Phaser.Point;
                radius: number;
                system: Phaser.Physics.Ninja;
                velocity: Phaser.Point;
                width: number;
                xw: number;
                yw: number;

                collideCircleVsTile(tile: Phaser.Physics.Ninja.Tile): boolean;
                collideWorldBounds(): void;
                destroy(): void;
                integrate(): void;
                reportCollisionVsWorld(px: number, py: number, dx: number, dy: number, obj: Object): void;
                reportCollisionVsBody(px: number, py: number, dx: number, dy: number, obj: Object): void;
                resolveCircleTile(x: number, y: number, oH: number, oV: number, obj: Phaser.Physics.Ninja.Circle, t: Phaser.Physics.Ninja.Tile): boolean;

            }

            class Tile {

                constructor(body: Phaser.Physics.Ninja.Body, x: number, y: number, width: number, height: number, type?: number);
                
                body: Phaser.Physics.Ninja.Body;
                bottom: number;
                height: number;
                id: number;
                oldpos: Phaser.Point;
                pos: Phaser.Point;
                right: number;
                system: Phaser.Physics.Ninja;
                type: number;
                velocity: Phaser.Point;
                width: number;
                xw: number;
                yw: number;
                x: number;
                y: number;

                clear(): void;
                collideWorldBounds(): void;
                destroy(): void;
                integrate(): void;
                reportCollisionVsWorld(px: number, py: number, dx: number, dy: number, obj: Object);
                setType(id: number): number;

            }

        }

        class P2 {

            static LIME_CORONA_JSON: number;

            constructor(game: Phaser.Game, config?: Object);

            applyDamping: boolean;
            applyGravity: boolean;
            applySpringForced: boolean;
            bounds: Phaser.Physics.P2.Body;
            emitImpactEvent: boolean;
            enableBodySleeping: boolean;
            frameRate: number;
            friction: number;
            game: Phaser.Game;
            gravity: Phaser.Physics.P2.InversePointProxy;
            materials: Phaser.Physics.P2.Material[];
            onBodyAdded: Phaser.Signal;
            onBodyRemoved: Phaser.Signal;
            onBeginContact: Phaser.Signal;
            onConstraintAdded: Phaser.Signal;
            onConstraintRemoved: Phaser.Signal;
            onContactMaterialAdded: Phaser.Signal;
            onContactMaterialRemoved: Phaser.Signal;
            onEndContact: Phaser.Signal;
            onSpringAdded: Phaser.Signal;
            onSpringRemoved: Phaser.Signal;
            restitution: number;
            solveConstraints: boolean;
            time: any;
            total: number;
            useElapsedTime: boolean;
            world: Phaser.Physics.P2;

            addBody(body: Phaser.Physics.P2.Body): boolean;
            addContactMaterial(material: Phaser.Physics.P2.ContactMaterial): Phaser.Physics.P2.ContactMaterial;
            addConstraint(constraint: any): any;
            addSpring(spring: Phaser.Physics.P2.Spring): Phaser.Physics.P2.Spring;
            beginContactHandler(event: Object): void;
            clear(): void;
            clearTilemapLayerBodies(map: Phaser.Tilemap, layer?: any): void;
            convertCollisionObjects(map: Phaser.Tilemap, layer?: any, addToWorld?: boolean): Phaser.Physics.P2.Body[];
            convertTilemap(map: Phaser.Tilemap, layer?: any, addToWorld?: Boolean, optimize?: boolean): Phaser.Physics.P2.Body[];
            createBody(x: number, y: number, mass: number, addToWorld?: boolean, options?: Object, data?: Object): Phaser.Physics.P2.Body;
            createContactMaterial(materialA: Phaser.Physics.P2.Material, materialB: Phaser.Physics.P2.Material, options?: number): Phaser.Physics.P2.ContactMaterial;
            createDistanceConstraint(bodyA: any, bodyB: any, distance: number, maxForce?: number): Phaser.Physics.P2.DistanceConstraint;
            createGearConstraint(bodyA: any, bodyB: any, angle?: number, ratio?: number): Phaser.Physics.P2.GearConstraint;
            createLockConstraint(bodyA: any, bodyB: any, offset: Float32Array, angle?: number, maxForce?: number): Phaser.Physics.P2.LockConstraint;
            createMaterial(name?: string, body?: Phaser.Physics.P2.Body): Phaser.Physics.P2.Material;
            createParticle(x: number, y: number, mass: number, addToWorld?: Boolean, options?: Object, data?: Object): Phaser.Physics.P2.Body;
            createPrismaticConstraint(body: any, bodyB: any, lockRotation?: boolean, anchorA?: Float32Array, anchorB?: Float32Array, axis?: Float32Array, maxForce?: number): Phaser.Physics.P2.PrismaticConstraint;
            createRevoluteConstraint(bodyA: any, pivotA: Float32Array, bodyB: any, pivotB: Float32Array, maxForce?: number): Phaser.Physics.P2.RevoluteContraint;
            createSpring(bodyA: any, bodyB: any, restLength?: number, stiffness?: number, damping?: number, worldA?: Float32Array, worldB?: Float32Array, localA?: Float32Array, localB?: Float32Array): Phaser.Physics.P2.Spring;
            destroy(): void;
            enable(object: any, debug?: boolean, children?: boolean): void;
            enableBody(object: Object, debug: boolean): void;
            endContactHandler(event: Object): void;
            getBodies(): Phaser.Physics.P2.Body[];
            getBody(object: Object): Phaser.Physics.P2.Body;
            getConstraints(): any[];
            getSprings(): Phaser.Physics.P2.Spring[];
            getContactMaterial(materialA: Phaser.Physics.P2.Material, materialB: Phaser.Physics.P2.Material): Phaser.Physics.P2.ContactMaterial;
            hitTest(worldPoint: Phaser.Point, bodies?: any[], precision?: number, filterStatic?: boolean): Phaser.Physics.P2.Body[];
            mpx(v: number): number;
            mpxi(v: number): number;
            pxm(v: number): number;
            pxmi(v: number): number;
            preUpdate(): void;
            removeBody(body: Phaser.Physics.P2.Body): Phaser.Physics.P2.Body;
            removeBodyNextStep(body: Phaser.Physics.P2.Body): void;
            removeConstraint(constraint: any): any;
            removeContactMaterial(material: Phaser.Physics.P2.ContactMaterial);
            removeSpring(spring: Phaser.Physics.P2.Spring): Phaser.Physics.P2.Spring;
            setBounds(x: number, y: number, width: number, height: number, left?: Boolean, right?: boolean, top?: boolean, bottom?: boolean, setCollisionGroup?: boolean): void;
            setBoundsToWorld(left?: boolean, right?: boolean, top?: boolean, bottom?: boolean, setCollisionGroup?: boolean): void;
            setCollisionGroup(object: Object, group: Phaser.Physics.P2.CollisionGroup): void;
            setImpactEvents(state: boolean): void;
            setMaterial(material: Phaser.Physics.P2.Material): Phaser.Physics.P2.Body[];
            setPostBroadphaseCallback(callback: Function, context: Object): void;
            setWorldMaterial(material: Phaser.Physics.P2.Material, left?: boolean, right?: boolean, top?: boolean, bottom?: boolean): void;
            toJSON(): Object;
            update(): void;
            updateBoundsCollisionGroup(setCollisionGroup?: boolean): void;

        }

        module P2 {

            class Body {

                static DYNAMIC: number;
                static STATIC: number;
                static KINEMATIC: number;

                constructor(game: Phaser.Game, sprite?: Phaser.Sprite, x?: number, y?: number, mass?: number);

                allowSleep: boolean;
                angle: number;
                angularDamping: number;
                angularForce: number;
                angularVelocity: number;
                collideWorldBounds: boolean;
                damping: number;
                data: Phaser.Physics.P2.Body;
                debug: boolean;
                debugBody: Phaser.Physics.P2.BodyDebug;
                fixedRotation: boolean;
                force: Phaser.Physics.P2.InversePointProxy;
                game: Phaser.Game;
                gravity: Phaser.Point;
                id: number;
                inertia: number;
                kinematic: boolean;
                mass: number;
                motionState: number;
                offset: Phaser.Point;
                onBeginContact: Phaser.Signal;
                onEndContact: Phaser.Signal;
                onImpact: Phaser.Signal;
                rotation: number;
                sprite: Phaser.Sprite;
                sleepSpeedLimit: number;
                static: boolean;
                dynamic: boolean;
                type: number;
                velocity: Phaser.Physics.P2.InversePointProxy;
                world: Phaser.Physics.P2;
                x: number;
                y: number;

                addToWorld(): void;
                addCapsule(length: number, radius: number, offsetX?: number, offsetY?: number, rotation?: number): any;
                addCircle(radius: number, offsetX?: number, offsetY?: number, rotation?: number): any;
                addLine(length: number, offsetX?: number, offsetY?: number, rotation?: number): any;
                addParticle(offsetX?: number, offsetY?: number, rotation?: number): any;
                addPolygon(options: { optimalDecomp?: boolean; skipSimpleCheck?: boolean; removeCollinearPoints?: boolean; }, points: any): boolean;
                addPlane(offsetX?: number, offsetY?: number, rotation?: number): any; 
                addRectangle(width: number, height: number, offsetX?: number, offsetY?: number, rotation?: number): any;
                addShape(shape: any, offsetX?: number, offsetY?: number, rotation?: number): any;
                adjustCenterOfMass(): void;
                applyDamping(dt: number): void;
                applyForce(force: number, worldX: number, worldY: number): void;
                clearCollision(clearGroup?: boolean, cleanMask?: boolean, shape?: any): void;
                clearShapes(): void;
                collides(group: any, callback?: Function, callbackContext?: Object, shape?: any): void;
                createBodyCallback(object: any, callback: Function, callbackContext: Object): void;
                createGroupCallback(group: Phaser.Physics.P2.CollisionGroup, callback: Function, callbackContext: Object): void;
                destroy(): void;
                getCollisionMask(): number;
                loadData(key: string, object: string, options?: { optimalDecomp?: boolean; skipSimpleCheck?: boolean; removeCollinearPoints?: boolean; }): boolean;
                loadPolygon(key: string, object: string, options?: { optimalDecomp?: boolean; skipSimpleCheck?: boolean; removeCollinearPoints?: boolean; }): boolean;
                moveBackward(speed: number): void;
                moveDown(speed: number): void;
                moveForward(speed: number): void;
                moveLeft(speed: number): void;
                moveRight(speed: number): void;
                moveUp(speed: number): void;
                preUpdate(): void;
                postUpdate(): void;
                removeFromWorld(): void;
                removeShape(shape: any): boolean;
                reverse(Speed: number): void;
                rotateLeft(speed: number): void;
                rotateRight(speed: number): void;
                reset(x: number, y: number, resetDamping?: boolean, resetMass?: boolean): void;
                shapeChanged(): void;
                setCircle(radius: number, offsetX?: number, offsetY?: number, rotation?: number): void;
                setCollisionGroup(group: Phaser.Physics.P2.CollisionGroup, shape?: any): void;
                setRectangle(width?: number, height?: number, offsetX?: number, offsetY?: number, rotation?: number): any;
                setRectangleFromSprite(sprite: any): any;
                setMaterial(material: Phaser.Physics.P2.Material, shape?: any): void;
                setZeroDamping(): void;
                setZeroForce(): void;
                setZeroRotation(): void;
                setZeroVelocity(): void;
                toLocalFrame(out: Float32Array, worldPoint: Float32Array): void;
                thrust(speed: number): void;
                toWorldFrame(out: Float32Array, localPoint: Float32Array): void;
                updateCollisionMask(shape?: any): void;

            }

            class BodyDebug extends Phaser.Group {

                constructor(game: Phaser.Game, body: Phaser.Physics.P2.Body, settings: { pixelsPerLengthUnit?: number; debugPolygons?: boolean; lineWidth?: number; alpha?: number; });
                
            }

            class CollisionGroup {

                constructor(bitmask: any);

                mask: number;

            }

            class ContactMaterial {

                constructor(materialA: Phaser.Physics.P2.Material, materialB: Phaser.Physics.P2.Material, options?: Object);

                id: number;
                friction: number;
                materialA: Phaser.Physics.P2.Material;
                materialB: Phaser.Physics.P2.Material;
                restitution: number;
                stiffness: number;
                relaxation: number;
                frictionStiffness: number;
                frictionRelaxation: number;
                surfaceVelocity: number;
            }

            class DistanceConstraint {

                constructor(world: Phaser.Physics.P2, bodyA: Phaser.Physics.P2.Body, bodyB: Phaser.Physics.P2.Body, distance: number, maxForce: number);

                game: Phaser.Game;
                world: Phaser.Physics.P2;

            }

            class GearConstraint {

                constructor(world: Phaser.Physics.P2, bodyA: Phaser.Physics.P2.Body, bodyB: Phaser.Physics.P2.Body, angle?: number, ratio?: number);

                game: Phaser.Game;
                world: Phaser.Physics.P2;

            }

            class InversePointProxy {

                constructor(world: Phaser.Physics.P2, destination: any);

                x: number;
                y: number;

            }

            class LockConstraint {

                constructor(world: Phaser.Physics.P2, bodyA: Phaser.Physics.P2.Body, bodyB: Phaser.Physics.P2.Body, offset?: number[], angle?: number, maxForce?: number);

                game: Phaser.Game;
                world: Phaser.Physics.P2;
            }

            class Material {

                constructor(name: string);

                name: string;

            }

            class PointProxy {

                constructor(world: Phaser.Physics.P2, destination: any);

                x: number;
                y: number;

            }

            class PrismaticConstraint {

                constructor(world: Phaser.Physics.P2, bodyA?: Phaser.Physics.P2.Body, bodyB?: Phaser.Physics.P2.Body, lockRotation?: boolean, anchorA?: Float32Array, anchorB?: Float32Array, axis?: Float32Array, maxForce?: number);

                game: Phaser.Game;
                world: Phaser.Physics.P2;

            }

            class RevoluteContraint {

                constructor(world: Phaser.Physics.P2, bodyA: Phaser.Physics.P2.Body, pivotA: Float32Array, bodyB: Phaser.Physics.P2.Body, pivotB: Float32Array, maxForce?: number);

                game: Phaser.Game;
                world: Phaser.Physics.P2;

            }

            class Spring {

                constructor(world: Phaser.Physics.P2, bodyA: Phaser.Physics.P2.Body, bodyB: Phaser.Physics.P2.Body, restLength?: number, stiffness?: number, damping?: number, worldA?: Float32Array, worldB?: Float32Array, localA?: Float32Array, localB?: Float32Array);

                game: Phaser.Game;
                world: Phaser.Physics.P2;

            }
        }
    }

    class Plugin extends StateCycle {

        constructor(game: Phaser.Game, parent: any);

        active: boolean;
        game: Phaser.Game;
        hasPostRender: boolean;
        hasPostUpdate: boolean;
        hasPreUpdate: boolean;
        hasRender: boolean;
        hasUpdate: boolean;
        parent: any;
        visible: boolean;
 
        destroy(): void;
        postRender(): void;
        preUpdate(): void;
        render(): void;
        update(): void;

    }

    module Plugin {

        class Webcam {

            constructor(game: Phaser.Game, parent: any);


        }

    }

    class PluginManager extends StateCycle {

        constructor(game: Phaser.Game, parent: any);

        game: Phaser.Game;
        plugins: Phaser.Plugin[];

        add(plugin: Phaser.Plugin): Phaser.Plugin;
        destroy(): void;
        postRender(): void;
        postUpdate(): void;
        preUpdate(): void;
        remove(plugin: Phaser.Plugin): void;
        removeAll(): void;
        render(): void;
        update(): void;

    }

    class Point extends PIXI.Point {

        constructor(x?: number, y?: number);

        x: number;
        y: number;

        static add(a: Phaser.Point, b: Phaser.Point, out?: Phaser.Point): Phaser.Point;
        static distance(a: Phaser.Point, b: Phaser.Point, round?: boolean): number;
        static divide(a: Phaser.Point, b: Phaser.Point, out?: Phaser.Point): Phaser.Point;
        static equals(a: Phaser.Point, b: Phaser.Point): boolean;
        static multiply(a: Phaser.Point, b: Phaser.Point, out?: Phaser.Point): Phaser.Point;
        static rotate(a: Phaser.Point, x: number, y: number, angle: number, asDegrees: boolean, distance: boolean): Phaser.Point;
        static subtract(a: Phaser.Point, b: Phaser.Point, out?: Phaser.Point): Phaser.Point;

        add(x: number, y: number): Phaser.Point;
        clamp(min: number, max: number): Phaser.Point;
        clampX(min: number, max: number): Phaser.Point;
        clampY(min: number, max: number): Phaser.Point;
        clone(output?: Phaser.Point): Phaser.Point;
        clone(output: Phaser.Point): Phaser.Point;
        copyFrom(source: any): Phaser.Point;
        copyTo(dest: any): Object;
        distance(dest: Object, round?: boolean): number;
        divide(x: number, y: number): Phaser.Point;
        equals(a: Phaser.Point): boolean;
        getMagnitude(): number;
        setMagnitude(magnitude: number): Phaser.Point;
        invert(): Phaser.Point;
        isZero(): boolean;
        multiply(x: number, y: number): Phaser.Point;
        normalise(): Phaser.Point;
        rotate(x: number, y: number, angle: number, asDegrees: boolean, distance?: number): Phaser.Point;
        set(x: number, y: number): Phaser.Point;
        setTo(x: number, y: number): Phaser.Point;
        subtract(x: number, y: number): Phaser.Point;
        toString(): string;

    }

    class Pointer {

        constructor(game: Phaser.Game, id: number);

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
   
        justPressed(duration?: number): boolean;
        justReleased(duration?: number): boolean;
        leave(event: any): void;
        move(event: any, fromClick?: boolean): void;
        reset(): void;
        start(event: any): void;
        stop(event: any): void;
        update(): void;

    }

    class Polygon {

        constructor(points: any[]);

        points: any[];
        type: number;

        clone(): Phaser.Polygon;
        contains(x: number, y: number): boolean;

    }

    class QuadTree {

        constructor(x: number, y: number, width: number, height: number, maxObject?: number, maxLevels?: number, level?: number);

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
        level: number;
        maxObjects: number;
        maxLevels: number;
        objects: any[];
        nodes: any[];

        clear(): void;
        getIndex(rect: Object): number;
        insert(body: any): void;
        populate(group: Phaser.Group): void;
        populateHandler(sprite: Phaser.Sprite): void;
        reset(x: number, y: number, width: number, height: number, maxObject?: number, maxLevels?: number, level?: number): void;
        retrieve(sprite: Object): any[];
        split(): void;

    }

    class RandomDataGenerator {

        constructor(seeds: number[]);

        angle(): number;
        frac(): number;
        integer(): number;
        integerInRange(min: number, max: number): number;
        normal(): number;
        pick<T>(ary: T[]): T;
        real(): number;
        realInRange(min: number, max: number): number;
        sow(seeds: number[]): void;
        timestamp(min: number, max: number): number;
        uuid(): number;
        weightedPick<T>(ary: T[]): T;

    }

    class Rectangle {

        constructor(x: number, y: number, width: number, height: number);

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

        static clone(a: Phaser.Rectangle, output?: Phaser.Rectangle): Phaser.Rectangle;
        static contains(a: Phaser.Rectangle, x: number, y: number): boolean;
        static containsPoint(a: Phaser.Rectangle, point: Phaser.Point): boolean;
        static containsRaw(rx: number, ry: number, rw: number, rh: number, x: number, y: number): boolean;
        static containsRect(a: Phaser.Rectangle, b: Phaser.Rectangle): boolean;
        static equals(a: Phaser.Rectangle, b: Phaser.Rectangle): boolean;
        static inflate(a: Phaser.Rectangle, dx: number, dy: number): Phaser.Rectangle;
        static inflatePoint(a: Phaser.Rectangle, point: Phaser.Point): Phaser.Rectangle;
        static intersection(a: Phaser.Rectangle, b: Phaser.Rectangle, out?: Phaser.Rectangle): Phaser.Rectangle;
        static intersects(a: Phaser.Rectangle, b: Phaser.Rectangle): boolean;
        static intersectsRaw(left: number, right: number, top: number, bottom: number, tolerance: number): boolean;
        static size(a: Phaser.Rectangle, output?: Phaser.Point): Phaser.Point;
        static union(a: Phaser.Rectangle, b: Phaser.Rectangle, out?: Phaser.Rectangle): Phaser.Rectangle;

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

    class RenderTexture extends PIXI.RenderTexture {

        constructor(game: Phaser.Game, width?: number, height?: number, key?: string);

        game: Phaser.Game;
        key: string;
        type: number;

        renderXY(displayObject: PIXI.DisplayObject, x: number, y: number, clear?: boolean): void;

    }

    class RequestAnimationFrame {

        constructor(game: Phaser.Game, forceSetTimeOut?: boolean);

        game: Phaser.Game;
        isRunning: boolean;

        isRAF(): boolean;
        isSetTimeOut(): boolean;
        start(): boolean;
        stop(): void;
        updateRAF(): void;
        updateSetTimeout(): void;

    }

    class RetroFont extends Phaser.RenderTexture {

        constructor(game: Phaser.Game, key: string, characterWidth: number, characterHeight: number, chars: string, charsPerRow: number, xSpacing?: number, ySpacing?: number, xOffset?: number, yOffset?: number);

        static ALIGN_CENTER: string;
        static ALIGN_LEFT: string;
        static ALIGN_RIGHT: string;
        static TEXT_SET1: string;
        static TEXT_SET2: string;
        static TEXT_SET3: string;
        static TEXT_SET4: string;
        static TEXT_SET5: string;
        static TEXT_SET6: string;
        static TEXT_SET7: string;
        static TEXT_SET8: string;
        static TEXT_SET9: string;
        static TEXT_SET10: string;
        static TEXT_SET11: string;

        align: string;
        autoUpperCase: boolean;
        characterHeight: number;
        characterPerRow: number;
        characterSpacingX: number;
        characterSpacingY: number;
        characterWidth: number;
        customSpacingX: number;
        customSpacingY: number;
        fixedWidth: number;
        fontSet: HTMLImageElement;
        multiLine: boolean;
        offsetX: number;
        offsetY: number;
        text: string;

        buildRetroFontText(): void;
        getLongestLine(): number;
        pasteLine(line: string, x: number, y: number, customSpacingX: number): void;
        removeUnsupportedCharacters(stripCR?: boolean): string;
        resize(width: number, height: number): void;
        setFixedWidth(width: number, lineAlignment?: string): void;
        setText(content: string, multiLine?: boolean, characterSpacing?: number, lineSpacing?: number, lineAlignment?: string, allowLowerCase?: boolean): void;

    }

    class Signal {

        active: boolean;
        memorize: boolean;

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

        constructor(signal: Phaser.Signal, listener: Function, isOnce: boolean, listenerContext?: Object, priority?: number);

        active: boolean;
        context: Object;
        params: any[];

        execute(paramsArr?: any[]): void;
        detach(): Function;
        isBound(): boolean;
        isOnce(): boolean;
        getListener(): Function;
        getSignal(): Phaser.Signal;
        toString(): string;

    }

    class SinglePad {

        constructor(game: Phaser.Game, padParent: Object);
   
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

        axis(axisCode: number): number;
        addButton(buttonCode: number): Phaser.GamepadButton;
        addCallbacks(context: Object, callbacks: Object): void;
        buttonValue(buttonCode: number): boolean;
        connect(rawPad: Object): void;
        disconnect(): void;
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

        constructor(game: Phaser.Game, key: string, volume?: number, loop?: boolean, connect?:boolean);

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

        constructor(game: Phaser.Game);

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

        add(key: string, volume?: number, loop?: boolean, connect?: boolean): Phaser.Sound;
        boot(): void;
        decode(key: string, sound?: Phaser.Sound): void;
        pauseAll(): void;
        play(key: string, volume?: number, loop?: boolean): Phaser.Sound;
        resumeAll(): void;
        stopAll(): void;
        unlock(): void;
        update(): void;

    }

    class Sprite extends PIXI.Sprite {

        constructor(game: Phaser.Game, x: number, y: number, key?: any, frame?: any);

        alive: boolean;
        anchor: Phaser.Point;
        angle: number;
        animations: Phaser.AnimationManager;
        autoCull: boolean;
        body: any;
        cameraOffset: Phaser.Point;
        checkWorldBounds: boolean;
        debug: boolean;
        deltaX: number;
        deltaY: number;
        deltaZ: number;
        events: Phaser.Events;
        exists: boolean;
        fixedToCamera: boolean;
        frame: number;
        frameName: string;
        game: Phaser.Game;
        health: number;
        inCamera: boolean;
        input: Phaser.InputHandler;
        inputEnabled: boolean;
        inWorld: boolean;
        key: any;
        lifespan: number;
        name: string;
        outOfBoundsKill: boolean;
        position: Phaser.Point;
        physicsEnabled: boolean;
        renderOrderID: number;
        scale: Phaser.Point;
        smoothed: boolean;
        type: number;
        world: Phaser.Point;
        x: number;
        y: number;
        z: number;

        bringToTop(): Phaser.Sprite;
        crop(rect: Phaser.Rectangle): void;
        damage(amount: number): Phaser.Sprite;
        destroy(destroyChildren?: boolean): void;
        drawPolygon(): void;
        kill(): Phaser.Sprite;
        loadTexture(key: any, frame: any): void;
        play(name: string, frameRate?: number, loop?: boolean, killOnComplete?: boolean): Phaser.Animation;
        postUpdate(): void;
        preUpdate(): void;
        reset(x: number, y: number, health?: number): Phaser.Sprite;
        revive(health?: number): Phaser.Sprite;
        update(): void;

    }

    class SpriteBatch extends Phaser.Group {

        constructor(game: Phaser.Game, parent: any, name?: string, addedToStage?: boolean);

        type: number;

    }

    class Stage extends PIXI.Stage {

        constructor(game: Phaser.Game, width: number, height: number);

        backgroundColor: any;
        checkOffsetInterval: any;
        currentRenderOrderID: number;
        disableVisibilityChange: boolean;
        exists: boolean;
        game: Phaser.Game;
        name: string;
        offset: Phaser.Point;
        smoothed: boolean;

        checkVisiblity(): void;
        parseConfig(config: Object): void;
        postUpdate(): void;
        preUpdate(): void;
        setBackgroundColor(backgroundColor: number): void;
        update(): void;
        visibilityChange(event: any): void;

    }

    class ScaleManager {
 
        constructor(game: Phaser.Game, width: number, height: number);

        static EXACT_FIT: number;
        static NO_SCALE: number;
        static SHOW_ALL: number;

        aspectRatio: number;
        enterFullScreen: Phaser.Signal;
        enterIncorrectOrientation: Phaser.Signal;
        enterLandscape: Phaser.Signal;
        enterPortrait: Phaser.Signal;
        event: any;
        height: number;
        forcePortrait: boolean;
        forceLandscape: boolean;
        fullScreenTarget: any;
        funnScreenScaleMode: number;
        game: Phaser.Game;
        hasResized: Phaser.Signal;
        incorrectOrientation: boolean;
        leaveFullScreen: Phaser.Signal;
        leaveIncorrectOrientation: Phaser.Signal;
        isLandscape: boolean;
        isFullScreen: boolean;
        isPortrait: boolean;
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
        scaleMode: number;
        sourceAspectRatio: number;
        width: number;

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

        add: Phaser.GameObjectFactory;
        cache: Phaser.Cache;
        camera: Phaser.Camera;
        game: Phaser.Game;  
        input: Phaser.Input;
        load: Phaser.Loader;
        make: Phaser.GameObjectCreator;
        math: Phaser.Math;
        particles: Phaser.Particles;
        physics: Phaser.Physics.Arcade;
        rnd: Phaser.RandomDataGenerator;
        scale: Phaser.ScaleManager;
        sound: Phaser.SoundManager;     
        stage: Phaser.Stage;
        time: Phaser.Time; 
        tweens: Phaser.TweenManager;
        world: Phaser.World;

        create(): void;
        loadRender(): void;
        loadUpdate(): void;
        paused(): void;
        preload(): void;
        render(): void;
        shutdown(): void;
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

        constructor(game: Phaser.Game, pendingState?: Phaser.State);

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
        onResumedCallback: Function;
        onShutDownCallback: Function;
        onUpdateCallback: Function;
        states: Object;

        add(key: string, state: any, autoStart?: boolean): void;
        checkState(key: string): boolean;
        destroy(): void;
        getCurrentState(): Phaser.State;
        link(key: string): void;
        loadComplete(): void;
        pause(): void;
        preRender(): void;
        preUpdate(): void;
        render(): void;
        remove(key: string): void;
        resume(): void;
        start(key: string, clearWorld?: boolean, clearCache?: boolean, ...args:any[]): void;
        update(): void;

    }

    class Text extends PIXI.Text {

        constructor(game: Phaser.Game, x: number, y: number, text: string, style: any);

        align: string;
        angle: number;
        cameraOffset: Phaser.Point;
        events: Phaser.Events;
        exists: boolean;
        fill: Object;
        fixedToCamera: boolean;
        font: string;
        fontSize: number;
        fontWeight: number;
        game: Phaser.Game;
        input: Phaser.InputHandler;
        inputEnabled: boolean;
        lineSpacing: number;
        name: string;
        position: Phaser.Point;
        shadowBlur: number;
        shadowColor: string;
        shadowOffsetX: number;
        shadowOffsetY: number;
        stroke: string;
        strokeThickness: number;
        scale: Phaser.Point;
        text: string;
        type: number;
        world: Phaser.Point;
        wordWrap: boolean;
        wordWrapWidth: number;
        z: number;

        destroy(destroyChildren?: boolean): void;
        postUpdate(): void;
        preUpdate(): void;
        setShadow(x?: number, y?: number, color?: Object, blur?: number): void;
        setStyle(style?: { font?: string; fill?: Object; align?: string; stroke?: string; strokeThickness?: number; wordWrap?: boolean; wordWrapWidth?: number; shadowOffsetX?: number; shadowOffsetY?: number; shadowColor?: string; shadowBlur?: number; }): void;
        update(): void;

    }

    class Tile {

        constructor(layer: Object, index: number, x: number, y: Number, width: number, height: number);//

        alpha: number;
        bottom: number;
        callback: Function;
        callbackContext: Object;
        centerX: number;
        centerY: number;
        canCollide: boolean;
        collideDown: boolean;
        collideLeft: boolean;
        collideNone: boolean;
        collideRight: boolean;
        collisionCallback: Function;
        collisionCallbackContext: Object;
        collides: boolean;
        collideUp: boolean;
        faceBottom: boolean;
        faceLeft: boolean;
        faceRight: boolean;
        faceTop: boolean;
        game: Phaser.Game;
        height: number;
        index: number;
        layer: Object;
        left: number;
        properties: Object;
        right: number;
        scanned: boolean;
        top: number;
        width: number;
        worldX: number;
        worldY: number;
        x: number;
        y: number;

        copy(tile): Phaser.Tile;
        containsPoint(x: number, y: number): boolean;
        destroy(): void;
        intersects(x: number, y: number, right: number, bottom: number): boolean;
        isInterested(collides: boolean, faces: boolean): boolean;
        resetCollision(): void;
        setCollision(left: boolean, right: boolean, up: boolean, down: boolean): void;
        setCollisionCallback(callback: Function, context: Object): void;

    }

    class Tilemap {

        constructor(game: Phaser.Game, key?: string, tileWidth?: number, tileHeight?: number, width?: number, height?: number);
      
        static CSV: number;
        static TILED_JSON: number;

        collision: any[];
        collideIndexes: any[];
        currentLayer: number;
        debugMap: any[];
        game: Phaser.Game;
        height: number;
        heightInPixels: number;
        images: any[];
        key: string;
        layers: Object[];
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

        addTilesetImage(tileset: string, key?: string, tileWidth?: number, tileHeight?: number, tileMargin?: number, tileSpacing?: number, gid?: number): Phaser.Tileset;
        calculateFaces(layer: number): void;
        copy(x: number, y: number, width: number, height: number, layer?: any): Phaser.Tile[];
        create(name: string, width: number, height: number, tileWidth:number, tileHeight:number): Phaser.Tilemap;
        createBlankLayer(name: string, width: number, height: number, tileWidth: number, tileHeight: number, group?: Phaser.Group): Phaser.TilemapLayer;
        createFromObjects(name: string, gid: any, key: string, frame?: any, exists?: boolean, autoCull?: boolean, group?: Phaser.Group, CustomClass?: Object, adjustY?:boolean): void;
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
        getTileWorldXY(x: number, y: number, tileWidth?: number, tileHeight?: number, layer?: any): Phaser.Tile;
        hasTile(x: number, y: number, layer: Phaser.TilemapLayer): boolean;
        paste(x: number, y: number, tileblock: Phaser.Tile[], layer?: any): void;
        putTile(tile: any, x: number, y: number, layer?: any): Phaser.Tile;
        putTileWorldXY(tile: any, x: number, y: number, tileWidth: number, tileHeight: number, layer?: any): void;
        random(x: number, y: number, width: number, height: number, layer?: any): void;
        removeAllLayers(): void;
        replace(source: number, dest: number, x: number, y: number, width: number, height: number, layer?: any): void;
        setCollision(indexes: any, collides?: boolean, layer?: any): void;
        setCollisionBetween(start: number, stop: number, collides?: boolean, layer?: any): void;
        setCollisionByExclusion(indexes: any[], collides?: boolean, layer?: any): void;
        setCollisionByIndex(index: number, collides?: boolean, layer?: number, recalculate?: boolean): void;
        setLayer(layer: any): void;
        setTileIndexCallback(indes: any, callback: Function, callbackContext: Object, layer?: any): void;
        setTileLocationCallback(x: number, y: number, width: number, height: number, callback: Function, callbackContext: Object, layer?: any): void;
        setTileSize(tileWidth: number, tileHeight: number): void;
        shuffle(x: number, y: number, width: number, height: number, layer: any): void;
        swap(tileA: number, tileB: number, x: number, y: number, width: number, height: number, layer?: any): void;

    }

    class TilemapLayer extends Phaser.Image {

        constructor(game: Phaser.Game, tilemap: Phaser.Tilemap, index: number, width: number, height: number);

        baseTexture: PIXI.BaseTexture;
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
        rayStepRate: number;
        scrollFactorX: number;
        scrollFactorY: number;
        scrollX: number;
        scrollY: number;
        texture: PIXI.Texture;
        textureFrame: Phaser.Frame;
        tileColor: string;
        type: number;

        getRayCastTiles(line: Phaser.Line, stepRate?: number, collides?: boolean, interestingFace?: boolean): Phaser.Tile[];
        getTiles(x: number, y: number, width: number, height: number, collides?: boolean, interestingFace?:boolean): Phaser.Tile[];
        getTileX(x: number): Phaser.Tile;
        getTileXY(x: number, y: number, point: Phaser.Point): Phaser.Point;
        getTileY(y: number): Phaser.Tile;
        postUpdate(): void;
        render(): void;
        renderDebug(): void;
        resizeWorld(): void;
        updateMax(): void;

    }

    class TilemapParser {

        static getEmptyData(tileWidth?: number, tileHeight?: number, width?: number, height?: number): Object;
        static parse(game: Phaser.Game, key: string, tileWidth?: number, tileHeight?: number, width?: number, height?: number): Object;
        static parseCSV(key: string, data: string, tileWidth?: number, tileHeight?: number): Object;
        static parseJSON(json: Object): Object;
 
    }

    class Tileset {

        constructor(name: string, firstgid: number, width: number, height: number, margin: number, spacing: number, properties: Object);

        columns: number;
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

        draw(context: CanvasRenderingContext2D, x: number, y: number, index: number): void;
        setImage(image: any): void;
        setSpacing(margin?: number, spacing?: number): void;

    }

    class TileSprite extends PIXI.TilingSprite {

        constructor(game: Phaser.Game, x: number, y: number, width: number, height: number, key?: any, frame?: any);

        angle: number;
        animations: Phaser.AnimationManager;
        autoCull: boolean;
        body: any;
        cameraOffset: Phaser.Point;
        checkWorldBounds: boolean;
        events: Phaser.Events;
        exists: boolean;
        fixedToCamera: boolean;
        frame: number;
        frameName: string;
        game: Phaser.Game;
        input: Phaser.InputHandler;
        inputEnabled: boolean;
        key: any;
        name: string;
        position: Phaser.Point;
        type: number;
        world: Phaser.Point;
        z: number;

        autoScroll(): void;
        destroy(destroyChildren: boolean): void;
        loadTexture(key: any, frame: any): void;
        play(name: string, frameRate?: number, loop?: boolean, killOnComplete?: boolean): Phaser.Animation;
        postUpdate(): void;
        preUpdate(): void;
        reset(x: number, y: number): Phaser.TileSprite;
        stopScroll(): void;
        update(): void;

    }

    class Time {

        constructor(game: Phaser.Game);

        advancedTiming: boolean;
        deltaCap: number;
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

        constructor(game: Phaser.Game, autoDestroy?: boolean);

        static HALF: number;
        static MINUTE: number;
        static QUARTER: number;
        static SECOND: number;

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

        add(delay: number, callback: Function, callbackContext: Object, ...args: any[]): Phaser.TimerEvent;
        destroy(): void;
        loop(delay: number, callback: Function, callbackContext: Object, ...args: any[]): Phaser.TimerEvent;
        order(): void;
        pause(): void;
        remove(event: Phaser.TimerEvent): boolean;
        repeat(delay: number, repeatCount: number, callback: Function, callbackContext: Object, ...args: any[]): Phaser.TimerEvent;
        resume(): void;
        sortHandler(a: any, b: any): number;
        start(): void;
        stop(): void;
        update(time: number): boolean;

    }

    class TimerEvent {

        constructor(timer: Phaser.Timer, delay: number, tick: number, repeatCount: number, loop: boolean, callback: Function, callbackContext, Object, args: any[]);

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

        constructor(game: Phaser.Game);

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

        consumeTouchMove(): void;
        onTouchCancel(event: any): void;
        onTouchEnd(event: any): void;
        onTouchEnter(event: any): void;
        onTouchLeave(event: any): void;
        onTouchMove(event: any): void;
        onTouchStart(event: any): void;
        start(): void;
        stop(): void;

    }

    class Tween {

        constructor(object: Object, game: Phaser.Game, manager: Phaser.TweenManager);

        game: Phaser.Game;
        isRunning: boolean;
        onComplete: Phaser.Signal;
        onLoop: Phaser.Signal;
        onStart: Phaser.Signal;
        pendingDelete: boolean;

        chain(): Phaser.Tween;
        delay(amount: number): Phaser.Tween;
        easing(easing: Function): Phaser.Tween;
        generateData(frameRate: number, data: Object): any[];
        interpolation(interpolation: Function): Phaser.Tween;
        loop(): Phaser.Tween;
        onUpdateCallback(callback: Function, callbackContext: Object): Phaser.Tween;
        pause(): void;
        repeat(times: number): Phaser.Tween;
        resume(): void;
        start(): Phaser.Tween;
        stop(): Phaser.Tween;
        to(properties: Object, duration?: number, ease?: Function, autoStart?: boolean, delay?: number, repeat?: boolean, yoyo?: boolean): Phaser.Tween;
        update(time: number): boolean;
        yoyo(yoyo: boolean): Phaser.Tween;

    }

    class TweenManager {

        constructor(game: Phaser.Game);
  
        game: Phaser.Game;

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

    class Utils {

        static extend(deep: boolean, target: Object): Object;
        static isPlainObject(object: Object): boolean;
        static pad(str: string, len: number, pad: number, dir?: number): string;
        static parseDimension(size: any, dimension: number): number;
        static shuffle(array: any[]): any[];

    }

    module Utils {

        class Debug {

            constructor(game: Phaser.Game);

            baseTexture: PIXI.BaseTexture;
            canvas: HTMLCanvasElement;
            columnWidth: number;
            context: CanvasRenderingContext2D;
            currentAlpha: number;
            currentX: number;
            currentY: number;
            dirty: boolean;
            font: string;
            game: Phaser.Game;
            lineHeight: number;
            renderShadow: boolean;
            sprite: PIXI.Sprite;
            texture: PIXI.Texture;
            textureFrame: Phaser.Frame;

            boot(): void;
            body(sprite: Phaser.Sprite, color?: string, filled?: boolean): void;
            bodyInfo(sprite: Phaser.Sprite, x: number, y: Number, color?: string): void;
            cameraInfo(camera: Phaser.Camera, x: number, y: number, color?: string): void;
            geom(object: any, color?: string, fiiled?: boolean, forceType?: number): void;
            inputInfo(x: number, y: number, color?: string): void;
            lineInfo(line: Phaser.Line, x: number, y: number, color?: string): void;
            key(key: Phaser.Key, x?: number, y?: number, color?: string);
            line(): void;
            preUpdate(): void;
            pixel(x: number, y: number, color?: string, size?: number): void;
            pointer(pointer: Phaser.Pointer, hideIfUp?: boolean, downColor?: string, upColor?: string, color?: string): void;
            quadTree(quadtree: Phaser.QuadTree, color?: string): void;
            rectangle(object: Phaser.Rectangle, color?: string, filled?: boolean): void;
            soundInfo(sound: Phaser.Sound, x: number, y: number, color?: string): void;
            spriteBounds(sprite: any, color?: string, filled?: boolean): void;
            spriteCoords(sprite: any, x: number, y: number, color?: string): void;
            spriteInfo(sprite: Phaser.Sprite, x: number, y: number, color?: string): void;
            spriteInputInfo(sprite: Phaser.Sprite, x: number, y: number, color?: string): void;
            start(x?: number, y?: number, color?: string, columnWidth?: number): void;
            stop(): void;
            text(text: string, x: number, y: number, color?: string, font?: string): void;

        }

    }

    class World extends Phaser.Group {

        constructor(game: Phaser.Game);

        bounds: Phaser.Rectangle;
        camera: Phaser.Camera;
        centerX: number;
        centerY: number;
        game: Phaser.Game;
        height: number;
        randomX: number;
        randomY: number;
        width: number;

        boot(): void;
        setBounds(x: number, y: number, width: number, height: number): void;
        shutdown(): void;

    }
}
