declare module Phaser {

      class Camera {
            constructor(game: Game, id: number, x: number, y: number, width: number, height: number);
            game: Game;
            world: World;
            id: number;
            x: number;
            y: number;
            width: number;
            height: number;
            view: Rectangle;
            screenView: Rectangle;
            bounds: Rectangle;
            deadzone: Rectangle;
            visible: boolean;
            atLimit: { x: boolean; y: boolean; };
            target: Sprite;
            private _edge: number;
            static FOLLOW_LOCKON: number;
            static FOLLOW_PLATFORMER: number;
            static FOLLOW_TOPDOWN: number;
            static FOLLOW_TOPDOWN_TIGHT: number;
            follow(target: Sprite, style?: number): void;
            focusOnXY(x: number, y: number): void;
            update(): void;
            checkWorldBounds(): void;
            setPosition(x: number, y: number): void;
            setSize(width: number, height: number): void;
      }

      class State {
            game: Game;
            add: GameObjectFactory;
            camera: Camera;
            cache: Cache;
            input: Input;
            load: Loader;
            stage: Stage;
            math: Math;
            sound: SoundManager;
            time: Time;
            tweens: TweenManager;
            world: World;
            particles: Particles;
            physics: Physics.Arcade;
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
            constructor(game: Game, pendingState: State);
            game: Game;
            states: Object;
            current: State;
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
            add(key: string, state: typeof State, autoStart?: boolean): void;
            remove(key: string): void;
            start(key: string, clearWorld?: boolean, clearCache?: boolean): void;
            dummy(): void;
            checkState(key: string): boolean;
            link(key: string): void;
            setCurrentState(key: string): void;
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
            add(listener: Function, listenerContext?: any, priority?: number): SignalBinding;
            addOnce(listener: Function, listenerContext?: any, priority?: number): SignalBinding;
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
            constructor(signal: Signal, listener: Function, isOnce: boolean, listenerContext: Object, priority?: number);
            context: Object;
            active: boolean;
            params: any[];
            execute(paramsArr?: any[]): void;
            detach(): Function;
            isBound(): boolean;
            isOnce(): boolean;
            getListener(): Function;
            getSignal(): Signal;
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
            constructor(game: Game, parent: any);
            game: Game;
            parent: any;
            active: boolean;
            visible: boolean;
            hasPreUpdate: boolean;
            hasUpdate: boolean;
            hasRender: boolean;
            hasPostRender: boolean;
      }

      class PluginManager extends StateCycle {
            constructor(game: Game, parent: any);
            game: Game;
            private _parent: any;
            plugins: Plugin[];
            add(plugin: Plugin): Plugin;
            remove(plugin: Plugin): void;
      }

      class Stage {
            constructor(game: Game, width: number, height: number);
            game: Game;
            offset: Point;
            canvas: HTMLCanvasElement;
            scaleMode: number;
            scale: StageScaleMode;
            aspectRatio: number;
            backgroundColor: string;
            disableVisibilityChange: boolean;
            boot(): void;
            visibilityChange(event: Event): void;
      }

      class Group {
            constructor(game: Game, parent: any, name: string, useStage: boolean);
            game: Game;
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
            create(x: number, y: number, key: string, frame: string, exists?: boolean): any;
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

      class World {
            constructor(game: Game);
            game: Game;
            bounds: Rectangle;
            camera: Camera;
            currentRenderOrderID: number;
            group: Group;
            width: number;
            height: number;
            centerX: number;
            centerY: number;
            randomX: number;
            randomY: number;
            boot(): void;
            update(): void;
            setSize(width: number, height: number): void;
            destroy(): void;
      }

      class Game {
            constructor(width: number, height: number, renderer: number, parent: string, state: Object, transparent?: boolean, antialias?: boolean);
            id: number;
            width: number;
            height: number;
            renderer: number;
            transparent: boolean;
            antialias: boolean;
            parent: string;
            state: StateManager;
            renderType: number;
            isBooted: boolean;
            raf: RequestAnimationFrame;
            add: GameObjectFactory;
            cache: Cache;
            input: Input;
            load: Loader;
            math: Math;
            sound: SoundManager;
            stage: Stage;
            time: Time;
            tweens: TweenManager;
            world: World;
            physics: Physics.Arcade;
            rnd: RandomDataGenerator;
            device: Device;
            camera: Camera;
            canvas: HTMLCanvasElement;
            context: Object;
            debug: Utils.Debug;
            particles: Particles;
            _paused: boolean;
            paused: boolean;
            boot(): void;
            setUpRenderer(): void;
            loadComplete(): void;
            update(): void;
            destroy(): void;
      }

      class Input {
            constructor(game: Game);
            static MOUSE_OVERRIDES_TOUCH: number;
            static TOUCH_OVERRIDES_MOUSE: number;
            static MOUSE_TOUCH_COMBINE: number;
            id: number;
            active: boolean;
            game: Game;
            hitCanvas: any;
            hitContext: any;
            pollRate: number;
            disabled: boolean;
            multiInputOverride: number;
            position: Point;
            speed: Point;
            circle: Circle;
            scale: Point;
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
            pointer1: Pointer;
            pointer2: Pointer;
            pointer3: Pointer;
            pointer4: Pointer;
            pointer5: Pointer;
            pointer6: Pointer;
            pointer7: Pointer;
            pointer8: Pointer;
            pointer9: Pointer;
            pointer10: Pointer;
            activePointer: Pointer;
            mousePointer: Pointer;
            mouse: Mouse;
            keyboard: Keyboard;
            touch: Touch;
            mspointer: MSPointer;
            interactiveItems: LinkedList;
            onDown: Signal;
            onUp: Signal;
            onTap: Signal;
            onHold: Signal;
            boot(): void;
            update(): void;
            reset(hard?: boolean);
            resetSpeed(x: number, y: number);
            startPointer(event: Event): Pointer;
            updatePointer(event: Event): Pointer;
            stopPointer(event: Event): Pointer;
            getPointer(state: boolean): Pointer;
            getPointerFromIdentifier(identifier: number): Pointer;
            addPointer(): Pointer;
      }

      class Keyboard {
            constructor(game: Game);
            game: Game;
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
            addKeyCapture(keycode: any): void;
            removeKeyCapture(keycode: number): void;
            clearCaptures(): void;
            onKeyDown(event: any): void;
            onKeyUp(event: any): void;
            reset(): void;
            justPressed(keycode: number, duration?: number): boolean;
            justReleased(keycode: number, duration?: number): boolean;
            isDown(keycode: number): boolean;
      }

      class Mouse {
            constructor(game: Game)
            game: Game;
            callbackContext: Object;
            disabled: boolean;
            locked: boolean;
            static LEFT_BUTTON: number;
            static MIDDLE_BUTTON: number;
            static RIGHT_BUTTON: number;
            mouseDownCallback(): void;
            mouseMoveCallback(): void;
            mouseUpCallback(): void;
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
            constructor(game: Game);
            game: Game;
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
            constructor(game: Game, id: number);
            game: Game;
            id: number;
            active: boolean;
            positionDown: Point;
            position: Point;
            circle: Circle;
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
            start(event: any): Pointer;
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
            constructor(game: Game);
            game: Game;
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
            constructor(sprite: Sprite);
            game: Game;
            sprite: Sprite;
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
            boundsSprite: Sprite;
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
            enableDrag(lockCenter: boolean, bringToTop: boolean, pixelPerfect: boolean, alphaThreshold?: number, boundsRect?: Rectangle, boundsSprite?: Rectangle): void;
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
            constructor(sprite: Sprite);
            parent: Sprite;
            onAddedToGroup: Signal;
            onRemovedFromGroup: Signal;
            onKilled: Signal;
            onRevived: Signal;
            onOutOfBounds: Signal;
            onInputOver: Signal;
            onInputOut: Signal;
            onInputDown: Signal;
            onInputUp: Signal;
            onDragStart: Signal;
            onDragStop: Signal;
            onAnimationStart: Signal;
            onAnimationComplete: Signal;
            onAnimationLoop: Signal;
      } 

      class GameObjectFactory {
            constructor(game: Game);
            game: Game;
            world: World;
            existing(object: any): boolean;
            sprite(x: number, y: number, key?: string, frame?: any): Sprite;
            child(parent: any, x: number, y: number, key?: string, frame?: number): Sprite;
            tween(obj: Object): Tween;
            group(parent?: any, name?: string): Group;
            audio(key: string, volume?: number, loop?: boolean): Sound;
            tileSprite(x: number, y: number, width: number, height: number, key?: string, frame?: number): TileSprite;
            text(x: number, y: number, text: string, style: any): Text;
            button(x: number, y: number, key: string, callback: Function, callbackContext: Object, overFrame?: any, outFrame?: any, downFrame?: any): Button;
            graphics(x: number, y: number): Graphics;
            emitter(x: number, y: number, maxParticles: number): Particles.Arcade.Emitter;
            bitmapText(x: number, y: number, text: string, style: string): BitmapText;
            tilemap(x: number, y: number, key: string, resizeWorld: boolean, tileWidth: number, tileHeight: number): Tilemap;
            renderTexture(key: string, width: number, height: number): RenderTexture;
      }

      class Sprite {
            constructor(game: Game, x: number, y: number, key: string, frame: number);
            game: Game;
            exists: boolean;
            alive: boolean;
            group: Group;
            name: string;
            type: number;
            renderOrderID: number;
            lifespan: number;
            events: Event[]; 
            animations: AnimationManager;
            input: InputHandler;
            key: string;
            currentFrame: number;
            anchor: Point;
            x: number;
            y: number;
            position: Point;
            autoCull: boolean;
            scale: Point;
            scrollFactor: Point;
            offset: Point;
            center: Point;
            topLeft: Point;
            topRight: Point;
            bottomRight: Point;
            bottomLeft: Point;
            bounds: Rectangle;
            body: Physics.Arcade.Body;
            velocity: number;
            acceleration: number;
            inWorld: boolean;
            inWorldThreshold: number;
            angle: number;
            frame: number;
            frameName: string;
            inCamera: boolean;
            crop: boolean;
            cropEnabled: boolean;
            inputEnabled: boolean;
            preUpdate(): void;
            postUpdate(): void;
            centerOn(x: number, y: number): void;
            revive(): void;
            kill(): void;
            reset(x: number, y: number): void;
            updateBounds(): void;
            getLocalPosition(p: Point, x: number, y: number): Point;
            getLocalUnmodifiedPosition(p: Point, x: number, y: number): Point;
            bringToTop(): void;
            getBounds(rect: Rectangle): Rectangle;
      }

      class TileSprite {
            constructor(game: Game, x: number, y: number, width: number, height: number, key?: string, frame?: number);
            texture: RenderTexture;
            type: number;
            tileScale: Point;
            tilePosition: Point;
      }

      class Text {
            constructor(game: Game, x: number, y: number, text: string, style: string);
            exists: boolean;
            alive: boolean;
            group: Group;
            content: string;
            name: string;
            game: Game;
            type: number;
            text: string;
            angle: number;
            style: string;
            visible: boolean;
            position: Point;
            anchor: Point;
            scale: Point;
            scrollFactor: Point;
            renderable: boolean;
            update(): void;
      }

      class BitmapText extends Text {
      }

      class Button {
            constructor(game: Game, x: number, y: number, key: string, callback: Function, overFrame: number, outFrame: number, downFrame: number);
            input: InputHandler;
            onInputUp: Signal;
            onInputDown: Signal;
            onInputOut: Signal;
            onInputOver: Signal;
            events: Event[];
            setFrames(overFrame?: number, outFrame?: number, downFrame?: number): void;
            onInputOverHandler(pointer: Pointer): void;
            onInputUpHandler(pointer: Pointer): void;
            onInputDownHandler(pointer: Pointer): void;
            onInputOutHandler(pointer: Pointer): void;
      }

      class Graphics extends Sprite {
            constructor(game: Game, x: number, y: number);
            angle: number;
      }

      class RenderTexture {
            constructor(game: Game, key: string, width: number, height: number);
            name: string;
            type: number;
      }

      class Canvas {
            create(width: number, height: number): HTMLCanvasElement;
            getOffset(element: HTMLElement, point?: Point): Point;
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
            constructor(game: Game, width: number, height: number);
            static EXACT_FIT: number;
            static NO_SCALE: number;
            static SHOW_ALL: number;
            forceLandscape: boolean;
            forcePortrait: boolean;
            incorrectOrientation: boolean;
            pageAlignHorizontally: boolean;
            pageAlignVeritcally: boolean;
            minWidth: number;
            maxWidth: number;
            minHeight: number;
            maxHeight: number;
            width: number;
            height: number;
            maxIterations: number;
            game: Game;
            enterLandscape: Signal;
            enterPortrait: Signal;
            orientation: number;
            scaleFactor: Point;
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
            constructor(game: Game);
            game: Game;
            isRunning: boolean;
            start(): boolean;
            updateRAF(time: number): void;
            updateSetTimeout(): void;
            stop(): void;
            isSetTimeOut(): boolean;
            isRAF(): boolean;
      }

      class RandomDataGenerator {
            constructor(seeds: any[]);
            c: number;
            s0: number;
            s1: number;
            s2: number; 
            rnd(): number;
            sow(seeds: any[]): void;
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
            static shift(stack: any[]): any;
            static shuffleArray(array: any[]): any[];
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
            constructor(physicsManager: Physics.Arcade, x: number, y: number, width: number, height: number, maxObject?: number, maxLevels?: number, level?: number);
            physicsManager: Physics.Arcade;
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
            objects: any[];
            nodes: any[];
            split(): void;
            insert(body: Object): void;  
            getIndex(rect: Object): number;
            retrieve(sprite: Object): any[];
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
            clone(out: Circle): Circle;
            contains(x: number, y: number): Circle;
            circumferencePoint(angle: number, asDegrees: number, output?: Point): Point;
            offset(dx: number, dy: number): Circle;
            offsetPoint(point: Point): Circle;
            toString(): string;
            static contains(a: Circle, x: number, y: number): boolean;
            static equals(a: Circle, b: Circle): boolean;
            static intersects(a: Circle, b: Circle): boolean;
            static circumferencePoint(a: Circle, angle: number, asDegrees: boolean, output?: Point): Point;
            static intersectsRectangle(c: Circle, r: Rectangle): boolean;
      }

      class Point {
            constructor(x: number, y: number);
            x: number;
            y: number;
            copyFrom(source: any): Point;
            invert(): Point;
            setTo(x: number, y: number): Point;
            add(x: number, y: number): Point;
            subtract(x: number, y: number): Point;
            multiply(x: number, y: number): Point;
            divide(x: number, y: number): Point;
            clampX(min: number, max: number): Point;
            clampY(min: number, max: number): Point;
            clamp(min: number, max: number): Point;
            clone(output: Point): Point;
            copyTo(dest: any): Object;
            distance(dest: Object, round?: boolean): number;
            equals(a: Point): boolean;
            rotate(x: number, y: number, angle: number, asDegrees: boolean, distance: number): Point;
            toString(): string;
            static add(a: Point, b: Point, out?: Point): Point;
            static subtract(a: Point, b: Point, out?: Point): Point;
            static multiply(a: Point, b: Point, out?: Point): Point;
            static divide(a: Point, b: Point, out?: Point): Point;
            static equals(a: Point, b: Point): boolean;
            static distance(a: Point, b: Point, round: boolean): number;
            static rotate(a: Point, x: number, y: number, angle: number, asDegrees: boolean, distance: boolean): Point;
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
            bottomRight: Point;
            left: number;
            right: number;
            volume: number;
            perimeter: number;
            centerX: number;
            centerY: number;
            top: number;
            topLeft: Point;
            empty: boolean;
            offset(dx: number, dy: number): Rectangle;
            offsetPoint(point: Point): Rectangle;
            setTo(x: number, y: number, width: number, height: number): Rectangle;
            floor(): void;
            copyFrom(source: any): Rectangle;
            copyTo(dest: any): Object;
            inflate(dx: number, dy: number): Rectangle;
            size(output: Point): Point;
            clone(output: Rectangle): Rectangle;
            contains(x: number, y: number): boolean;
            containsRect(b: Rectangle): boolean;
            equals(b: Rectangle): boolean;
            intersection(b: Rectangle, out: Rectangle): Rectangle;
            intersects(b: Rectangle, tolerance: number): boolean;
            intersectsRaw(left: number, right: number, top: number, bottom: number, tolerance: number): boolean;
            union(b: Rectangle, out: Rectangle): Rectangle;
            toString(): string;
            static inflate(a: Rectangle, dx: number, dy: number): Rectangle;
            static inflatePoint(a: Rectangle, point: Point): Rectangle;
            static size(a: Rectangle, output: Point): Point;
            static clone(a: Rectangle, output: Rectangle): Rectangle;
            static contains(a: Rectangle, x: number, y: number): boolean;
            static containsPoint(a: Rectangle, point: Point): boolean;
            static containsRect(a: Rectangle, b: Rectangle): boolean;
            static equals(a: Rectangle, b: Rectangle): boolean;
            static intersection(a: Rectangle, b: Rectangle, out: Rectangle): Rectangle;
            static intersects(a: Rectangle, b: Rectangle, tolerance: number): boolean;
            static intersectsRaw(a: Rectangle, left: number, right: number, top: number, bottom: number, tolerance: number): boolean;
            static union(a: Rectangle, b: Rectangle, out: Rectangle): Rectangle;
      }

      class Net {
            constructor(game: Game);
            game: Game;
            getHostName(): string;
            checkDomainName(domain: string): string;
            updateQueryString(key: string, value: any, redirect?: boolean, url?: string): string;
            getQueryString(parameter?: string): string;
            decodeURI(value: string): string;
      }

      class TweenManager {
            constructor(game: Game);
            game: Game;
            REVISION: string;
            getAll(): Tween[];
            removeAll(): void;
            add(tween: Tween): Tween;
            create(object: Object): Tween;
            remove(tween: Tween): void;
            update(): boolean;
            pauseAll(): void;
            resumeAll(): void;
      }

      class Tween {
            constructor(object: Object, game: Game);
            game: Game;
            pending: boolean;
            pendingDelete: boolean;
            onStart: Signal;
            onComplete: Signal;
            isRunning: boolean;
            to(properties: Object, duration?: number, ease?: any, autoStart?: boolean, delay?: number, loop?: boolean): Tween;
            start(time: number): Tween;
            stop(): Tween;
            delay(amount: number): Tween;
            repeat(times: number): Tween;
            yoyo(yoyo: boolean): Tween;
            easing(easing: any): Tween;
            interpolation(interpolation: Function): Tween;
            chain(...tweens: Tween[]): Tween;
            loop(): Tween;
            onStartCallback(callback: Function): Tween;
            onUpdateCallback(callback: Function): Tween;
            onCompleteCallback(callback: Function): Tween;
            pause(): void;
            resume(): void;
            update(time: number): boolean;
      }

      class Easing {
            Linear: {
                  None: (k: number) => number;
            };
            Quadratic: {
                  In: (k: number) => number;
                  Out: (k: number) => number;
                  InOut: (k: number) => number;
            };
            Cubic: {
                  In: (k: number) => number;
                  Out: (k: number) => number;
                  InOut: (k: number) => number;
            };
            Quartic: {
                  In: (k: number) => number;
                  Out: (k: number) => number;
                  InOut: (k: number) => number;
            };
            Quintic: {
                  In: (k: number) => number;
                  Out: (k: number) => number;
                  InOut: (k: number) => number;
            };
            Sinusoidal: {
                  In: (k: number) => number;
                  Out: (k: number) => number;
                  InOut: (k: number) => number;
            };
            Exponential: {
                  In: (k: number) => number;
                  Out: (k: number) => number;
                  InOut: (k: number) => number;
            };
            Circular: {
                  In: (k: number) => number;
                  Out: (k: number) => number;
                  InOut: (k: number) => number;
            };
            Elastic: {
                  In: (k: number) => number;
                  Out: (k: number) => number;
                  InOut: (k: number) => number;
            };
            Back: {
                  In: (k: number) => number;
                  Out: (k: number) => number;
                  InOut: (k: number) => number;
            };
            Bounce: {
                  In: (k: number) => number;
                  Out: (k: number) => number;
                  InOut: (k: number) => number;
            };
      }

      class Time {
            constructor(game: Game);
            game: Game;
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
            totalElapsedSeconds(): number;
            update(time: number): number;
            gamePaused(): void;
            gameResumed(): void;
            elapsedSince(since: number): number;
            elapsedSecondsSince(since: number): number;
            reset(): void;
      }

      class AnimationManager {
            constructor(sprite);
            sprite: Sprite;
            game: Game;
            currentFrame: Animation.Frame;
            updateIfVisible: boolean;
            frameData: Animation.FrameData;
            frameTotal: number;
            frame: number;
            frameName: string;
            loadFrameData(frameData: Animation.FrameData): void;
            add(name: string, frames?: any[], frameRate?: number, loop?: boolean, useNumericIndex?: boolean): Animation;
            validateFrames(frames: any[], useNumericIndex?: boolean): boolean;
            play(name: string, frameRate?: number, loop?: boolean): Animation;
            stop(name?: string, resetFrame?: boolean): void;
            update(): boolean;
            destroy(): void;
      }

      class Animation {
            constructor(game: Game, parent: Sprite, name: string, frameData: Animation.FrameData, frames: any[], delay: number, looped: boolean);
            game: Game;
            name: string;
            delay: number;
            looped: boolean;
            isFinished: boolean;
            isPlaying: boolean;
            currentFrame: Animation.Frame;
            frameTotal: number;
            frame: number;
            play(frameRate?: number, loop?: boolean): Animation;
            restart(): void;
            stop(resetFrame?: boolean): void;
            update(): boolean;
            destroy(): void;
            onComplete(): void;
      }

      module Animation {
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
                  getFrameRange(start: number, end: number, output: any[]): any[];
                  getFrames(frames: any[], useNumericIndex?: boolean, output?: any[]): any[];
                  getFrameIndexes(frames: any[], useNumericIndex?: boolean, output?: any[]): any[];
                  total: number;
            }

            class Parser {
                  spriteSheet(game: Game, key: string, frameWidth: number, frameHeight: number, frameMax?: number): Animation.FrameData;
                  JSONData(game: Game, json: Object, cacheKey: string): Animation.FrameData;
                  JSONDataHash(game: Game, json: Object, cacheKey: string): Animation.FrameData;
                  XMLData(game: Game, xml: Object, cacheKey: string): Animation.FrameData;
            }
      }

      class Cache {
            constructor(game: Game);
            game: Game;
            onSoundUnlock: Signal;
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
            updateSound(key: string, property: string, value: Sound): void;
            decodedSound(key: string, data: Object): void;
            addText(key: string, url: string, data: Object): void;
            getCanvas(key: string): Object;
            checkImageKey(key: string): boolean;
            getImage(key: string): Object;
            getTilemap(key: string): Tilemap;
            getFrameData(key: string): Animation.FrameData;
            getFrameByIndex(key: string, frame: string): Animation.Frame;
            getFrameByName(key: string, frame: string): Animation.Frame;
            getFrame(key: string): Animation.Frame;
            getTextureFrame(key: string): Animation.Frame;
            getTexture(key: string): RenderTexture;
            getSound(key: string): Sound;
            getSoundData(key: string): Object;
            isSoundDecoded(key: string): boolean;
            isSoundReady(key: string): boolean;
            isSpriteSheet(key: string): boolean;
            getText(key: string): Object;
            getKeys(array: any[]): any[];
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
            constructor(game: Game);
            game: Game;
            queueSize: number;
            isLoading: boolean;
            hasLoaded: boolean;
            progress: number;
            preloadSprite: Sprite;
            crossOrigin: string;
            baseURL: string;
            onFileComplete: Signal;
            onFileError: Signal; 
            onLoadStart: Signal;
            onLoadComplete: Signal;
            setPreloadSprite(sprite: Sprite, direction?: number): void;
            checkKeyExists(key: string): boolean;
            reset(): void;
            addToFileList(type: string, key: string, url: string, properties: any[]): void;
            image(key: string, url: string, overwrite?: boolean): void;
            text(key: string, url: string, overwrite?: boolean): void;
            spritesheet(key: string, url: string, frameWidth: number, frameHeight: number, frameMax: number): void;
            audio(key: string, urls: string[], autoDecode?: boolean): void;
            tilemap(key: string, tilesetURL: string, mapDataURL?: string, mapData?: Object, format?: string): void;
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

      module Loader {
            class Parser {
                  bitmapFont(game: Game, xml: Object, cacheKey: Animation.FrameData): void;
            }
      }

      class Sound {
            constructor(game: Game, key: string, volume?: number, loop?: boolean);
            game: Game;
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
            onDecoded: Signal;
            onPlay: Signal;
            onPause: Signal;
            onResume: Signal;
            onLoop: Signal;
            onStop: Signal;
            onMute: Signal;
            isDecoded: boolean;
            isDecoding: boolean;
            mute: boolean;
            volume: number;
            onMarkerComplete: Signal;
            soundHasUnlocked(key: string): void;
            addMarker(name: string, start: number, stop: number, volume?: number, loop?: boolean): void;
            removeMarker(name: string): void;
            update(): void;
            play(marker?: string, position?: number, volume?: number, loop?: boolean): Sound;
            restart(marker: string, position: number, volume?: number, loop?: boolean): void;
            pause(): void;
            resume(): void; 
            stop(): void;
      }

      class SoundManager {
            constructor(game: Game);
            game: Game;
            onSoundDecode: Signal;
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
            decode(key: string, sound?: Sound): void;
            update(): void;
            add(key: string, volume: number, loop: boolean): Sound;
      }

      module Utils {
            class Debug {
                  constructor(game: Game);
                  game: Game;
                  font: string;
                  lineHeight: number;
                  renderShadow: boolean;
                  currentX: number;
                  currentY: number;
                  currentAlpha: number;
                  start(x?: number, y?: number, color?: string): void;
                  stop(): void;
                  line(text: string, x: number, y: number): void;
                  renderQuadTree(quadtree: QuadTree, color?: string): void;
                  renderSpriteCorners(sprite: Sprite, showText?: boolean, showBounds?: boolean, color?: string): void;
                  renderSoundInfo(sound: Sound, x: number, y: number, color?: string): void;
                  renderCameraInfo(camera: Camera, x: number, y: number, color?: string): void;
                  renderPointer(pointer: Pointer, hideIfUp?: boolean, downColor?: string, upColor?: string, color?: string): void;
                  renderSpriteInputInfo(sprite: Sprite, x: number, y: number, color?: string): void;
                  renderSpriteCollision(sprite: Sprite, x: number, y: number, color?: string): void;
                  renderInputInfo(x: number, y: number, color?: string): void;
                  renderSpriteInfo(sprite: Sprite, x: number, y: number, color?: string): void;
                  renderWorldTransformInfo(sprite: Sprite, x: number, y: number, color?: string): void;
                  renderLocalTransformInfo(sprite: Sprite, x: number, y: number, color?: string): void;
                  renderPointInfo(point: Point, x: number, y: number, color?: string): void;
                  renderSpriteBody(sprite: Sprite, color?: string): void;
                  renderSpriteBounds(sprite: Sprite, color?: string, fill?: boolean): void;
                  renderPixel(x: number, y: number, fillStyle?: string): void;
                  renderPoint(point: Point, fillStyle?: string): void;
                  renderRectangle(rect: Rectangle, fillStyle?: string): void;
                  renderCircle(circle: Circle, fillStyle?: string): void;
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
                  constructor(game: Game)
                  game: Game;
                  gravity: Point;
                  bounds: Rectangle;
                  maxObjects: number;
                  maxLevels: number;
                  OVERLAP_BIAS: number;
                  TILE_OVERLAP: number;
                  quadTree: QuadTree;
                  quadTreeID: number;
                  updateMotion(body: Physics.Arcade.Body);
                  computeVelocity(axis: number, body: Physics.Arcade.Body, velocity: number, acceleration: number, drag: number, max: number): void;
                  preUpdate(): void;
                  postUpdate(): void;
                  overlap(object1: any, object2: any, overlapCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
                  overlapSpriteVsSprite(sprite1: Sprite, sprite2: Sprite,  overlapCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
                  overlapSpriteVsGroup(sprite1: Sprite, group: Group,  overlapCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
                  overlapGroupVsGroup(group: Group, group2: Group,  overlapCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
                  collide(object1: any, object2: any, collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
                  collideSpriteVsSprite(sprite1: Sprite, sprite2: Sprite,  collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
                  collideSpriteVsTilemap(sprite1: Sprite, tilemap: Tilemap,  collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
                  collideSpriteVsGroup(sprite1: Sprite, group: Group,  collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
                  collideGroupVsTilemap(group: Group, tilemap: Tilemap,  collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
                  collideGroupVsGroup(group: Group, group2: Group,  collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
                  separate(body: Physics.Arcade.Body, body2: Physics.Arcade.Body): void;
                  separateX(body: Physics.Arcade.Body, body2: Physics.Arcade.Body): void;
                  separateY(body: Physics.Arcade.Body, body2: Physics.Arcade.Body): void;
                  separateTile(object: Object, x: number, y: number, width: number, height: number, mass: number, collideLeft: boolean, collideRight: boolean, collideUp: boolean, collideDown: boolean, separateX: boolean, separateY: boolean): boolean;
                  separateTileX(object: Object, x: number, y: number, width: number, height: number, mass: number, collideLeft: boolean, collideRight: boolean, collideUp: boolean, collideDown: boolean, separateX: boolean, separateY: boolean): boolean;
                  separateTileY(object: Object, x: number, y: number, width: number, height: number, mass: number, collideLeft: boolean, collideRight: boolean, collideUp: boolean, collideDown: boolean, separateX: boolean, separateY: boolean): boolean;
                  velocityFromAngle(angle: number, speed?: number, point?: Point): Point;
                  moveTowardsObject(source: Sprite, dest: Sprite, speed?: number, maxTime?: number): void;
                  accelerateTowardsObject(source: Sprite, dest: Sprite, speed?: number, xSpeedMax?: number, ySpeedMax?: number): void;
                  moveTowardsMouse(source: Sprite, speed?: number, maxTime?: number): void; 
                  accelerateTowardsMouse(source: Sprite, speed: number, xSpeedMax?: number, ySpeedMax?: number): void;
                  moveTowardsPoint(source: Sprite, target: Point, speed?: number, maxTime?: number): void;
                  accelerateTowardsPoint(source: Sprite, target: Point, speed: number, xSpeedMax?: number, ySpeedMax?: number): void;
                  distanceBetween(a: Sprite, b: Sprite): number;
                  distanceToPoint(a: Sprite, target: Point): number;
                  distanceToMouse(a: Sprite): number;
                  angleBetweenPoint(a: Sprite, target: Point, asDegrees?: boolean): number;
                  angleBetween(a: Sprite, b: Sprite, asDegrees?: boolean): number;
                  velocityFromFacing(parent: Sprite, speed: number): Point;
                  angleBetweenMouse(a: Sprite, asDegress?: boolean): number;
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
                        constructor(sprite: Sprite);
                        sprite: Sprite;
                        game: Game;
                        offset: Point;
                        x: number;
                        y: number;
                        lastX: number;
                        lastY: number;
                        sourceWidth: number;
                        sourceHeight: number;
                        width: number;
                        height: number; 
                        halfWidth: number;
                        helfHeight: number;
                        velocity: Point;
                        acceleration: Point;
                        drag: Point;
                        gravity: Point;
                        bounce: Point;
                        maxVelocity: Point;
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
            constructor(game: Game);
            emitters: Object;
            ID: number;
            add(emitter: Particles.Arcade.Emitter): Particles.Arcade.Emitter;
            remove(emitter: Particles.Arcade.Emitter): void;
            update(): void;
      }

      module Particles {
            module Arcade {
                  class Emitter {
                        constructor(game: Game, x: number, y: number, maxParticles?: number);
                        name: string;
                        type: number;
                        x: number;
                        y: number;
                        width: number;
                        height: number;
                        minParticleSpeed: Point;
                        maxParticleSpeed: Point;
                        minParticleScale: number;
                        maxParticleScale: number;
                        minRotation: number;
                        maxRotation: number;
                        gravity: number;
                        particleClass: string;
                        particleDrag: Point;
                        angularDrag: number;
                        frequency: number;
                        maxParticles: number;
                        lifespan: number;
                        bounce: Point;
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
                        makeParticles(keys: string[], frames: string[], quantity: number, collide: boolean, collideWorldBounds: boolean): Particles.Arcade.Emitter;
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
            constructor(game: Game, key: string, x: number, y: number, resizeWorld?: boolean, tileWidth?: number, tileHeight?: number);
            game: Game;
            group: Group;
            name: string;
            key: string;
            renderOrderID: number;
            collisionCallback: Function;
            exists: boolean;
            visible: boolean;
            tiles: any[];
            layers: any[];
            position: Point;
            type: number;
            renderer: TilemapRenderer;
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
            getTileOverlaps(object: Object): any[];
            collide(objectOrGroup: any, callback: Function, context: Object): boolean;
            collideGameObject(object: Object): boolean;
            putTile(x: number, y: number, index: number, layer?: number): void;
            update(): void;
            destroy(): void;
      }

      class TilemapLayer {
            constructor(parent: Tilemap, id: number, key: string, mapFormat: number, name: string, tileWidth: number, tileHeight: number);
            exists: boolean;
            visible: boolean;
            widthInTiles: number;
            heightInTiles: number;
            widthInPixels: number;
            heightInPixels: number;
            tileMargin: number;
            tileSpacing: number;
            parent: Tilemap;
            game: Game;
            ID: number;
            name: string;
            key: string;
            type: number;
            mapFormat: number;
            tileWidth: number;
            tileHeight: number;
            boundsInTiles: Rectangle;
            tileset: Object;
            canvas: any;
            context: any;
            baseTexture: any;
            texture: any;
            sprite: Sprite;
            mapData: any[];
            alpha: number;
            putTileWorldXY(x: number, y: number, index: number): void;
            putTile(x: number, y: number, index: number): void;
            swapTile(tileA: number, tileB: number, x?: number, y?: number, width?: number, height?: number): void;
            fillTile(index: number, x?: number, y?: number, width?: number, height?: number): void;
            randomiseTiles(tiles: number[], x?: number, y?: number, width?: number, height?: number): void;
            replaceTile(tileA: number, tileB: number, x?: number, y?: number, width?: number, height?: number): void;
            getTileBlock(x: number, y: number, width: number, height: number): any[];
            getTileFromWorldXY(x: number, y: number): Tile;
            getTileOverlaps(object: Object): any[];
            getTempBlock(x: number, y: number, width: number, height: number, collisionOnly?: boolean): void;
            getTileIndex(x: number, y: number): number;
            addColumn(column: string[]): void;
            createCanvas(): void;
            updateBounds(): void;
            parseTileOffsets(): number;
      }

      class Tile {
            constructor(game: Game, tilemap: Tilemap, index: number, width: number, height: number);
            mass: number;
            collideNone: boolean;
            collideLeft: boolean;
            collideRight: boolean;
            collideUp: boolean;
            collideDown: boolean;
            separateX: boolean;
            separateY: boolean;
            game: Game;
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
            constructor(game: Game);
            game: Game;
            render(tilemap: Tilemap): void;
      }
}

declare class Phaser {
    static VERSION: string;
    static DEV_VERSION: string;
    static GAMES: any[];
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