/// <reference path="AnimationManager.d.ts" />
/// <reference path="Basic.d.ts" />
/// <reference path="Cache.d.ts" />
/// <reference path="CameraManager.d.ts" />
/// <reference path="Collision.d.ts" />
/// <reference path="DynamicTexture.d.ts" />
/// <reference path="FXManager.d.ts" />
/// <reference path="GameMath.d.ts" />
/// <reference path="Group.d.ts" />
/// <reference path="Loader.d.ts" />
/// <reference path="Motion.d.ts" />
/// <reference path="Signal.d.ts" />
/// <reference path="SignalBinding.d.ts" />
/// <reference path="SoundManager.d.ts" />
/// <reference path="Stage.d.ts" />
/// <reference path="Time.d.ts" />
/// <reference path="TweenManager.d.ts" />
/// <reference path="World.d.ts" />
/// <reference path="system/Device.d.ts" />
/// <reference path="system/RandomDataGenerator.d.ts" />
/// <reference path="system/RequestAnimationFrame.d.ts" />
/// <reference path="system/input/Input.d.ts" />
/// <reference path="system/input/Keyboard.d.ts" />
/// <reference path="system/input/Mouse.d.ts" />
/// <reference path="system/input/Touch.d.ts" />
/// <reference path="gameobjects/Emitter.d.ts" />
/// <reference path="gameobjects/GameObject.d.ts" />
/// <reference path="gameobjects/GeomSprite.d.ts" />
/// <reference path="gameobjects/Particle.d.ts" />
/// <reference path="gameobjects/Sprite.d.ts" />
/// <reference path="gameobjects/Tilemap.d.ts" />
/// <reference path="gameobjects/ScrollZone.d.ts" />
module Phaser {
    class Game {
        constructor(callbackContext, parent?: string, width?: number, height?: number, initCallback?, createCallback?, updateCallback?, renderCallback?);
        private _raf;
        private _maxAccumulation;
        private _accumulator;
        private _step;
        private _loadComplete;
        private _paused;
        private _pendingState;
        public callbackContext;
        public onInitCallback;
        public onCreateCallback;
        public onUpdateCallback;
        public onRenderCallback;
        public onPausedCallback;
        public cache: Cache;
        public collision: Collision;
        public input: Input;
        public loader: Loader;
        public math: GameMath;
        public motion: Motion;
        public sound: SoundManager;
        public stage: Stage;
        public time: Time;
        public tweens: TweenManager;
        public world: World;
        public rnd: RandomDataGenerator;
        public device: Device;
        public isBooted: bool;
        public isRunning: bool;
        private boot(parent, width, height);
        private loadComplete();
        private bootLoop();
        private pausedLoop();
        private loop();
        private startState();
        public setCallbacks(initCallback?, createCallback?, updateCallback?, renderCallback?): void;
        public switchState(state, clearWorld?: bool, clearCache?: bool): void;
        public destroy(): void;
        public paused : bool;
        public framerate : number;
        public createCamera(x: number, y: number, width: number, height: number): Camera;
        public createGeomSprite(x: number, y: number): GeomSprite;
        public createSprite(x: number, y: number, key?: string): Sprite;
        public createDynamicTexture(width: number, height: number): DynamicTexture;
        public createGroup(MaxSize?: number): Group;
        public createParticle(): Particle;
        public createEmitter(x?: number, y?: number, size?: number): Emitter;
        public createScrollZone(key: string, x?: number, y?: number, width?: number, height?: number): ScrollZone;
        public createTilemap(key: string, mapData: string, format: number, resizeWorld?: bool, tileWidth?: number, tileHeight?: number): Tilemap;
        public createTween(obj): Tween;
        public collide(objectOrGroup1?: Basic, objectOrGroup2?: Basic, notifyCallback?): bool;
        public camera : Camera;
    }
}
