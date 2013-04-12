/// <reference path="Game.ts" />

class State {

    constructor(game: Game) {

        this.game = game;

        this.camera = game.camera;
        this.cache = game.cache;
        this.input = game.input;
        this.loader = game.loader;
        this.sound = game.sound;
        this.stage = game.stage;
        this.time = game.time;
        this.math = game.math;
        this.world = game.world;

    }

    public game: Game;

    public camera: Camera;
    public cache: Cache;
    public input: Input;
    public loader: Loader;
    public sound: SoundManager;
    public stage: Stage;
    public time: Time;
    public math: GameMath;
    public world: World;


    //  Overload these in your own States
    public init() {}
    public create() {}
    public update() {}
    public render() {}
    public paused() {}

    //  Handy Proxy methods

    public createCamera(x: number, y: number, width: number, height: number): Camera {
        return this.game.world.createCamera(x, y, width, height);
    }

    public createSprite(x: number, y: number, key?: string = ''): Sprite {
        return this.game.world.createSprite(x, y, key);
    }

    public createGroup(MaxSize?: number = 0): Group {
        return this.game.world.createGroup(MaxSize);
    }

    public createParticle(): Particle {
        return this.game.world.createParticle();
    }

    public createEmitter(x?: number = 0, y?: number = 0, size?:number = 0): Emitter {
        return this.game.world.createEmitter(x, y, size);
    }

    public createTilemap(key:string, mapData:string, format:number, tileWidth?:number,tileHeight?:number): Tilemap {
        return this.game.world.createTilemap(key, mapData, format, tileWidth, tileHeight);
    }

    public collide(ObjectOrGroup1: Basic = null, ObjectOrGroup2: Basic = null, NotifyCallback = null): bool {
        return this.game.world.overlap(ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, World.separate);
    }

}