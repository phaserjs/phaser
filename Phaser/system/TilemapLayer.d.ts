/// <reference path="../Game.d.ts" />
module Phaser {
    class TilemapLayer {
        constructor(game: Game, parent: Tilemap, key: string, mapFormat: number, name: string, tileWidth: number, tileHeight: number);
        private _game;
        private _parent;
        private _texture;
        private _tileOffsets;
        private _startX;
        private _startY;
        private _maxX;
        private _maxY;
        private _tx;
        private _ty;
        private _dx;
        private _dy;
        private _oldCameraX;
        private _oldCameraY;
        private _columnData;
        private _tempTileX;
        private _tempTileY;
        private _tempTileW;
        private _tempTileH;
        public name: string;
        public alpha: number;
        public exists: bool;
        public visible: bool;
        public orientation: string;
        public properties: {};
        public mapData;
        public mapFormat: number;
        public boundsInTiles: Rectangle;
        public tileWidth: number;
        public tileHeight: number;
        public widthInTiles: number;
        public heightInTiles: number;
        public widthInPixels: number;
        public heightInPixels: number;
        public tileMargin: number;
        public tileSpacing: number;
        public getTileFromWorldXY(x: number, y: number): number;
        public getTileOverlaps(object: GameObject): bool;
        public getTileBlock(x: number, y: number, width: number, height: number): any[];
        public getTileIndex(x: number, y: number): number;
        public addColumn(column): void;
        public updateBounds(): void;
        public parseTileOffsets(): number;
        public renderDebugInfo(x: number, y: number, color?: string): void;
        public render(camera: Camera, dx, dy): bool;
    }
}
