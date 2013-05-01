/// <reference path="Game.d.ts" />
module Phaser {
    class World {
        constructor(game: Game, width: number, height: number);
        private _game;
        public cameras: CameraManager;
        public group: Group;
        public bounds: Rectangle;
        public worldDivisions: number;
        public update(): void;
        public render(): void;
        public destroy(): void;
        public setSize(width: number, height: number, updateCameraBounds?: bool): void;
        public width : number;
        public height : number;
        public centerX : number;
        public centerY : number;
        public randomX : number;
        public randomY : number;
        public createCamera(x: number, y: number, width: number, height: number): Camera;
        public removeCamera(id: number): bool;
        public getAllCameras(): Camera[];
        public createSprite(x: number, y: number, key?: string): Sprite;
        public createGeomSprite(x: number, y: number): GeomSprite;
        public createDynamicTexture(width: number, height: number): DynamicTexture;
        public createGroup(MaxSize?: number): Group;
        public createScrollZone(key: string, x?: number, y?: number, width?: number, height?: number): ScrollZone;
        public createTilemap(key: string, mapData: string, format: number, resizeWorld?: bool, tileWidth?: number, tileHeight?: number): Tilemap;
        public createParticle(): Particle;
        public createEmitter(x?: number, y?: number, size?: number): Emitter;
    }
}
