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
        constructor(game: Phaser.Game, parent: Phaser.Sprite, name: string, frameData: Phaser.FrameData, frames: any[], delay: number, looped: boolean);
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
        loop: boolean;
        name: string;
        paused: boolean;
        speed: number;
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
        add(name: string, frames?: any[], frameRate?: number, loop?: boolean, useNumericIndex?: boolean): Phaser.Animation;
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
        constructor(game: Phaser.Game, key: string, width?: number, height?: number);
        //members
        baseTexture: PIXI.BaseTexture;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        ctx: CanvasRenderingContext2D;
        game: Phaser.Game;
        height: number;
        imageData: any[];
        key: string;
        name: string;
        pixels: number;
        texture: PIXI.Texture;
        textureFrame: Phaser.Frame;
        type: number;
        width: number;
        //methods
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
        resize(): void;
        setPixel(x: number, y: number, red: number, green: number, blue: number): void;
        setPixel32(x: number, y: number, red: number, green: number, blue: number, alpha: number): void;
    }

    class BitmapText extends PIXI.BitmapText {
        //constructor
        constructor(game: Phaser.Game, x: number, y: number, font: string, text?: string, size?: number);
        //members
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
        text: string;
        tint: number;
        type: number;
        world: Phaser.Point;
        //methods
        destroy(): void;
        postUpdate(): void;
        preUpdate(): void;
        update(): void;
    }

    class Button extends Phaser.Image {
        //constructor
        constructor(game: Phaser.Game, x?: number, y?: number, key?: string, callback?: Function, callbackContext?: Object, overFrame?: any, outFrame?: any, downFrame?: any, upFrame?: any);
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
        setFrames(overFrame?: any, outFrame?: any, downFrame?: any, upFrame?: any): void;
        setOutSound(sound: Phaser.Sound, marker?: string): void;
        setOverSound(sound: Phaser.Sound, marker?: string): void;
        setSounds(overSound?: Phaser.Sound, overMarker?: string, downSound?: Phaser.Sound, downMarker?: string, outSound?: Phaser.Sound, outMarker?: string, upSound?: Phaser.Sound, upMarker?: string): void;
        setUpSound(sound: Phaser.Sound, marker?: string): void;
    }

    class Cache {
        //constructor
        constructor(game: Phaser.Game);
        //static members
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
        //members
        game: Phaser.Game;
        onSoundUnlock: Phaser.Signal;
        //methods
        addBinary(key: string, binaryData: Object): void;
        addBitmapData(key: string, bitmapData: Phaser.BitmapData): Phaser.BitmapData;
        addBitmapFont(key: string, texture: Phaser.RetroFont): void;
        addBitmapFont(key: string, url: string, data: Object, xmlData: Object, xSpacing?: number, ySpacing?: number): void;
        addCanvas(key: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void;
        addDefaultImage(): void;
        addImage(key: string, url: string, data: Object): void;
        addJSON(key: string, urL: string, data: Object): void;
        addMisingImage(): void;
        addRenderTexture(key: string, texture: RenderTexture): void;
        addSound(key: string, url: string, data: Object, webAudio: boolean, audioTag: boolean): void;
        addSpriteSheet(key: string, url: string, data: Object, frameWidth: number, frameHeight: number, frameMax?: number, margin?: number, spacing?: number): void;
        addText(key: string, url: string, data: Object): void;
        addTextureAtlas(key: string, url: string, data: Object, atlasData: Object, format: number): void;
        addTilemap(key: string, url: string, data: Object, format: number): void;
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
        updateFrameData(key: string, frameData: number): void;
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
        displayObject: PIXI.DisplayObject;
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
        reset(): void;
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
        circumferencePoint(angle: number, asDegrees: boolean, output?: Phaser.Point): Phaser.Point;
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

    class Ellipse {
        //constructor
        constructor(x?: number, y?: number, width?: number, height?: number);
        //members
        bottom: number;
        empty: boolean;
        height: number;
        left: number;
        right: number;
        top: number;
        width: number;
        x: number;
        y: number;
        //static methods
        static constains(a: Phaser.Ellipse, x: number, y: number): boolean;
        //methods
        clone(out: Phaser.Ellipse): Phaser.Ellipse;
        contains(x: number, y: number): boolean;
        copyFrom(source: any): Phaser.Ellipse;
        copyTo(dest: any): Object;
        setTo(x: number, y: number, width: number, height: number): Phaser.Ellipse;
        toString(): string;
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
        uniforms: Object;
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
        getRect(out?: Phaser.Rectangle): Phaser.Rectangle;
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
    }

    class Game {
        //constructor
        constructor(width?: number, height?: number, renderer?: number, parent?: any, state?: Object, transparent?: boolean, antialias?: boolean, physicsConfig?: Object);
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
        make: Phaser.GameObjectCreator;
        math: Phaser.Math;
        net: Phaser.Net;
        parent: HTMLElement;
        particles: Phaser.Particles;
        paused: boolean;
        pendingStep: boolean;
        physics: Phaser.Physics.Arcade.World;
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

    class GameObjectCreator {
        //constructor
        constructor(game: Phaser.Game);
        //members
        game: Phaser.Game;
        world: Phaser.World;
        //methods
        audio(key: string, volume?: number, loop?: boolean, connect?: boolean): Phaser.Sound;
        bitmapData(width?: number, height?: number, key?: string, addToCache?: boolean): Phaser.BitmapData;
        bitmapFont(font: string, characterWidth: number, characterHeight: number, chars: string, charsPerRow: number, xSpacing?: number, ySpacing?: number, xOffset?: number, yOffset?: number): Phaser.RetroFont;
        bitmapText(x: number, y: number, font: string, text?: string, size?: number): Phaser.BitmapText;
        button(x?: number, y?: number, key?: string, callback?: Function, callbackContext?: Object, overFrame?: any, outFrame?: any, downFrame?: any, upFrame?: any): Phaser.Button;
        emitter(x?: number, y?: number, maxParticles?: number): Phaser.Particles.Arcade.Emitter;
        graphics(x: number, y: number, group?: Phaser.Group): Phaser.Graphics;
        group(parent?: any, name?: string, addToStage?: boolean): Phaser.Group;
        image(x: number, y: number, key: any, frame?: any): Phaser.Sprite;
        renderTexture(width?: number, height?: number, key?: any, addToCache?: boolean): Phaser.RenderTexture;
        sound(key: string, volume?: number, loop?: boolean, connect?: boolean): Phaser.Sound;
        sprite(x: number, y: number, key?: any, frame?: any): Phaser.Sprite;
        spriteBatch(parent: any, name?: String, addToStage?: boolean): Phaser.Group;
        text(x: number, y: number, text: string, style: Object): Phaser.Text;
        tileMap(key: string, tilesets: any): Phaser.Tilemap;
        tileSprite(x: number, y: number, width: number, height: number, key: any, frame: any): Phaser.TileSprite;
        tween(obj: Object): Phaser.Tween;
    }

    class GameObjectFactory {
        //constructor
        constructor(game: Phaser.Game);
        //members
        game: Phaser.Game;
        world: Phaser.World;
        //methods
        audio(key: string, volume?: number, loop?: boolean, connect?: boolean): Phaser.Sound;
        bitmapData(width?: number, height?: number, key?: string, addToCache?: boolean): Phaser.BitmapData;
        bitmapFont(font: string, characterWidth: number, characterHeight: number, chars: String, charsPerRow: number, xSpacing?: number, ySpacing?: number, xOffset?: number, yOffset?: number): Phaser.RetroFont;
        bitmapText(x: number, y: number, font: string, text?: string, size?: number, group?: Phaser.Group): Phaser.BitmapText;
        button(x?: number, y?: number, key?: string, callback?: Function, callbackContext?: Object, overFrame?: any, outFrame?: any, downFrame?: any, upFrame?: any, group?: Phaser.Group): Phaser.Button;
        emitter(x?: number, y?: number, maxParticles?: number): Phaser.Particles.Arcade.Emitter;
        existing(object: any): any;
        filter(filter: string, args: any): Phaser.Filter;
        graphics(x: number, y: number, group?: Phaser.Group): Phaser.Graphics;
        group(parent?: any, name?: string, addToStage?: boolean): Phaser.Group;
        image(x: number, y: number, key: any, frame?: any, group?: Phaser.Group): Phaser.Image;
        renderTexture(width?: number, height?: number, key?: string, addToCache?: boolean): Phaser.RenderTexture;
        sound(key: string, volume?: number, loop?: number, connect?: boolean): Phaser.Sound; 
        sprite(x: number, y: number, key?: any, frame?: any, group?: Phaser.Group): Phaser.Sprite;
        spriteBatch(parent: any, name?: string, addToStage?: boolean): Phaser.Group;
        text(x: number, y: number, text: string, style: any, group?: Phaser.Group): Phaser.Text;
        tilemap(key: string, tilesets: any): Phaser.Tilemap;
        tileSprite(x: number, y: number, width: number, height: number, key?: any, frame?: any, group?: Phaser.Group): Phaser.TileSprite;
        tween(obj: Object): Phaser.Tween;
    }

    class GamePad {
        //constructor
        constructor(game: Phaser.Game);
        //members
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
        //methods
        addCallbacks(context: Object, callbacks: Object): void;
        isDown(buttonCode: number): boolean;
        justPressed(buttonCode: number, duration?: number): boolean;
        justReleased(buttonCode: number, duration?: number): boolean;
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
        justReleased(duration?: number): boolean;
        processButtonDown(value: Object): void;
        processButtonFloat(value: Object): void;
        processButtonUp(value: Object): void;
    }

    class Graphics extends PIXI.Graphics {
        //constructor
        constructor(game: Phaser.Game, x: number, y: number);
        //members
        alpha: number;
        angle: number;
        cameraOffset: Phaser.Point;
        exists: boolean;
        fixedToCamera: boolean;
        game: Phaser.Game;
        height: number;
        name: string;
        type: number;
        width: number;
        world: Phaser.Point;
        //destroy
        destroy(): void;
        drawPolygon(): void;
        postUpdate(): void;
        preUpdate(): void;
        update(): void;
        z: nummber;
    }

    class Group extends PIXI.DisplayObjectContainer {
        //constructor
        constructor(game: Phaser.Game, parent?: any, name?: string, addToStage?: boolean);
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
        cameraOffset: Phaser.Point;
        cursor: any;
        exists: boolean;
        fixedToCamera: boolean;
        game: Phaser.Game;
        length: number;
        name: string;
        rotation: number;
        position: Phaser.Point;
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
        callAll(callback: string, callbackContext?: Object, ...parameters: any[]): void;
        callAllExists(callback: Function, callbackContext: Object, existsValue: boolean, ...parameters: any[]): void;
        callbackFromArray(child: Object, callback: Function, callbackContext: Object, length: number): void;
        countDead(): number;
        countLiving(): number;
        create(x: number, y: number, key: string, frame?: any, exists?: boolean): Phaser.Sprite;
        createMultiple(quantity: number, key: string, frame?: any, exists?: boolean): Phaser.Sprite;
        destroy(destroyChildren?: boolean): void;
        divideAll(property: string, amount: number, checkAlive?: boolean, checkVisible?: boolean): void;
        forEach(callback: Function, callbackContext: Object, checkExists: boolean): void;
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
        iterate(key: string, value: any, returnType: number, callback?: Function, callbackContext?: Object): any;
        multiplyAll(property: string, amount: number, checkAlive: boolean, checkVisible: boolean): void;
        next(): void;
        postUpdate(): void;
        preUpdate(): void;
        previous(): void;
        remove(child: any): boolean;
        removeAll(): void;
        removeBetween(startIndex: number, endIndex: number): void;
        replace(oldChild: any, newChild: any): void;
        reverse(): void;
        set(child: Phaser.Sprite, key: string, value: any, checkAlive?: boolean, checkVisible?: boolean, operation?: number)
        setAll(key: string, value: any, checkAlive?: boolean, checkVisible?: boolean, operation?: number): void;
        setProperty(child: any, key: string[], value: any, operation?: number): void;
        sort(index?: string, order?: number): void;
        subAll(property: string, amount: number, checkAlive: boolean, checkVisible: boolean): void;
        swap(child1: any, child2: any): boolean;
        update(): void;
        updateZ(): void;
        z: nummber;
    }

    class Image extends PIXI.Sprite {
        //constructor
        constructor(game: Phaser.Game, x: number, y: number, key: any, frame: any);
        //members
        alpha: number;
        anchor: Phaser.Point;
        angle: number;
        autoCull: boolean;
        cameraOffset: Phaser.Point;
        deltaX: number;
        deltaY: number;
        deltaZ: number;
        events: Phaser.Events;
        exists: boolean;
        fixedToCamera: boolean;
        frame: number;
        frameName: string;
        game: Phaser.Game;
        height: number;
        inCamera: boolean;
        input: Phaser.InputHandler;
        inputEnabled: boolean;
        inWorld: boolean;
        key: any;
        name: string;
        renderOrderID: number;
        scale: Phaser.Point;
        type: number;
        world: Phaser.Point;
        width: number;
        x: number;
        y: number;
        //methods
        bringToTop(): Phaser.Image;
        crop(rect: Phaser.Rectangle): void;
        destroy(): void;
        kill(): Phaser.Image;
        loadTexture(key: any, frame: any): void;
        postUpdate(): void;
        preUpdate(): void;
        reset(x: number, y: number): Phaser.Image;
        revive(): Phaser.Image;
        update(): void;
        z: nummber;
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
        getLocalPosition(displayObject: Phaser.Sprite, pointer: Phaser.Pointer): Phaser.Point;
        getLocalPosition(displayObject: Phaser.Image, pointer: Phaser.Pointer): Phaser.Point;
        getPointer(state: boolean): Phaser.Pointer;
        getPointerFromIdentifier(identifier: number): Phaser.Pointer;
        reset(hard?: boolean): void;
        resetSpeed(x: number, y: number): void;
        setMoveCallback(callBack: Function, callbackContext: Object): void;
        startPointer(event: any): Phaser.Pointer;
        stopPointer(event: any): Phaser.Pointer;
        update(): void;
        updatePointer(event: any): Phaser.Pointer;
    }

    class InputHandler extends Phaser.LinkedListItem {
        //constructor
        constructor(sprite: Phaser.Sprite);
        //members
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
        pixelPerfectAlpha: boolean;
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
        //methods
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
        pointerOut(pointer: Phaser.Pointer): boolean;
        pointerOver(pointer: Phaser.Pointer): boolean;
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
        processKeyDown(event: Object): void;
        processKeyUp(event: Object): void;
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
        static PHYSICS_LIME_CORONA: number;
        static TEXTURE_ATLAS_JSON_ARRAY: number;
        static TEXTURE_ATLAS_JSON_HASH: number;
        static TEXTURE_ATLAS_XML_STARLING: number;
        //members
        baseURL: string;
        crossOrigin: any;
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
        bitmapFont(key: string, textureURL: string, xmlURL?: string, xmlData?: Object, xSpacing?: number, ySpacing?: number): Phaser.Loader;
        checkKeyExists(type: string, key: string): boolean;
        csvLoadComplete(index: number): void;
        dataLoadError(index: number): void;
        fileComplete(key: number): void;
        fileError(key: number): void;
        getAsset(type: string, key: string): any;
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
        xmlLoadComplete(index:number): void;
    }

    class LoaderParser {
        //static methods
        static bitmapFont(game: Phaser.Game, xml: Object, cacheKey: string): Phaser.FrameData;
    }

    class Math {
        //static methods
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
        static p2px(v: number): number;
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
        onMouseDown(event: any): void;
        onMouseMove(event: any): void;
        onMouseUp(event: any): void;
        pointerLockChange(event: any): void;
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
        onPointerDown(event: any): void;
        onPointerMove(event: any): void;
        onPointerUp(event: any): void;
        mouseDownCallback(event: any): void;
        mouseMoveCallback(event: any): void;
        mouseUpCallback(event: any): void;
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
        getQueryString(parameter?: string): string;
        updateQueryString(key: string, value: any, redirect?: boolean, url?: string): string;
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
        update(): void;
    }

    module Particles {
        module Arcade {
            class Emitter extends Phaser.Group {
                //constructor
                constructor(game: Phaser.Game, x?: number, y?: number, maxParticles?: number);
                //members
                angle: number;
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
                position: Phaser.Point;
                right: number;
                top: number;
                type: number;
                visible: boolean;
                width: number;
                x: number;
                y: number;
                //methods
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

    module Physics {

        class Arcade {
            //constructor
            constructor(game: Phaser.Game);
            //members
            bounds: Phaser.Rectangle;
            game: Phaser.Game;
            gravity: Phaser.Point;
            maxLevels: number;
            maxObjects: number;
            quadTree: Phaser.QuadTree;
            //methods
            accelerateToObject(displayObject: any, destination: any, speed?: number, xSpeedMax?: number, ySpeedMax?: number): number;
            accelerateToPointer(displayObject: any, pointer: any, speed?: number, xSpeedMax?: number, ySpeedMax?: number): number;
            accelerateToXY(displayObject: any, x: number, y: number, speed?: number, xSpeedMax?: number, ySpeedMax?: number): number;
            accelerateFromRotation(rotation: number, speed?: number, point?: Phaser.Point): Phaser.Point;
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
        }

        module Arcade {

            class FaceChoices {
                none: boolean;
                any: boolean;
                up: boolean;
                down: boolean;
                left: boolean;
                right: boolean;
            }

            interface IPolygonOptions {

                optimalDecomp?: boolean;
                skipSimpleCheck?: boolean;
                removeCollinearPoints?: any;

            }

            class Body {
                //constructor
                constructor(game: Phaser.Game, sprite?: Phaser.Sprite, x?: number, y?: number, mass?: number);
                //members
                acceleration: Phaser.Point;
                allowGravity: boolean;
                allowRotation: boolean;
                angle: number;
                angularAcceleration: number;
                angularDrag: number;
                angularVelocity: number;
                bottom: number;
                bounce: Phaser.Point;
                checkCollision: FaceChoices;
                collideCallback: any;
                collideCallbackContext: any;
                collideWorldBounds: boolean;
                customSeparateCallback: Function;
                customSeparateContext: any;
                drag: Phaser.Point;
                facing: number;
                game: Phaser.Game;
                gravity: Phaser.Point;
                height: number;
                immovable: boolean;
                left: number;
                mass: number;
                maxAngular: number;
                maxVelocity: Phaser.Point;
                minVelocity: Phaser.Point;
                moves: boolean;
                offset: Phaser.Point;
                overlapX: number;
                overlapY: number;
                preRotation: number;
                preX: number;
                preY: number;
                prev: Phaser.Point;
                rebound: boolean;
                right: number;
                rotation: number;
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
                checkWorldBounds(): void;
                deltaX(): number;
                deltaY(): number;
                deltaZ(): number;
                destroy(): void;
                postUpdate(): void;
                preUpdate(): void;
                setSize(width: number, height: number, offsetX: number, offsetY: number): void;
                reset(full: boolean): void;
                update(): void;
                updateBounds(): void;
                updateScale(): void;
            }

            class CollisionGroup {

                mask: number;

            }

            class ContactMaterial {

                constructor(materialA: Phaser.Physics.Arcade.Material, materialB: Phaser.Physics.Arcade.Material, options?: any);

            }

            class InversePointProxy {

                constructor(game: Phaser.Game, destination: any);
                x: number;
                y: number;

            }

            class Material {

                name: string;

            }

            class PointProxy {

                constructor(game: Phaser.Game, destination: any);

                x: number;
                y: number;

            }

            class Spring {

                constructor(game: Phaser.Game, bodyA: any, bodyB: any, restLength?: number, stiffness?: number, damping?: number, worldA?: any[], worldB?: any[], localA?: any, localB?: any);

                game: Phaser.Game;

            }

            class World {

                constructor(game: Phaser.Game, config: Object);

                applyDamping: boolean
                applyGravity: boolean;
                applySpringForces: boolean;
                bounds: any;
                collisionGroups: any[];
                emitImpactEvent: boolean;
                enableBodySleeping: boolean;
                friction: number;
                game: Phaser.Game;
                gravity: Phaser.Physics.Arcade.InversePointProxy;
                materials: Phaser.Physics.Arcade.Material[];
                onBeginContact: Phaser.Signal;
                onBodyRemoved: Phaser.Signal;
                onConstraintAdded: Phaser.Signal;
                onConstraintRemoved: Phaser.Signal;
                onContactMaterialAdded: Phaser.Signal;
                onContactMaterialRemoved: Phaser.Signal;
                onEndContact: Phaser.Signal;
                onImpact: Phaser.Signal;
                onPostBroadphase: Phaser.Signal;
                onPostStep: Phaser.Signal;
                onSpringAdded: Phaser.Signal;
                onSpringRemoved: Phaser.Signal;
                restitution: number;
                solveConstraints: boolean
                time: boolean;
                world: any;

                addBody(body: Phaser.Physics.Arcade.Body): boolean;
                addConstraint(constraint: any)


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

    class Point extends PIXI.Point {
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
        clone(): Phaser.Point;
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
    }

    class Polygon {
        //constructor
        constructor(points: any[]);
        //members
        points: any[];
        type: number;
        //methods
        clone(): Phaser.Polygon;
        contains(x: number, y: number): boolean;
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
        //methods
        angle(): number;
        frac(): number;
        hash(data: any): number;
        integer(): number;
        integerInRange(min: number, max: number): number;
        normal(): number;
        pick(ary: number[]): any;
        real(): number;
        realInRange(min: number, max: number): number;
        rnd(): void;
        sow(seeds: any[]): void;
        timestamp(min: number, max: number): number;
        uuid(): number;
        weightedPick(ary: number[]): any;
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
        static containsRaw(rx: number, ry: number, rw: number, rh: number, x: number, y: number): boolean;
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

    class RenderTexture extends PIXI.RenderTexture {
        //constructor
        constructor(game: Phaser.Game, width?: number, height?: number, key?:string);
        //members
        game: Phaser.Game;
        key: string;
        type: number;
        //methods
        renderXY(displayObject: PIXI.DisplayObject, x: number, y: number, clear?: boolean, renderHidden?: boolean): void;
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

    class RetroFont extends Phaser.RenderTexture {
        //constructor
        constructor(game: Phaser.Game, key: string, characterWidth: number, characterHeight: number, chars: string, charsPerRow: number, xSpacing?: number, ySpacing?: number, xOffset?: number, yOffset?: number);
        //static members
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
        //members
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
        game: Phaser.Game;
        key: string;
        multiLine: boolean;
        offsetX: number;
        offsetY: number;
        type: number;
        //methods
        buildBitmapFontText(line: string, x: number, y: number, customSpacingX: number): void;
        getLongestLine(): number;
        removeUnsupportedCharacters(stripCR?: boolean): string;
        resize(): void;
        setFixedWidth(width: number, lineAlignment?: string): void;
        setText(content: string, multiLine?: boolean, characterSpacing?: number, lineSpacing?: number, lineAlignment?: string, allowLowerCase?: boolean): void;
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

    class Sprite extends PIXI.Sprite {
        //constructor
        constructor(game: Phaser.Game, x: number, y: number, key?: any, frame?: any);
        //members
        alive: boolean;
        angle: number;
        anchor: Phaser.Point;
        animations: Phaser.AnimationManager;
        autoCull: boolean;
        body: Phaser.Physics.Arcade.Body;
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
        physicsEnabled: boolean;
        renderOrderID: number;
        scale: Phaser.Point;
        type: number;
        visible: boolean;
        world: Phaser.Point;
        x: number;
        y: number;
        //members
        bringToTop(): Phaser.Sprite;
        crop(rect: Phaser.Rectangle): void;
        damage(amount: number): Phaser.Sprite;
        destroy(): void;
        drawPolygon(): void;
        kill(): Phaser.Sprite;
        loadTexture(key: any, frame: any): void;
        play(name: string, frameRate?: number, loop?: boolean, killOnComplete?: boolean): Phaser.Animation;
        postUpdate(): void;
        preUpdate(): void;
        reset(x: number, y: number, health?: number): Phaser.Sprite;
        revive(health?: number): Phaser.Sprite;
        update(): void;
        z: nummber;
    }

    class SpriteBatch extends Phaser.Group {
        //constructor
        constructor(game: Phaser.Game, parent: any, name?: string, addedToStage?: boolean);
        //members
        type: number;
    }

    class Stage extends PIXI.Stage {
        //constructor
        constructor(game: Phaser.Game, width: number, height: number);
        //members
        backgroundColor: any;
        checkOffsetInterval: any;
        disableVisibilityChange: boolean;
        exists: boolean;
        game: Phaser.Game;
        name: string;
        offset: Phaser.Point;
        smoothed: boolean;
        //methods
        checkVisiblity(): void;
        parseConfig(): void;
        postUpdate(): void;
        preUpdate(): void;
        update(): void;
        visibilityChange(event: any): void;
    }

    class ScaleManager {
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
        enterFullScreen: Phaser.Signal;
        leaveFullScreen: Phaser.Signal;
        event: any;
        forceLandscape: boolean;
        forcePortrait: boolean;
        fullScreenTarget: any;
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
        scaleMode: number;
        sourceAspectRatio: number;
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
        onResumedCallback: Function;
        onShutDownCallback: Function;
        onUpdateCallback: Function;
        states: Object;
        //methods
        add(key: string, state: any, autoStart?: boolean): void;
        checkState(key: string): boolean;
        destroy(): void;
        getCurrentState(): Phaser.State;
        link(key: string): void;
        loadComplete(): void;
        pause(): void;
        preRender(): void;
        remove(key: string): void;
        render(): void;
        resume(): void;
        start(key: string, clearWorld?: boolean, clearCache?: boolean, ...args:any[]): void;
        update(): void;
    }

    class Text extends PIXI.Text {
        //constructor
        constructor(game: Phaser.Game, x: number, y: number, text: string, style: any);
        //members
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
        wordWrap: boolean;
        wordWrapWidth: number;
        x: number;
        y: number;
        visible: boolean;
        //methods
        destroy(): void;
        postUpdate(): void;
        preUpdate(): void;
        setShadow(x?: number, y?: number, color?: Object, blur?: number): void;
        setStyle(style?: { font?: string; fill?: Object; align?: string; stroke?: string; strokeThickness?: number; wordWrap?: boolean; wordWrapWidth?: number; shadowOffsetX?: number; shadowOffsetY?: number; shadowColor?: string; shadowBlur?: number; }): void;
        update(): void;
        z: nummber;
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
        collision: any[];
        collideIndexes: any[];
        currentLayer: number;
        debugMap: any[];
        game: Phaser.Game;
        height: number;
        heightInPixels: number;
        images: any[];
        key: string;
        layers: Phaser.TilemapLayer[];
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
        mapFormat: string;
        //methods
        addTilesetImage(tileset: string, key?: string): void;
        calculateFaces(layer: number): void;
        clearPhysicsBodies(layer?: any): void;
        copy(x: number, y: number, width: number, height: number, layer?: any): Phaser.Tile[];
        create(name: string, width: number, height: number): void;
        createCollisionObjects(layer?: any, addToWorld?: boolean): Phaser.Physics.Arcade.Body[];
        createFromObjects(name: string, gid: number, key: string, frame?: any, exists?: boolean, autoCull?: boolean, group?: Phaser.Group, objectClass?: Object): void;
        createLayer(layer: any, width?: number, height?: number, group?: Phaser.Group): Phaser.TilemapLayer;
        destroy(): void;
        dump(): void;
        fill(index: number, x: number, y: number, width: number, height: number, layer?: any): void;
        forEach(callback: number, context: any, x: number, y: Number, width: number, height: number, layer?: any): void;
        generateCollisionData(layer?: any, addToWorld?: boolean): Phaser.Physics.Arcade.Body[];
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
        getTileWorldXY(x: number, y: number, layer?: any): Phaser.Tile;
        hasTile(x: number, y: number, layer: Phaser.TilemapLayer): boolean;
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
        z: nummber;
    }

    class TilemapParser {
        //static methods
        static getEmptyData(): Object;
        static parse(game: Phaser.Game, key: string): Phaser.Tileset;
        static parseCSV(data: string): Phaser.Tilemap;
        static parseJSON(json: Object): Phaser.Tilemap;
        static tileset(game: Phaser.Game, key: string, tileWidth: number, tileHeight: number, tileMargin?: number, tileSpacing?: number, rows?: number, colums?: number, total?: number): Phaser.Tileset;
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

    class TileSprite extends PIXI.TilingSprite {
        //constructor
        constructor(game: Phaser.Game, x: number, y: number, width: number, height: number, key?: any, frame?: any);
        //members
        angle: number;
        animations: Phaser.AnimationManager;
        body: any;
        cameraOffset: Phaser.Point;
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
        type: number;
        world: Phaser.Point;
        //methods
        autoScroll(): void;
        destroy(): void;
        loadTexture(key: any, frame: any): void;
        play(name: string, frameRate?: number, loop?: boolean, killOnComplete?: boolean): Phaser.Animation;
        postUpdate(): void;
        preUpdate(): void;
        stopScroll(): void;
        update(): void;
        z: nummber;
    }

    class Time {
        //constructor
        constructor(game: Phaser.Game);
        //members
        advancedTiming: boolean;
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
        stop(): void;
    }

    class Tween {
        //constructor
        constructor(object: Object, game: Phaser.Game, manager?:Phaser.TweenManager);
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
        generateData(frameRate: number, data: Object): any[];
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
            bodyInfo(sprite: Phaser.Sprite, x: number, y: Number, color?: string): void;
            cameraInfo(camera: Phaser.Camera, x: number, y: number, color?: string): void;
            geom(object: any, color?: string, fiiled?: boolean, forceType?: number): void;
            inputInfo(x: number, y: number, color?: string): void;
            lineInfo(line: Phaser.Line, x: number, y: number, color?: string): void;
            key(key: Phaser.Key, x?: number, y?: number, color?: string) {
            line(text: string): void;
            pixel(x: number, y: number, color?: string): void;
            pointer(pointer: Phaser.Pointer, hideIfUp?: boolean, downColor?: string, upColor?: string, color?: string): void;
            quadTree(quadtree: Phaser.QuadTree, color?: string): void;
            soundInfo(sound: Phaser.Sound, x: number, y: number, color?: string): void;
            spriteBounds(sprite: Phaser.Sprite, color?: string, filled?: boolean): void;
            spriteBounds(sprite: Phaser.Image, color?: string, filled?: boolean): void;
            spriteCoords(sprite: Phaser.Sprite, x: number, y: number, color?: string): void;
            spriteCoords(image: Phaser.Image, x: number, y: number, color?: string): void;
            spriteInfo(sprite: Phaser.Sprite, x: number, y: number, color?: string): void;
            spriteInputInfo(sprite: Phaser.Sprite, x: number, y: number, color?: string): void;
            text(text: string, x: number, y: number, color?: string, font?: string): void;
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
        countDead(): number;
        countLiving(): number;
        setBounds(x: number, y: number, width: number, height: number): void;
        update(): void;
    }
}
