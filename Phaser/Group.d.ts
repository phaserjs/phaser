/// <reference path="Basic.d.ts" />
/// <reference path="Game.d.ts" />
module Phaser {
    class Group extends Basic {
        constructor(game: Game, MaxSize?: number);
        static ASCENDING: number;
        static DESCENDING: number;
        public members: Basic[];
        public length: number;
        private _maxSize;
        private _marker;
        private _sortIndex;
        private _sortOrder;
        public destroy(): void;
        public update(): void;
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): void;
        public maxSize : number;
        public add(Object: Basic): Basic;
        public recycle(ObjectClass?);
        public remove(Object: Basic, Splice?: bool): Basic;
        public replace(OldObject: Basic, NewObject: Basic): Basic;
        public sort(Index?: string, Order?: number): void;
        public setAll(VariableName: string, Value: Object, Recurse?: bool): void;
        public callAll(FunctionName: string, Recurse?: bool): void;
        public forEach(callback, recursive?: bool): void;
        public forEachAlive(context, callback, recursive?: bool): void;
        public getFirstAvailable(ObjectClass?);
        public getFirstNull(): number;
        public getFirstExtant(): Basic;
        public getFirstAlive(): Basic;
        public getFirstDead(): Basic;
        public countLiving(): number;
        public countDead(): number;
        public getRandom(StartIndex?: number, Length?: number): Basic;
        public clear(): void;
        public kill(): void;
        public sortHandler(Obj1: Basic, Obj2: Basic): number;
    }
}
