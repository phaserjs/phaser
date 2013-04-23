/// <reference path="Game.ts" />

/**
* Phaser - World
*
* A game has only one world. The world is an abstract place in which all game objects live. It is not bound
* by stage limits and can be any size or dimension. You look into the world via cameras and all game objects
* live within the world at world-based coordinates. By default a world is created the same size as your Stage.
*/

module Phaser {

    export class World {

        constructor(game: Game, width: number, height: number) {

            this._game = game;

            this._cameras = new CameraManager(this._game, 0, 0, width, height);

            this._game.camera = this._cameras.current;

            this.group = new Group(this._game, 0);

            this.bounds = new Rectangle(0, 0, width, height);

            this.worldDivisions = 6;

        }

        private _game: Game;
        private _cameras: CameraManager;

        public group: Group;
        public bounds: Rectangle;
        public worldDivisions: number;

        public update() {

            this.group.preUpdate();
            this.group.update();
            this.group.postUpdate();

            this._cameras.update();

        }

        public render() {

            //  Unlike in flixel our render process is camera driven, not group driven
            this._cameras.render();

        }

        public destroy() {

            this.group.destroy();

            this._cameras.destroy();

        }

        //  World methods

        public setSize(width: number, height: number, updateCameraBounds: bool = true) {

            this.bounds.width = width;
            this.bounds.height = height;

            if (updateCameraBounds == true)
            {
                this._game.camera.setBounds(0, 0, width, height);
            }

        }

        public get width(): number {
            return this.bounds.width;
        }

        public set width(value: number) {
            this.bounds.width = value;
        }

        public get height(): number {
            return this.bounds.height;
        }

        public set height(value: number) {
            this.bounds.height = value;
        }

        public get centerX(): number {
            return this.bounds.halfWidth;
        }

        public get centerY(): number {
            return this.bounds.halfHeight;
        }

        public get randomX(): number {
            return Math.round(Math.random() * this.bounds.width);
        }

        public get randomY(): number {
            return Math.round(Math.random() * this.bounds.height);
        }

        //  Cameras

        public createCamera(x: number, y: number, width: number, height: number): Camera {
            return this._cameras.addCamera(x, y, width, height);
        }

        public removeCamera(id: number): bool {
            return this._cameras.removeCamera(id);
        }

        public getAllCameras(): Camera[] {
            return this._cameras.getAll();
        }

        //  Game Objects

        public createSprite(x: number, y: number, key?: string = ''): Sprite {
            return <Sprite> this.group.add(new Sprite(this._game, x, y, key));
        }

        public createGeomSprite(x: number, y: number): GeomSprite {
            return <GeomSprite> this.group.add(new GeomSprite(this._game, x, y));
        }

        public createDynamicTexture(width: number, height: number): DynamicTexture {
            return new DynamicTexture(this._game, width, height);
        }

        public createGroup(MaxSize?: number = 0): Group {
            return <Group> this.group.add(new Group(this._game, MaxSize));
        }

        public createScrollZone(key: string, x?: number = 0, y?: number = 0, width?: number = 0, height?: number = 0): ScrollZone {
            return <ScrollZone> this.group.add(new ScrollZone(this._game, key, x, y, width, height));
        }

        public createTilemap(key: string, mapData: string, format: number, resizeWorld: bool = true, tileWidth?: number = 0, tileHeight?: number = 0): Tilemap {
            return <Tilemap> this.group.add(new Tilemap(this._game, key, mapData, format, resizeWorld, tileWidth, tileHeight));
        }

        public createParticle(): Particle {
            return new Particle(this._game);
        }

        public createEmitter(x?: number = 0, y?: number = 0, size?: number = 0): Emitter {
            return <Emitter> this.group.add(new Emitter(this._game, x, y, size));
        }

    }

}