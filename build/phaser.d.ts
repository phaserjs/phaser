declare class Phaser {
    static VERSION: string;
    static DEV_VERSION: string;
    static GAMES: Array<Phaser.Game>;
    static AUTO: number;
    static CANVAS: number;
    static WEBGL: number;
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
    static BITMAPDATA: number;
    static CANVAS_FILTER: number;
    static WEBGL_FILTER: number;
}

declare module Phaser {
    class Camera {
        constructor(game: Phaser.Game, id: number, x: number, y: number, width: number, height: number);
        game: Phaser.Game;
        world: Phaser.World;
        id: number;
        x: number;
        y: number;
        width: number;
        height: number;
        view: Phaser.Rectangle;
        screenView: Phaser.Rectangle;
        bounds: Phaser.Rectangle;
        deadzone: Phaser.Rectangle;
        visible: boolean;
        atLimit: { x: boolean; y: boolean; };
        target: Phaser.Sprite;
        private _edge: number;
        static FOLLOW_LOCKON: number;
        static FOLLOW_PLATFORMER: number;
        static FOLLOW_TOPDOWN: number;
        static FOLLOW_TOPDOWN_TIGHT: number;
        follow(target: Phaser.Sprite, style?: number): void;
        focusOnXY(x: number, y: number): void;
        update(): void;
        checkWorldBounds(): void;
        setPosition(x: number, y: number): void;
        setSize(width: number, height: number): void;
    }

    class State {
        game: Phaser.Game;
        add: Phaser.GameObjectFactory;
        camera: Phaser.Camera;
        cache: Phaser.Cache;
        input: Phaser.Input;
        load: Phaser.Loader;
        stage: Phaser.Stage;
        math: Phaser.Math;
        sound: Phaser.SoundManager;
        time: Phaser.Time;
        tweens: Phaser.TweenManager;
        world: Phaser.World;
        particles: Phaser.Particles;
        physics: Phaser.Physics.Arcade;
        preload();
        loadUpdate();
        loadRender();
        create();
        update();
        render();
        paused();
        destroy();
    }

    class StateManager {
        constructor(game: Phaser.Game, pendingState: Phaser.State);
        game: Phaser.Game;
        states: { [key: string]: Phaser.State };
        current: string;
        onInitCallback(): void;
        onPreloadCallback(): void;
        onCreateCallback(): void;
        onUpdateCallback(): void;
        onRenderCallback(): void;
        onPreRenderCallback(): void;
        onLoadUpdateCallback(): void;
        onLoadRenderCallback(): void;
        onPausedCallback(): void;
        onShutDownCallback(): void;
        boot(): void;
        add(key: string, state: any, autoStart?: boolean): void;
        remove(key: string): void;
        start(key: string, clearWorld?: boolean, clearCache?: boolean): void;
        dummy(): void;
        checkState(key: string): boolean;
        link(key: string): void;
        getCurrentState(): Phaser.State;
        loadComplete(): void;
        update(): void;
        preRender(): void;
        render(): void;
        destroy(): void;
    }

    class LinkedListItem {
        next: LinkedListItem;
        prev: LinkedListItem;
        first: LinkedListItem;
        last: LinkedListItem;
    }

    class LinkedList extends LinkedListItem {
        total: number;
        add(child: LinkedListItem): LinkedListItem;
        remove(child: LinkedListItem): void;
        callAll(callback: string): void;
        dump(): void;
    }

    class Signal {
        memorize: boolean;
        active: boolean;
        validateListener(listener: Function, fnName: string): void;
        has(listener: Function, context?: any): boolean;
        add(listener: Function, listenerContext?: any, priority?: number): Phaser.SignalBinding;
        addOnce(listener: Function, listenerContext?: any, priority?: number): Phaser.SignalBinding;
        remove(listener: Function, context?: any): Function;
        removeAll(): void;
        getNumListeners(): number;
        halt(): void;
        dispatch(...params: any[]): void;
        forget(): void;
        dispose(): void;
        toString(): string;
    }

    class SignalBinding {
        constructor(signal: Phaser.Signal, listener: Function, isOnce: boolean, listenerContext: Object, priority?: number);
        context: Object;
        active: boolean;
        params: Array<any>;
        execute(paramsArr?: Array<any>): void;
        detach(): Function;
        isBound(): boolean;
        isOnce(): boolean;
        getListener(): Function;
        getSignal(): Phaser.Signal;
        toString(): string;
    }

    class StateCycle {
        preUpdate(): void;
        update(): void;
        render(): void;
        postRender(): void;
        destroy(): void;
    }

    class Plugin extends StateCycle {
        constructor(game: Phaser.Game, parent: any);
        game: Phaser.Game;
        parent: any;
        active: boolean;
        visible: boolean;
        hasPreUpdate: boolean;
        hasUpdate: boolean;
        hasRender: boolean;
        hasPostRender: boolean;
    }

    class PluginManager extends StateCycle {
        constructor(game: Phaser.Game, parent: any);
        game: Phaser.Game;
        private _parent: any;
        plugins: Phaser.Plugin[];
        add(plugin: Phaser.Plugin): Phaser.Plugin;
        remove(plugin: Phaser.Plugin): void;
    }

    class Stage {
        constructor(game: Phaser.Game, width: number, height: number);
        game: Phaser.Game;
        offset: Phaser.Point;
        canvas: HTMLCanvasElement;
        scaleMode: number;
        scale: Phaser.StageScaleMode;
        aspectRatio: number;
        backgroundColor: string;
        disableVisibilityChange: boolean;
        boot(): void;
        visibilityChange(event: Event): void;
    }

    // Wraps a PIXI.DisplayObjectContainer
    class Group {
        constructor(game: Phaser.Game, parent?: any, name?: string, useStage?: boolean);
        game: Phaser.Game;
        name: string;
        type: number;
        exists: boolean;
        sortIndex: string;
        length: number;
        x: number;
        y: number;
        angle: number;
        rotation: number;
        visible: boolean;
        add(child: any): any;
        addAt(child: any, index: number): any;
        getAt(index: number): any;
        create(x: number, y: number, key: string, frame?: any, exists?: boolean): Phaser.Sprite;
        swap(child1: any, child2: any): boolean;
        bringToTop(child: any): any;
        getIndex(child: any): number;
        replace(oldChild: any, newChild: any): void;
        setProperty(child: any, key: string[], value: string, operation: number): void;
        setAll(key: string, value: number, checkAlive: boolean, checkVisible: boolean, operation: number): void;
        subAll(key: string, value: number, checkAlive: boolean, checkVisible: boolean, operation: number): void;
        multiplyAll(key: string, value: number, checkAlive: boolean, checkVisible: boolean, operation: number): void;
        divideAll(key: string, value: number, checkAlive: boolean, checkVisible: boolean, operation: number): void;
        callAllExists(callback: Function, callbackContext: Object, existsValue: boolean): void;
        callAll(callback: string, callbackContext?: Object): void;
        forEach(callback: Function, callbackContext: Object, checkExists: boolean): void;
        forEachAlive(callback: Function, callbackContext: Object): void;
        forEachDead(callback: Function, callbackContext: Object): void;
        getFirstExists(state: boolean): any;
        getFirstAlive(): any;
        getFirstDead(): any;
        countLiving(): number;
        countDead(): number;
        getRandom(startIndex: number, length: number): any;
        remove(child: any): void;
        removeAll(): void;
        removeBetween(startIndex: number, endIndex: number): void;
        destroy(): void;
        dump(full: boolean): void;
    }

    class World extends Phaser.Group {
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        bounds: Phaser.Rectangle;
        camera: Phaser.Camera;
        currentRenderOrderID: number;
        group: Phaser.Group;
        width: number;
        height: number;
        centerX: number;
        centerY: number;
        randomX: number;
        randomY: number;
        boot(): void;
        update(): void;
        setBounds( x:number, y:number, width: number, height: number): void;
        destroy(): void;
    }

    class Game {
        /*
         * Defaults:
         * [width=800] - The width of your game in game pixels.
         * [height=600] - The height of your game in game pixels.
         * [renderer=Phaser.AUTO] - Which renderer to use: Phaser.AUTO will auto-detect, Phaser.WEBGL, Phaser.CANVAS or Phaser.HEADLESS (no rendering at all).
         * [parent=''] - The Games DOM parent.
         * [state=null] - Description.
         * [transparent=false] - Use a transparent canvas background or not.
         * [antialias=true] - Anti-alias graphics.
         * */
        constructor(width?: number, height?: number, renderer?: number, parent?: string, state?: Object, transparent?: boolean, antialias?: boolean);
        id: number;
        width: number;
        height: number;
        renderer: number;
        transparent: boolean;
        antialias: boolean;
        parent: string;
        state: Phaser.StateManager;
        renderType: number;
        isBooted: boolean;
        raf: Phaser.RequestAnimationFrame;
        add: Phaser.GameObjectFactory;
        cache: Phaser.Cache;
        input: Phaser.Input;
        load: Phaser.Loader;
        math: Phaser.Math;
        sound: Phaser.SoundManager;
        stage: Phaser.Stage;
        time: Phaser.Time;
        tweens: Phaser.TweenManager;
        world: Phaser.World;
        physics: Phaser.Physics.Arcade;
        rnd: Phaser.RandomDataGenerator;
        device: Phaser.Device;
        camera: Phaser.Camera;
        canvas: HTMLCanvasElement;
        context: Object;
        debug: Phaser.Utils.Debug;
        particles: Phaser.Particles;
        _paused: boolean;
        paused: boolean;
        boot(): void;
        setUpRenderer(): void;
        loadComplete(): void;
        update(): void;
        destroy(): void;
    }

    class Input {
        constructor(game: Phaser.Game);
        static MOUSE_OVERRIDES_TOUCH: number;
        static TOUCH_OVERRIDES_MOUSE: number;
        static MOUSE_TOUCH_COMBINE: number;
        id: number;
        active: boolean;
        game: Phaser.Game;
        hitCanvas: any;
        hitContext: any;
        pollRate: number;
        disabled: boolean;
        multiInputOverride: number;
        position: Phaser.Point;
        speed: Phaser.Point;
        circle: Phaser.Circle;
        scale: Phaser.Point;
        maxPointers: number;
        currentPointers: number;
        tapRate: number;
        doubleTapRate: number;
        holdRate: number;
        justPressedRate: number;
        justReleasedRate: number;
        recordPointerHistory: boolean;
        recordRate: number;
        recordLimit: number;
        x: number;
        y: number;
        totalInactivePointers: number;
        totalActivePointers: number;
        worldX: number;
        worldY: number;
        pollLocked: boolean;
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
        activePointer: Phaser.Pointer;
        mousePointer: Phaser.Pointer;
        mouse: Phaser.Mouse;
        keyboard: Phaser.Keyboard;
        touch: Phaser.Touch;
        mspointer: Phaser.MSPointer;
        interactiveItems: Phaser.LinkedList;
        onDown: Phaser.Signal;
        onUp: Phaser.Signal;
        onTap: Phaser.Signal;
        onHold: Phaser.Signal;
        boot(): void;
        update(): void;
        reset(hard?: boolean);
        resetSpeed(x: number, y: number);
        startPointer(event: Event): Phaser.Pointer;
        updatePointer(event: Event): Phaser.Pointer;
        stopPointer(event: Event): Phaser.Pointer;
        getPointer(state: boolean): Phaser.Pointer;
        getPointerFromIdentifier(identifier: number): Phaser.Pointer;
        addPointer(): Phaser.Pointer;
    }

    class Key {
        constructor( game:Phaser.Game, keycode:number )
        isDown:boolean;
        isUp:boolean;
        altKey:boolean;
        ctrlKey:boolean;
        shiftKey:boolean;
        timeDown:number;
        duration:number;
        timeUp:number;
        repeats:number;
        keycode:number;
        onDown:Phaser.Signal;
        onUp:Phaser.Signal;
        justPressed( duration:number ):boolean;
        justReleased( duration:number ):boolean;
    }

    interface CursorKeys
    {
        up:Phaser.Key;
        down:Phaser.Key;
        left:Phaser.Key;
        right:Phaser.Key;
    }

    class Keyboard {
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        disabled: boolean;
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
        start(): void;
        stop(): void;
        addKey(keycode: number): Phaser.Key;
        addKeyCapture(keycode: any): void;
        removeKeyCapture(keycode: number): void;
        clearCaptures(): void;
        onKeyDown(event: any): void;
        onKeyUp(event: any): void;
        reset(): void;
        justPressed(keycode: number, duration?: number): boolean;
        justReleased(keycode: number, duration?: number): boolean;
        isDown(keycode: number): boolean;
        createCursorKeys():CursorKeys;
    }

    class Mouse {
        constructor(game: Phaser.Game)
        game: Phaser.Game;
        callbackContext: Object;
        disabled: boolean;
        locked: boolean;
        static LEFT_BUTTON: number;
        static MIDDLE_BUTTON: number;
        static RIGHT_BUTTON: number;
        mouseDownCallback: Function;
        mouseMoveCallback: Function;
        mouseUpCallback: Function;
        start(): void;
        onMouseDown(): void;
        onMouseUp(): void;
        onMouseMove(): void;
        requestPointerLock(): void;
        pointerLockChange(): void;
        releasePointerLock(): void;
        stop();
    }

    class MSPointer {
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        callbackContext: Object;
        disabled: boolean;
        mouseDownCallback(): void;
        mouseMoveCallback(): void;
        mouseUpCallback(): void;
        start(): void;
        onPointerDown(): void;
        onPointerUp(): void;
        onPointerMove(): void;
        stop(): void;
    }

    class Pointer {
        constructor(game: Phaser.Game, id: number);
        game: Phaser.Game;
        id: number;
        active: boolean;
        positionDown: Phaser.Point;
        position: Phaser.Point;
        circle: Phaser.Circle;
        withinGame: boolean;
        clientX: number;
        clientY: number;
        pageX: number;
        pageY: number;
        screenX: number;
        screenY: number;
        duation: number;
        worldX: number;
        worldY: number;
        x: number;
        y: number;
        isMouse: boolean;
        isDown: boolean;
        isUp: boolean;
        timeDown: number;
        timeUp: number;
        previousTapTime: number;
        totalTouches: number;
        msSinceLastClick: number;
        targetObject: any;
        start(event: any): Phaser.Pointer;
        update(): void;
        move(event: any): void;
        leave(event: any): void;
        stop(event: any): void;
        justPressed(duration?: number): boolean;
        justReleased(duration?: number): boolean;
        reset(): void;
        toString(): string;
    }

    class Touch {
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        callbackContext: any;
        touchStartCallback: Function;
        touchMoveCallback: Function;
        touchEndCallback: Function;
        touchEnterCallback: Function;
        touchLeaveCallback: Function;
        touchCancelCallback: Function;
        preventDefault: boolean;
        disabled: boolean;
        start(): void;
        consumeDocumentTouches(): void;
        onTouchStart(event: any): void;
        onTouchCancel(event: any): void;
        onTouchEnter(event: any): void;
        onTouchLeave(event: any): void;
        onTouchMove(event: any): void;
        onTouchEnd(event: any): void;
        stop(): void;
    }

    class InputHandler extends LinkedListItem {
        constructor(sprite: Phaser.Sprite);
        game: Phaser.Game;
        sprite: Phaser.Sprite;
        enabled: boolean;
        priorityID: number;
        useHandCursor: boolean;
        isDragged: boolean;
        allowHorizontalDrag: boolean;
        allowVerticalDrag: boolean;
        bringToTop: boolean;
        snapOffset: number;
        snapOnDrag: boolean;
        snapOnRelease: boolean;
        snapX: number;
        snapY: number;
        pixelPerfect: boolean;
        pixelPerfectAlpha: number;
        draggable: boolean;
        boundsSprite: Phaser.Sprite;
        consumePointerEvent: boolean;
        start(priority: number, useHandCursor: boolean): void;
        reset(): void;
        stop(): void;
        destroy(): void;
        pointerX(pointer: number): number;
        pointerY(pointer: number): number;
        pointerDown(pointer: number): boolean;
        pointerUp(pointer: number): boolean;
        pointerTimeDown(pointer: number): number;
        pointerTimeUp(pointer: number): number;
        pointerOver(pointer: number): boolean;
        pointerOut(pointer: number): boolean;
        pointerTimeOver(pointer: number): number;
        pointerTimeOut(pointer: number): number;
        pointerDragged(pointer: number): boolean;
        checkPointerOver(pointer: number): boolean;
        checkPixel(x: number, y: number): boolean;
        update(pointer: number): void;
        updateDrag(pointer: number): boolean;
        justOver(pointer: number, delay: number): boolean;
        justOut(pointer: number, delay: number): boolean;
        justPressed(pointer: number, delay: number): boolean;
        justReleased(pointer: number, delay: number): boolean;
        overDuration(pointer: number): number;
        downDuration(pointer: number): number;
        enableDrag(lockCenter: boolean, bringToTop: boolean, pixelPerfect: boolean, alphaThreshold?: number, boundsRect?: Phaser.Rectangle, boundsSprite?: Phaser.Rectangle): void;
        disableDrag(): void;
        startDrag(): void;
        stopDrag(): void;
        setDragLock(allowHorizontal: boolean, allowVertical: boolean): void;
        enableSnap(snapX: number, snapY: number, onDrag?: boolean, onRelease?: boolean): void;
        disableSnap(): void;
        checkBoundsRect(): void;
        checkBoundsSprite(): void;
    }

    class Event {
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

    class GameObjectFactory {
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        world: Phaser.World;
        existing(object: any): any;
        sprite(x: number, y: number, key?: string, frame?: any): Phaser.Sprite;
        child(parent: any, x: number, y: number, key?: string, frame?: number): Phaser.Sprite;
        tween(obj: Object): Phaser.Tween;
        group(parent?: any, name?: string): Phaser.Group;
        audio(key: string, volume?: number, loop?: boolean): Phaser.Sound;
        tileSprite(x: number, y: number, width: number, height: number, key?: string, frame?: number): Phaser.TileSprite;
        text(x: number, y: number, text: string, style: any): Phaser.Text;
        button(x: number, y: number, key: string, callback: Function, callbackContext: Object, overFrame?: any, outFrame?: any, downFrame?: any): Phaser.Button;
        graphics(x: number, y: number): Phaser.Graphics;
        emitter(x: number, y: number, maxParticles: number): Phaser.Particles.Arcade.Emitter;
        bitmapText(x: number, y: number, text: string, style: any): Phaser.BitmapText;
        tilemap(x: number, y: number, key: string, resizeWorld: boolean, tileWidth: number, tileHeight: number): Phaser.Tilemap;
        renderTexture(key: string, width: number, height: number): Phaser.RenderTexture;
    }

    class Sprite {
        constructor(game: Phaser.Game, x?: number, y?: number, key?: string, frame?: number);
        game: Phaser.Game;
        exists: boolean;
        alive: boolean;
        group: Phaser.Group;
        name: string;
        type: number;
        renderOrderID: number;
        lifespan: number;
        events: Phaser.Events;
        animations: Phaser.AnimationManager;
        input: Phaser.InputHandler;
        key: string;
        currentFrame: number;
        anchor: Phaser.Point;
        x: number;
        y: number;
        cameraOffset:Phaser.Point;
        position: Phaser.Point;
        autoCull: boolean;
        scale: Phaser.Point;
        scrollFactor: Phaser.Point;
        offset: Phaser.Point;
        center: Phaser.Point;
        topLeft: Phaser.Point;
        topRight: Phaser.Point;
        bottomRight: Phaser.Point;
        bottomLeft: Phaser.Point;
        bounds: Phaser.Rectangle;
        body: Phaser.Physics.Arcade.Body;
        inWorld: boolean;
        inWorldThreshold: number;
        angle: number;
        frame: number;
        frameName: string;
        inCamera: boolean;
        crop: Phaser.Rectangle;
        cropEnabled: boolean;
        inputEnabled: boolean;
        fixedToCamera:boolean;
        preUpdate(): void;
        postUpdate(): void;
        centerOn(x: number, y: number): void;
        revive(): void;
        kill(): void;
        reset(x: number, y: number): void;
        updateBounds(): void;
        getLocalPosition(p: Phaser.Point, x: number, y: number): Phaser.Point;
        getLocalUnmodifiedPosition(p: Phaser.Point, x: number, y: number): Phaser.Point;
        bringToTop(): void;
        getBounds(rect: Phaser.Rectangle): Phaser.Rectangle;
        alpha: number;
        visible: boolean;
        renderable: boolean;
        width: number;
        health: number;
        damage(amount: number): Phaser.Sprite;
    }

    class Events {
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

    class TileSprite extends Sprite {
        constructor(game: Phaser.Game, x: number, y: number, width: number, height: number, key?: string, frame?: number);
        texture: Phaser.RenderTexture;
        type: number;
        tileScale: Phaser.Point;
        tilePosition: Phaser.Point;
    }

    class Text {
        constructor(game: Phaser.Game, x: number, y: number, text: string, style: any);
        exists: boolean;
        alive: boolean;
        group: Phaser.Group;
        content: string;
        name: string;
        game: Phaser.Game;
        type: number;
        text: string;
        angle: number;
        style: any;
        visible: boolean;
        position: Phaser.Point;
        anchor: Phaser.Point;
        scale: Phaser.Point;
        scrollFactor: Phaser.Point;
        renderable: boolean;
        update(): void;
    }

    class BitmapText extends Phaser.Text {
    }

    class Button {
        constructor(game: Phaser.Game, x: number, y: number, key: string, callback: Function, overFrame: number, outFrame: number, downFrame: number);
        input: Phaser.InputHandler;
        onInputUp: Phaser.Signal;
        onInputDown: Phaser.Signal;
        onInputOut: Phaser.Signal;
        onInputOver: Phaser.Signal;
        events: Phaser.Event[];
        setFrames(overFrame?: number, outFrame?: number, downFrame?: number): void;
        onInputOverHandler(pointer: Phaser.Pointer): void;
        onInputUpHandler(pointer: Phaser.Pointer): void;
        onInputDownHandler(pointer: Phaser.Pointer): void;
        onInputOutHandler(pointer: Phaser.Pointer): void;
    }


    // Actually extends PIXI.Graphics but we skip the abstraction here, since pixi is "part" of phaser
    // PIXI.Graphics extends PIXI.DisplayObjectContainer extends DisplayObject
    class Graphics extends Phaser.Sprite {
        constructor(game: Phaser.Game, x: number, y: number);
        angle: number;
        x:number;
        y:number;

        // Pixi drawing
        lineStyle(lineWidth:number, color?:number, alpha?:number): void;
        moveTo(x:number, y:number): void;
        lineTo(x:number, y:number): void;
        beginFill(color:number, alpha?:number): void;
        endFill(): void;
        drawRect( x:number, y:number, width:number, height:number ): void;
        drawCircle( x:number, y:number, radius:number): void;
        drawElipse( x:number, y:number, width:number, height:number): void;
        clear(): void;
        updateFilterBounds(): void;
    }

    class RenderTexture {
        constructor(game: Phaser.Game, key: string, width: number, height: number);
        name: string;
        type: number;
    }

    class Canvas {
        create(width: number, height: number): HTMLCanvasElement;
        getOffset(element: HTMLElement, point?: Phaser.Point): Phaser.Point;
        getAspectRatio(canvas: HTMLCanvasElement): number;
        setBackgroundColor(canvas: HTMLCanvasElement, color: string): HTMLCanvasElement;
        setTouchAction(canvas: HTMLCanvasElement, value: string): HTMLCanvasElement;
        addToDOM(canvas: HTMLCanvasElement, parent: string, overflowHidden: boolean): HTMLCanvasElement;
        setTransform(context: CanvasRenderingContext2D, translateX: number, translateY: number, scaleX: number, scaleY: number, skewX: number, skewY: number): CanvasRenderingContext2D;
        setSmoothingEnabled(context: CanvasRenderingContext2D, value: boolean): CanvasRenderingContext2D;
        setImageRenderingCrisp(canvas: HTMLCanvasElement): HTMLCanvasElement;
        setImageRenderingBicubic(canvas: HTMLCanvasElement): HTMLCanvasElement;
    }

    class StageScaleMode {
        constructor(game: Phaser.Game, width: number, height: number);
        static EXACT_FIT: number;
        static NO_SCALE: number;
        static SHOW_ALL: number;
        forceLandscape: boolean;
        forcePortrait: boolean;
        incorrectOrientation: boolean;
        pageAlignHorizontally: boolean;
        pageAlignVertically: boolean;
        minWidth: number;
        maxWidth: number;
        minHeight: number;
        maxHeight: number;
        width: number;
        height: number;
        maxIterations: number;
        game: Phaser.Game;
        enterLandscape: Phaser.Signal;
        enterPortrait: Phaser.Signal;
        orientation: number;
        scaleFactor: Phaser.Point;
        aspectRatio: number;
        isFullScreen: boolean;
        isPortrait: boolean;
        isLandscape: boolean;
        startFullScreen(): void;
        stopFullScreen(): void;
        checkOrientationState(): void;
        checkOrientation(): void;
        checkResize(event: any): void;
        refresh(): void;
        setScreenSize(force: boolean): void;
        setSize(): void;
        setMaximum(): void;
        setShowAll(): void;
        setExactFit(): void;
    }

    class Device {
        patchAndroidClearRect: boolean;
        desktop: boolean;
        iOS: boolean;
        android: boolean;
        chromeOS: boolean;
        linux: boolean;
        macOS: boolean;
        windows: boolean;
        canvas: boolean;
        file: boolean;
        fileSystem: boolean;
        localStorage: boolean;
        webGL: boolean;
        worker: boolean;
        touch: boolean;
        mspointer: boolean;
        css3D: boolean;
        pointerLock: boolean;
        arora: boolean;
        chrome: boolean;
        epiphany: boolean;
        firefox: boolean;
        ie: boolean;
        ieVersion: number;
        mobileSafari: boolean;
        midori: boolean;
        opera: boolean;
        safari: boolean;
        webApp: boolean;
        audioData: boolean;
        webAudio: boolean;
        ogg: boolean;
        opus: boolean;
        mp3: boolean;
        wav: boolean;
        m4a: boolean;
        webm: boolean;
        iPhone: boolean;
        iPhone4: boolean;
        iPad: boolean;
        pixelRatio: number;
        canPlayAudio(type: string): boolean;
        isConsoleOpen(): boolean;
    }

    class RequestAnimationFrame {
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        isRunning: boolean;
        start(): boolean;
        updateRAF(time: number): void;
        updateSetTimeout(): void;
        stop(): void;
        isSetTimeOut(): boolean;
        isRAF(): boolean;
    }

    class RandomDataGenerator {
        constructor(seeds: Array<number>);
        c: number;
        s0: number;
        s1: number;
        s2: number;
        rnd(): number;
        sow(seeds: Array<any>): void;
        hash(data: any): number;
        integer(): number;
        frac(): number;
        real(): number;
        integerInRange(min: number, max: number): number;
        realInRange(min: number, max: number): number;
        normal(): number;
        uuid(): number;
        pick(ary: number[]): number;
        weightedPick(ary: number[]): number;
        timestamp(a?: number, b?: number): number;
        angle(): number;
    }

    class Math {
        static PI2: number;
        static fuzzyEqual(a: number, b: number, epsilon?: number): boolean;
        static fuzzyLessThan(a: number, b: number, epsilon?: number): boolean;
        static fuzzyGreaterThan(a: number, b: number, epsilon?: number): boolean;
        static fuzzyCeil(a: number, b: number, epsilon?: number): boolean;
        static fuzzyFloor(a: number, b: number, epsilon?: number): boolean;
        static average(...numbers: number[]): number;
        static truncate(n: number): number;
        static shear(n: number): number;
        static snapTo(input: number, gap: number, start?: number): number;
        static snapToFloor(input: number, gap: number, start?: number): number;
        static snapToCeil(input: number, gap: number, start?: number): number;
        static snapToInArray(input: number, arr: number[], sort?: boolean): number;
        static roundTo(value: number, place?: number, base?: number): number;
        static floorTo(value: number, place?: number, base?: number): number;
        static ceilTo(value: number, place?: number, base?: number): number;
        static interpolateFloat(a: number, b: number, weight: number): number;
        static angleBetween(x1: number, y1: number, x2: number, y2: number): number;
        static normalizeAngle(angle: number, radians?: boolean): number;
        static nearestAngleBetween(a1: number, a2: number, radians?: boolean): number;
        static interpolateAngles(a1: number, a2: number, weight: number, radians?: boolean, ease?: any): number;
        static chanceRoll(chance?: number): boolean;
        static numberArray(min: number, max: number): number[];
        static maxAdd(value: number, amount: number, max: number): number;
        static minSub(value: number, amount: number, min: number): number;
        static wrap(value: number, min: number, max: number): number;
        static wrapValue(value: number, amount: number, max: number): number;
        static randomSign(): number;
        static isOdd(n: number): boolean;
        static isEven(n: number): boolean;
        static max(...numbers: number[]): number;
        static min(...numbers: number[]): number;
        static wrapAngle(angle: number): number;
        static angleLimit(angle: number, min: number, max: number): number;
        static linearInterpolation(v: number[], k: number): number;
        static bezierInterpolation(v: number[], k: number): number;
        static catmullRomInterpolation(v: number[], k: number): number;
        static linear(p0: number, p1: number, t: number): number;
        static bernstein(n: number, i: number): number;
        static catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number;
        static difference(a: number, b: number): number;
        static getRandom(objects: Object[], startIndex?: number, length?: number): Object;
        static floor(value: number): number;
        static ceil(value: number): number;
        static sinCosGenerator(length: number, sinAmplitude?: number, cosAmplitude?: number, frequency?: number): { sin: number[]; cos: number[]; };
        static shift(stack: Array<any>): any;
        static shuffleArray(array: Array<any>): Array<any>;
        static distance(x1: number, y1: number, x2: number, y2: number): number;
        static distanceRounded(x1: number, y1: number, x2: number, y2: number): number;
        static clamp(x: number, a: number, b: number): number;
        static clampBottom(x: number, a: number): number;
        static mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number;
        static smoothstep(x: number, min: number, max: number): number;
        static smootherstep(x: number, min: number, max: number): number;
        static sign(x: number): number;
        static degToRad(degrees: number): number;
        static radToDeg(radians: number): number;
    }

    class QuadTree {
        constructor(physicsManager: Phaser.Physics.Arcade, x: number, y: number, width: number, height: number, maxObject?: number, maxLevels?: number, level?: number);
        physicsManager: Phaser.Physics.Arcade;
        ID: number;
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
        split(): void;
        insert(body: Object): void;
        getIndex(rect: Object): number;
        retrieve(sprite: Object): Array<any>;
        clear(): void;
    }

    class Circle {
        constructor(x?: number, y?: number, diameter?: number);
        x: number;
        y: number;
        diameter: number;
        radius: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
        area: number;
        empty: boolean;
        circumference(): number;
        setTo(x: number, y: number, diameter: number): Circle;
        copyFrom(source: any): Circle;
        copyTo(dest: Object): Object;
        distance(dest: Object, round: boolean): number;
        clone(out: Phaser.Circle): Phaser.Circle;
        contains(x: number, y: number): Phaser.Circle;
        circumferencePoint(angle: number, asDegrees: number, output?: Phaser.Point): Phaser.Point;
        offset(dx: number, dy: number): Phaser.Circle;
        offsetPoint(point: Phaser.Point): Phaser.Circle;
        toString(): string;
        static contains(a: Phaser.Circle, x: number, y: number): boolean;
        static equals(a: Phaser.Circle, b: Phaser.Circle): boolean;
        static intersects(a: Phaser.Circle, b: Phaser.Circle): boolean;
        static circumferencePoint(a: Phaser.Circle, angle: number, asDegrees: boolean, output?: Phaser.Point): Phaser.Point;
        static intersectsRectangle(c: Phaser.Circle, r: Phaser.Rectangle): boolean;
    }

    class Point {
        constructor(x: number, y: number);
        x: number;
        y: number;
        copyFrom(source: any): Phaser.Point;
        invert(): Phaser.Point;
        setTo(x: number, y: number): Phaser.Point;
        add(x: number, y: number): Phaser.Point;
        subtract(x: number, y: number): Phaser.Point;
        multiply(x: number, y: number): Phaser.Point;
        divide(x: number, y: number): Phaser.Point;
        clampX(min: number, max: number): Phaser.Point;
        clampY(min: number, max: number): Phaser.Point;
        clamp(min: number, max: number): Phaser.Point;
        clone(output: Phaser.Point): Phaser.Point;
        copyTo(dest: any): Object;
        distance(dest: Object, round?: boolean): number;
        equals(a: Phaser.Point): boolean;
        rotate(x: number, y: number, angle: number, asDegrees: boolean, distance: number): Phaser.Point;
        toString(): string;
        static add(a: Phaser.Point, b: Phaser.Point, out?: Phaser.Point): Phaser.Point;
        static subtract(a: Phaser.Point, b: Phaser.Point, out?: Phaser.Point): Phaser.Point;
        static multiply(a: Phaser.Point, b: Phaser.Point, out?: Phaser.Point): Phaser.Point;
        static divide(a: Phaser.Point, b: Phaser.Point, out?: Phaser.Point): Phaser.Point;
        static equals(a: Phaser.Point, b: Phaser.Point): boolean;
        static distance(a: Phaser.Point, b: Phaser.Point, round?: boolean): number;
        static rotate(a: Phaser.Point, x: number, y: number, angle: number, asDegrees: boolean, distance: boolean): Phaser.Point;
    }

    class Rectangle {
        constructor(x: number, y: number, width: number, height: number);
        x: number;
        y: number;
        width: number;
        height: number;
        halfWidth: number;
        halfHeight: number;
        bottom: number;
        bottomRight: Phaser.Point;
        left: number;
        right: number;
        volume: number;
        perimeter: number;
        centerX: number;
        centerY: number;
        top: number;
        topLeft: Phaser.Point;
        empty: boolean;
        offset(dx: number, dy: number): Phaser.Rectangle;
        offsetPoint(point: Phaser.Point): Phaser.Rectangle;
        setTo(x: number, y: number, width: number, height: number): Phaser.Rectangle;
        floor(): void;
        copyFrom(source: any): Phaser.Rectangle;
        copyTo(dest: any): Object;
        inflate(dx: number, dy: number): Phaser.Rectangle;
        size(output: Phaser.Point): Phaser.Point;
        clone(output: Phaser.Rectangle): Phaser.Rectangle;
        contains(x: number, y: number): boolean;
        containsRect(b: Phaser.Rectangle): boolean;
        equals(b: Phaser.Rectangle): boolean;
        intersection(b: Phaser.Rectangle, out: Phaser.Rectangle): Phaser.Rectangle;
        intersects(b: Phaser.Rectangle, tolerance: number): boolean;
        intersectsRaw(left: number, right: number, top: number, bottom: number, tolerance: number): boolean;
        union(b: Phaser.Rectangle, out: Phaser.Rectangle): Phaser.Rectangle;
        toString(): string;
        static inflate(a: Phaser.Rectangle, dx: number, dy: number): Phaser.Rectangle;
        static inflatePoint(a: Phaser.Rectangle, point: Phaser.Point): Phaser.Rectangle;
        static size(a: Phaser.Rectangle, output: Phaser.Point): Phaser.Point;
        static clone(a: Phaser.Rectangle, output: Phaser.Rectangle): Phaser.Rectangle;
        static contains(a: Phaser.Rectangle, x: number, y: number): boolean;
        static containsPoint(a: Phaser.Rectangle, point: Phaser.Point): boolean;
        static containsRect(a: Phaser.Rectangle, b: Phaser.Rectangle): boolean;
        static equals(a: Phaser.Rectangle, b: Phaser.Rectangle): boolean;
        static intersection(a: Phaser.Rectangle, b: Phaser.Rectangle, out: Phaser.Rectangle): Phaser.Rectangle;
        static intersects(a: Phaser.Rectangle, b: Phaser.Rectangle, tolerance: number): boolean;
        static intersectsRaw(a: Phaser.Rectangle, left: number, right: number, top: number, bottom: number, tolerance: number): boolean;
        static union(a: Phaser.Rectangle, b: Phaser.Rectangle, out: Phaser.Rectangle): Phaser.Rectangle;
    }

    class Net {
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        getHostName(): string;
        checkDomainName(domain: string): string;
        updateQueryString(key: string, value: any, redirect?: boolean, url?: string): string;
        getQueryString(parameter?: string): string;
        decodeURI(value: string): string;
    }

    class TweenManager {
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        REVISION: string;
        getAll(): Phaser.Tween[];
        removeAll(): void;
        add(tween: Phaser.Tween): Phaser.Tween;
        create(object: Object): Phaser.Tween;
        remove(tween: Phaser.Tween): void;
        update(): boolean;
        pauseAll(): void;
        resumeAll(): void;
    }

    class Tween {
        constructor(object: Object, game: Phaser.Game);
        game: Phaser.Game;
        pending: boolean;
        pendingDelete: boolean;
        onStart: Phaser.Signal;
        onComplete: Phaser.Signal;
        isRunning: boolean;
        to(properties: Object, duration?: number, ease?: any, autoStart?: boolean, delay?: number, loop?: boolean): Phaser.Tween;
        start(time: number): Phaser.Tween;
        stop(): Phaser.Tween;
        delay(amount: number): Phaser.Tween;
        repeat(times: number): Phaser.Tween;
        yoyo(yoyo: boolean): Phaser.Tween;
        easing(easing: any): Phaser.Tween;
        interpolation(interpolation: Function): Phaser.Tween;
        chain(...tweens: Phaser.Tween[]): Phaser.Tween;
        loop(): Phaser.Tween;
        onStartCallback(callback: Function): Phaser.Tween;
        onUpdateCallback(callback: Function): Phaser.Tween;
        onCompleteCallback(callback: Function): Phaser.Tween;
        pause(): void;
        resume(): void;
        update(time: number): boolean;
    }

    module Easing {

        class Linear {
            static None(k: number): number;
        }

        class Quadratic {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

        class Cubic {
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

        class Exponential {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

        class Circular {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

        class Elastic {
            static In(k: number): number;
            static Out(k: number): number;
            static InOut(k: number): number;
        }

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

    }

    class Time {
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        physicsElapsed: number;
        time: number;
        pausedTime: number;
        now: number;
        elapsed: number;
        fps: number;
        fpsMin: number;
        fpsMax: number;
        msMin: number;
        msMax: number;
        frames: number;
        pauseDuration: number;
        timeToCall: number;
        lastTime: number;
        events: Phaser.Timer;
        create(autoDestroy: boolean): Phaser.Timer;
        removeAll(): void;
        update(time: number): void;
        gamePaused(): void;
        gameResumed(): void;
        totalElapsedSeconds(): number;
        elapsedSince(since: number): number;
        elapsedSecondsSince(since: number): number;
        reset(): void;
    }

    class Timer {
        constructor(game: Phaser.Game, autoDestroy: boolean);
        game: Phaser.Game;
        running: boolean;
        autoDestroy: boolean;
        expired: boolean;
        events: Phaser.TimerEvent[];
        onComplete: Phaser.Signal;
        nextTick: number;
        paused: boolean;
        static MINUTE: number;
        static SECOND: number;
        static HALF: number;
        static QUARTER: number;
        add(delay: number, callback: any, callbackContext: any, ...args: any[]): Phaser.TimerEvent;
        repeat(delay: number, repeatCount: number, callback: any, callbackContext: any, ...args: any[]): Phaser.TimerEvent;
        loop(delay: number, callback: any, callbackContext: any, ...args: any[]): Phaser.TimerEvent;
        start(): void;
        stop(): void;
        remove(event: Phaser.TimerEvent): boolean;
        order():void;
        sortHandler():number;
        update(time: number): boolean;
        pause(): void;
        resume(): void;
        destroy(): void;
        next: number;
        duration: number;
        length: number;
        ms: number;
        seconds: number;
    }

    class TimerEvent {
        constructor(timer: Phaser.Timer, delay: number, tick: number, repeatCount: number, loop: boolean, callback: any, callbackContext, any, args:any[]);
        timer: Phaser.Timer;
        delay: number;
        tick: number;
        repeatCount: number;
        loop: boolean;
        callback: any;
        callbackContext: any;
        args: any[];
    }

    class AnimationManager {
        constructor(sprite);
        sprite: Phaser.Sprite;
        game: Phaser.Game;
        currentFrame: Phaser.Frame;
        updateIfVisible: boolean;
        frameData: Phaser.FrameData;
        frameTotal: number;
        frame: number;
        frameName: string;
        loadFrameData(frameData: Phaser.FrameData): void;
        add(name: string, frames?: Array<any>, frameRate?: number, loop?: boolean, useNumericIndex?: boolean): Phaser.Animation;
        validateFrames(frames: Array<any>, useNumericIndex?: boolean): boolean;
        play(name: string, frameRate?: number, loop?: boolean): Phaser.Animation;
        stop(name?: string, resetFrame?: boolean): void;
        update(): boolean;
        destroy(): void;
    }

    class Animation {
        constructor(game: Phaser.Game, parent: Phaser.Sprite, name: string, frameData: Phaser.FrameData, frames: any[], delay: number, looped: boolean);
        game: Phaser.Game;
        name: string;
        delay: number;
        looped: boolean;
        isFinished: boolean;
        isPlaying: boolean;
        currentFrame: Phaser.Frame;
        frameTotal: number;
        frame: number;
        play(frameRate?: number, loop?: boolean): Phaser.Animation;
        restart(): void;
        stop(resetFrame?: boolean): void;
        update(): boolean;
        destroy(): void;
        onComplete(): void;
    }

    class Frame {
        constructor(index: number, x: number, y: number, width: number, height: number, name: string, uuid: string);
        index: number;
        x: number;
        y: number;
        width: number;
        height: number;
        centerX: number;
        centerY: number;
        distance: number;
        name: string;
        uuid: string;
        rotated: boolean;
        rotationDirection: string;
        trimmed: boolean;
        sourceSizeW: number;
        sourceSizeH: number;
        spriteSourceSizeX: number;
        spriteSourceSizeY: number;
        spriteSourceSizeW: number;
        spriteSourcesizeH: number;
        setTrim(trimmed: boolean, actualWidth: number, actualHeight: number, destX: number, destY: number, destWidth: number, destHeight: number): void;
    }

    class FrameData {
        addFrame(frame: Frame): Frame;
        getFrame(index: number): Frame;
        getFrameByName(name: string): Frame;
        checkFrame(name: string): boolean;
        getFrameRange(start: number, end: number, output: Array<Frame>): Array<Frame>;
        getFrames(frames: Array<number>, useNumericIndex?: boolean, output?: Array<Frame>): Array<Frame>;
        getFrameIndexes(frames: Array<number>, useNumericIndex?: boolean, output?: Array<number>): Array<number>;
        total: number;
    }

    class AnimationParser {
        spriteSheet(game: Phaser.Game, key: string, frameWidth: number, frameHeight: number, frameMax?: number): Phaser.FrameData;
        JSONData(game: Phaser.Game, json: Object, cacheKey: string): Phaser.FrameData;
        JSONDataHash(game: Phaser.Game, json: Object, cacheKey: string): Phaser.FrameData;
        XMLData(game: Phaser.Game, xml: Object, cacheKey: string): Phaser.FrameData;
    }

    class Cache {
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        onSoundUnlock: Phaser.Signal;
        addCanvas(key: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void;
        addRenderTexture(key: string, texture: RenderTexture): void;
        addSpriteSheet(key: string, url: string, data: Object, frameWidth: number, frameHeight: number, frameMax: number): void;
        addTilemap(key: string, url: string, data: Object, mapData: Object, atlasData: Object): void;
        addTextureAtlas(key: string, url: string, data: Object, atlasData: Object): void;
        addBitmapFont(key: string, url: string, data: Object, xmlData: Object): void;
        addDefaultImage(): void;
        addImage(key: string, url: string, data: Object): void;
        addSound(key: string, url: string, data: Object): void;
        reloadSound(key: string): void;
        reloadSoundComplete(key: string): void;
        updateSound(key: string, property: string, value: Phaser.Sound): void;
        decodedSound(key: string, data: Object): void;
        addText(key: string, url: string, data: Object): void;
        getCanvas(key: string): Object;
        checkImageKey(key: string): boolean;
        getImage(key: string): Object;
        getTilemap(key: string): Phaser.Tilemap;
        getFrameData(key: string): Phaser.FrameData;
        getFrameByIndex(key: string, frame: string): Phaser.Frame;
        getFrameByName(key: string, frame: string): Phaser.Frame;
        getFrame(key: string): Phaser.Frame;
        getTextureFrame(key: string): Phaser.Frame;
        getTexture(key: string): Phaser.RenderTexture;
        getSound(key: string): Phaser.Sound;
        getSoundData(key: string): Object;
        isSoundDecoded(key: string): boolean;
        isSoundReady(key: string): boolean;
        isSpriteSheet(key: string): boolean;
        getText(key: string): Object;
        getKeys(array: Array<string>): Array<string>;
        getImageKeys(): string[];
        getSoundKeys(): string[];
        getTextKeys(): string[];
        removeCanvas(key: string): void;
        removeImage(key: string): void;
        removeSound(key: string): void;
        removeText(key: string): void;
        destroy(): void;
    }

    class Loader {
        static TEXTURE_ATLAS_JSON_ARRAY: number;
        static TEXTURE_ATLAS_JSON_HASH: number;
        static TEXTURE_ATLAS_XML_STARLING: number;
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        queueSize: number;
        isLoading: boolean;
        hasLoaded: boolean;
        progress: number;
        preloadSprite: Phaser.Sprite;
        crossOrigin: string;
        baseURL: string;
        onFileComplete: Phaser.Signal;
        onFileError: Phaser.Signal;
        onLoadStart: Phaser.Signal;
        onLoadComplete: Phaser.Signal;
        setPreloadSprite(sprite: Phaser.Sprite, direction?: number): void;
        checkKeyExists(type: string, key: string): boolean;
        reset(): void;
        addToFileList(type: string, key: string, url: string, properties: Array<any>): void;
        image(key: string, url: string, overwrite?: boolean): void;
        text(key: string, url: string, overwrite?: boolean): void;
        spritesheet(key: string, url: string, frameWidth: number, frameHeight: number, frameMax: number): void;
        audio(key: string, urls: any, autoDecode?: boolean): void;
        tilemap(key: string, tilesetURL: string, mapDataURL?: string, mapData?: Object, format?: string): void;
        tileset(key: string, url: string, tileWidth: number, tileHeight: number, tileMargin?: number, tileSpacing?: number, rows?: number, columns?: number, limit?: number): void;
        bitmapFont(key: string, textureURL: string, xmlURL?: string, xmlData?: Object): void;
        atlasJSONArray(key: string, textureURL: string, atlasURL: string, atlasData: Object): void;
        atlasJSONHash(key: string, textureURL: string, atlasURL: string, atlasData: Object): void;
        atlasXML(key: string, textureURL: string, atlasURL: string, atlasData: Object): void;
        atlas(key: string, textureURL: string, atlasURL?: string, atlasData?: Object, format?: number): void;
        removeFile(key: string): void;
        removeAll(): void;
        start(): void;
        loadFile(): void;
        getAudioURL(urls: string[]): string;
        fileError(key: string): void;
        fileComplete(key: string): void;
        jsonLoadComplete(key: string): void;
        csvLoadComplete(key: string): void;
        dataLoadError(key: string): void;
        xmlLoadComplete(key: string): void;
        nextFile(previousKey: string, success: boolean): void;
    }

    class LoaderParser {
        bitmapFont(game: Phaser.Game, xml: Object, cacheKey: Phaser.FrameData): void;
    }

    class Sound {
        constructor(game: Phaser.Game, key: string, volume?: number, loop?: boolean);
        game: Phaser.Game;
        name: string;
        key: string;
        loop: boolean;
        markers: Object;
        context: any;
        autoplay: boolean;
        totalDuration: number;
        startTime: number;
        currentTime: number;
        duration: number;
        stopTime: number;
        paused: boolean;
        isPlaying: boolean;
        currentMarker: string;
        pendingPlayback: boolean;
        override: boolean;
        usingWebAudio: boolean;
        usingAudioTag: boolean;
        onDecoded: Phaser.Signal;
        onPlay: Phaser.Signal;
        onPause: Phaser.Signal;
        onResume: Phaser.Signal;
        onLoop: Phaser.Signal;
        onStop: Phaser.Signal;
        onMute: Phaser.Signal;
        isDecoded: boolean;
        isDecoding: boolean;
        mute: boolean;
        volume: number;
        onMarkerComplete: Phaser.Signal;
        soundHasUnlocked(key: string): void;
        addMarker(name: string, start: number, stop: number, volume?: number, loop?: boolean): void;
        removeMarker(name: string): void;
        update(): void;
        play(marker?: string, position?: number, volume?: number, loop?: boolean): Phaser.Sound;
        restart(marker: string, position: number, volume?: number, loop?: boolean): void;
        pause(): void;
        resume(): void;
        stop(): void;
    }

    class SoundManager {
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        onSoundDecode: Phaser.Signal;
        context: any;
        usingWebAudio: boolean;
        usingAudioTag: boolean;
        noAudio: boolean;
        touchLocked: boolean;
        channels: number;
        mute: boolean;
        volume: number;
        boot(): void;
        unlock(): void;
        stopAll(): void;
        pauseAll(): void;
        resumeAll(): void;
        decode(key: string, sound?: Phaser.Sound): void;
        update(): void;
        add(key: string, volume: number, loop: boolean): Phaser.Sound;
    }

    module Utils {
        class Debug {
            constructor(game: Phaser.Game);
            game: Phaser.Game;
            font: string;
            lineHeight: number;
            renderShadow: boolean;
            currentX: number;
            currentY: number;
            currentAlpha: number;
            start(x?: number, y?: number, color?: string): void;
            stop(): void;
            line(text: string, x: number, y: number): void;
            renderQuadTree(quadtree: Phaser.QuadTree, color?: string): void;
            renderSpriteCorners(sprite: Phaser.Sprite, showText?: boolean, showBounds?: boolean, color?: string): void;
            renderSoundInfo(sound: Phaser.Sound, x: number, y: number, color?: string): void;
            renderCameraInfo(camera: Phaser.Camera, x: number, y: number, color?: string): void;
            renderPointer(pointer: Phaser.Pointer, hideIfUp?: boolean, downColor?: string, upColor?: string, color?: string): void;
            renderSpriteInputInfo(sprite: Phaser.Sprite, x: number, y: number, color?: string): void;
            renderSpriteCollision(sprite: Phaser.Sprite, x: number, y: number, color?: string): void;
            renderInputInfo(x: number, y: number, color?: string): void;
            renderSpriteInfo(sprite: Phaser.Sprite, x: number, y: number, color?: string): void;
            renderWorldTransformInfo(sprite: Phaser.Sprite, x: number, y: number, color?: string): void;
            renderLocalTransformInfo(sprite: Phaser.Sprite, x: number, y: number, color?: string): void;
            renderPointInfo(point: Phaser.Point, x: number, y: number, color?: string): void;
            renderSpriteBody(sprite: Phaser.Sprite, color?: string): void;
            renderSpriteBounds(sprite: Phaser.Sprite, color?: string, fill?: boolean): void;
            renderPixel(x: number, y: number, fillStyle?: string): void;
            renderPoint(point: Phaser.Point, fillStyle?: string): void;
            renderRectangle(rect: Phaser.Rectangle, fillStyle?: string): void;
            renderCircle(circle: Phaser.Circle, fillStyle?: string): void;
            renderText(text: string, x: number, y: number, color?: string, font?: string): void;
        }
    }

    class Color {
        getColor32(alpha: number, red: number, green: number, blue: number): number;
        getColor(red: number, green: number, blue: number): number;
        hexToRGB(h: string): number;
        getColorInfo(color: number): string;
        RGBtoHexstring(color: number): string;
        RGBtoWebstring(color: number): string;
        colorToHexstring(color: number): string;
        interpolateColor(color1: number, color2: number, steps: number, currentStep: number, alpha: number): number;
        interpolateColorWithRGB(color: number, r: number, g: number, b: number, steps: number, currentStep: number): number;
        interpolateRGB(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, steps: number, currentStep: number): number;
        getRandomColor(min?: number, max?: number, alpha?: number): number;
        getRGB(color: number): Object;
        getWebRGB(color: number): string;
        getAlpha(color: number): number;
        getAlphaFloat(color: number): number;
        getRed(color: number): number;
        getGreen(color: number): number;
        getBlue(color: number): number;
    }

    module Physics {
        class Arcade {
            constructor(game: Phaser.Game)
            game: Phaser.Game;
            gravity: Phaser.Point;
            bounds: Phaser.Rectangle;
            maxObjects: number;
            maxLevels: number;
            OVERLAP_BIAS: number;
            TILE_OVERLAP: number;
            quadTree: Phaser.QuadTree;
            quadTreeID: number;
            updateMotion(body: Phaser.Physics.Arcade.Body);
            computeVelocity(axis: number, body: Phaser.Physics.Arcade.Body, velocity: number, acceleration: number, drag: number, max: number): void;
            preUpdate(): void;
            postUpdate(): void;
            overlap(object1: any, object2: any, overlapCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
            overlapSpriteVsSprite(sprite1: Phaser.Sprite, sprite2: Phaser.Sprite,  overlapCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
            overlapSpriteVsGroup(sprite1: Phaser.Sprite, group: Phaser.Group,  overlapCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
            overlapGroupVsGroup(group: Phaser.Group, group2: Phaser.Group,  overlapCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
            collide(object1: any, object2: any, collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
            collideSpriteVsSprite(sprite1: Phaser.Sprite, sprite2: Phaser.Sprite,  collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
            collideSpriteVsTilemap(sprite1: Phaser.Sprite, tilemap: Phaser.Tilemap,  collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
            collideSpriteVsGroup(sprite1: Phaser.Sprite, group: Phaser.Group,  collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
            collideGroupVsTilemap(group: Phaser.Group, tilemap: Phaser.Tilemap,  collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
            collideGroupVsGroup(group: Phaser.Group, group2: Phaser.Group,  collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
            separate(body: Phaser.Physics.Arcade.Body, body2: Phaser.Physics.Arcade.Body): void;
            separateX(body: Phaser.Physics.Arcade.Body, body2: Phaser.Physics.Arcade.Body): void;
            separateY(body: Phaser.Physics.Arcade.Body, body2: Phaser.Physics.Arcade.Body): void;
            separateTile(object: Object, x: number, y: number, width: number, height: number, mass: number, collideLeft: boolean, collideRight: boolean, collideUp: boolean, collideDown: boolean, separateX: boolean, separateY: boolean): boolean;
            separateTileX(object: Object, x: number, y: number, width: number, height: number, mass: number, collideLeft: boolean, collideRight: boolean, collideUp: boolean, collideDown: boolean, separateX: boolean, separateY: boolean): boolean;
            separateTileY(object: Object, x: number, y: number, width: number, height: number, mass: number, collideLeft: boolean, collideRight: boolean, collideUp: boolean, collideDown: boolean, separateX: boolean, separateY: boolean): boolean;
            velocityFromAngle(angle: number, speed?: number, point?: Phaser.Point): Phaser.Point;
            moveToObject(source: Phaser.Sprite, dest: Phaser.Sprite, speed?: number, maxTime?: number): void;
            accelerateTowardsObject(source: Phaser.Sprite, dest: Phaser.Sprite, speed?: number, xSpeedMax?: number, ySpeedMax?: number): void;
            moveToMouse(source: Phaser.Sprite, speed?: number, maxTime?: number): void;
            accelerateTowardsMouse(source: Phaser.Sprite, speed: number, xSpeedMax?: number, ySpeedMax?: number): void;
            moveToPoint(source: Phaser.Sprite, target: Phaser.Point, speed?: number, maxTime?: number): void;
            accelerateTowardsPoint(source: Phaser.Sprite, target: Phaser.Point, speed: number, xSpeedMax?: number, ySpeedMax?: number): void;
            distanceBetween(a: Phaser.Sprite, b: Phaser.Sprite): number;
            distanceToPoint(a: Phaser.Sprite, target: Phaser.Point): number;
            distanceToMouse(a: Phaser.Sprite): number;
            angleBetweenPoint(a: Phaser.Sprite, target: Phaser.Point, asDegrees?: boolean): number;
            angleBetween(a: Phaser.Sprite, b: Phaser.Sprite, asDegrees?: boolean): number;
            velocityFromFacing(parent: Phaser.Sprite, speed: number): Phaser.Point;
            angleBetweenMouse(a: Phaser.Sprite, asDegress?: boolean): number;
        }

        module Arcade {
            class BorderChoices {
                none: boolean;
                any: boolean;
                up: boolean;
                down: boolean;
                left: boolean;
                right: boolean;
            }

            class Body {
                constructor(sprite: Phaser.Sprite);
                sprite: Phaser.Sprite;
                game: Phaser.Game;
                offset: Phaser.Point;
                x: number;
                y: number;
                lastX: number;
                lastY: number;
                sourceWidth: number;
                sourceHeight: number;
                width: number;
                height: number;
                halfWidth: number;
                halfHeight: number;
                velocity: Phaser.Point;
                acceleration: Phaser.Point;
                drag: Phaser.Point;
                gravity: Phaser.Point;
                bounce: Phaser.Point;
                maxVelocity: Phaser.Point;
                angularVelocity: number;
                angularAcceleration: number;
                angularDrag: number;
                maxAngular: number;
                mass: number;
                quadTreeIDs: string[];
                quadTreeIndex: number;
                allowCollision: BorderChoices;
                touching: BorderChoices;
                wasTouching: BorderChoices;
                immovable: boolean;
                moves: boolean;
                rotation: number;
                allowRotation: boolean;
                allowGravity: boolean;
                customSeparateX: boolean;
                customSeparateY: boolean;
                overlapX: number;
                overlapY: number;
                collideWorldBounds: boolean;
                bottom: number;
                right: number;
                updateBounds(centerX: number, centerY: number, scaleX: number, scaleY: number): void;
                update(): void;
                postUpdate(): void;
                checkWorldBounds(): void;
                setSize(width: number, height: number, offsetX: number, offsetY: number): void;
                reset(): void;
                deltaAbsX(): number;
                deltaAbsY(): number;
                deltaX(): number;
                deltaY(): number;
            }
        }
    }

    class Particles {
        constructor(game: Phaser.Game);
        emitters: Object;
        ID: number;
        add(emitter: Phaser.Particles.Arcade.Emitter): Phaser.Particles.Arcade.Emitter;
        remove(emitter: Phaser.Particles.Arcade.Emitter): void;
        update(): void;
    }

    module Particles {
        module Arcade {
            class Emitter extends Phaser.Group
            {
                constructor(game: Phaser.Game, x: number, y: number, maxParticles?: number);
                name: string;
                type: number;
                x: number;
                y: number;
                width: number;
                height: number;
                minParticleSpeed: Phaser.Point;
                maxParticleSpeed: Phaser.Point;
                minParticleScale: number;
                maxParticleScale: number;
                minRotation: number;
                maxRotation: number;
                gravity: number;
                particleClass: string;
                particleDrag: Phaser.Point;
                angularDrag: number;
                frequency: number;
                maxParticles: number;
                lifespan: number;
                bounce: Phaser.Point;
                on: boolean;
                exists: boolean;
                emitX: number;
                emitY: number;
                alpha: number;
                visible: boolean;
                left: number;
                top: number;
                bottom: number;
                right: number;
                update(): void;
                makeParticles(keys: string[], frames: string[], quantity: number, collide: boolean, collideWorldBounds: boolean): Phaser.Particles.Arcade.Emitter;
                kill(): void;
                revive(): void;
                start(explode: boolean, lifespan: number, frequency: number, quantity: number): void;
                emitParticle(): void;
                setSize(width: number, height: number): void;
                setXSpeed(min: number, max: number): void;
                setYSpeed(min: number, max: number): void;
                setRotation(min: number, max: number): void;
                at(object: Object): void;

            }
        }
    }

    class Tilemap {
        constructor(game: Phaser.Game, key: string, x: number, y: number, resizeWorld?: boolean, tileWidth?: number, tileHeight?: number);
        game: Phaser.Game;
        group: Phaser.Group;
        name: string;
        key: string;
        renderOrderID: number;
        collisionCallback: Function;
        exists: boolean;
        visible: boolean;
        tiles: Array<any>;
        layers: Array<TilemapLayer>;
        position: Phaser.Point;
        type: number;
        renderer: Phaser.TilemapRenderer;
        mapFormat: string;
        widthInPixels: number;
        heightInPixels: number;
        static CSV: number;
        static JSON: number;
        parseCSV(data: string, key: string, tileWidth: number, tileHeight: number): void;
        parseTiledJSON(json: string, key: string): void;
        generateTiles(quantity: number): void;
        setCollisionCallback(context: Object, callback: Function): void;
        setCollisionRange(start: number, end: number, collision: number, resetCollisions?: boolean, separateX?: boolean, separateY?: boolean): void;
        setCollisionByIndex(value: number[], collision: number, resetCollisions?: boolean, separateX?: boolean, separateY?: boolean): void;
        getTileByIndex(value: number): Tile;
        getTile(x: number, y: number, layer?: number): Tile;
        getTileFromWorldXY(x: number, y: number, layer?: number): Tile;
        getTileFromInputXY(layer?: number): Tile;
        getTileOverlaps(object: Object): Array<any>;
        collide(objectOrGroup: any, callback: Function, context: Object): boolean;
        collideGameObject(object: Object): boolean;
        putTile(x: number, y: number, index: number, layer?: number): void;
        update(): void;
        destroy(): void;
    }

    class TilemapLayer {
        constructor(game:Phaser.Game, tilemap:Phaser.Tilemap, index:number, width:number, height:number);
        //constructor(parent: Tilemap, id: number, key: string, mapFormat: number, name: string, tileWidth: number, tileHeight: number);
        exists: boolean;
        visible: boolean;
        widthInTiles: number;
        heightInTiles: number;
        widthInPixels: number;
        heightInPixels: number;
        tileMargin: number;
        tileSpacing: number;
        parent: Tilemap;
        game: Phaser.Game;
        ID: number;
        name: string;
        key: string;
        type: number;
        mapFormat: number;
        tileWidth: number;
        tileHeight: number;
        boundsInTiles: Phaser.Rectangle;
        tileset: Object;
        canvas: any;
        context: any;
        baseTexture: any;
        texture: any;
        sprite: Phaser.Sprite;
        mapData: Array<any>;
        alpha: number;
        putTileWorldXY(x: number, y: number, index: number): void;
        putTile(x: number, y: number, index: number): void;
        swapTile(tileA: number, tileB: number, x?: number, y?: number, width?: number, height?: number): void;
        fillTile(index: number, x?: number, y?: number, width?: number, height?: number): void;
        randomiseTiles(tiles: number[], x?: number, y?: number, width?: number, height?: number): void;
        replaceTile(tileA: number, tileB: number, x?: number, y?: number, width?: number, height?: number): void;
        getTileBlock(x: number, y: number, width: number, height: number): Array<Tile>;
        getTileFromWorldXY(x: number, y: number): Tile;
        getTileOverlaps(object: Object): Array<Tile>;
        getTempBlock(x: number, y: number, width: number, height: number, collisionOnly?: boolean): void;
        getTileIndex(x: number, y: number): number;
        addColumn(column: string[]): void;
        createCanvas(): void;
        updateBounds(): void;
        parseTileOffsets(): number;
    }

    class Tile {
        constructor(game: Phaser.Game, tilemap: Tilemap, index: number, width: number, height: number);
        mass: number;
        collideNone: boolean;
        collideLeft: boolean;
        collideRight: boolean;
        collideUp: boolean;
        collideDown: boolean;
        separateX: boolean;
        separateY: boolean;
        game: Phaser.Game;
        tilemap: Tilemap;
        index: number;
        width: number;
        height: number;
        destroy(): void;
        setCollision(left: boolean, right: boolean, up: boolean, down: boolean, reset: boolean, seperateX: boolean, seperateY: boolean): void;
        resetCollsion(): void;
        toString(): string;
    }

    class TilemapRenderer {
        constructor(game: Phaser.Game);
        game: Phaser.Game;
        render(tilemap: Tilemap): void;
    }
}
