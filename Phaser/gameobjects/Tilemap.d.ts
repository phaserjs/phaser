/// <reference path="../Game.d.ts" />
/// <reference path="GameObject.d.ts" />
/// <reference path="../system/TilemapLayer.d.ts" />
/// <reference path="../system/Tile.d.ts" />
module Phaser {
    class Tilemap extends GameObject {
        constructor(game: Game, key: string, mapData: string, format: number, resizeWorld?: bool, tileWidth?: number, tileHeight?: number);
        static FORMAT_CSV: number;
        static FORMAT_TILED_JSON: number;
        public tiles: Tile[];
        public layers: TilemapLayer[];
        public currentLayer: TilemapLayer;
        public collisionLayer: TilemapLayer;
        public mapFormat: number;
        public update(): void;
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): void;
        private parseCSV(data, key, tileWidth, tileHeight);
        private parseTiledJSON(data, key);
        private generateTiles(qty);
        public widthInPixels : number;
        public heightInPixels : number;
        public setCollisionRange(start: number, end: number, collision?: number, resetCollisions?: bool): void;
        public setCollisionByIndex(values: number[], collision?: number, resetCollisions?: bool): void;
        public getTile(x: number, y: number, layer?: number): Tile;
        public getTileFromWorldXY(x: number, y: number, layer?: number): Tile;
        public getTileFromInputXY(layer?: number): Tile;
        public getTileOverlaps(object: GameObject): bool;
        public collide(objectOrGroup?, callback?): bool;
        public collideGameObject(object: GameObject): bool;
    }
}
