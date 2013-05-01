/// <reference path="../Game.d.ts" />
/// <reference path="LinkedList.d.ts" />
module Phaser {
    class QuadTree extends Rectangle {
        constructor(X: number, Y: number, Width: number, Height: number, Parent?: QuadTree);
        static A_LIST: number;
        static B_LIST: number;
        static divisions: number;
        private _canSubdivide;
        private _headA;
        private _tailA;
        private _headB;
        private _tailB;
        private static _min;
        private _northWestTree;
        private _northEastTree;
        private _southEastTree;
        private _southWestTree;
        private _leftEdge;
        private _rightEdge;
        private _topEdge;
        private _bottomEdge;
        private _halfWidth;
        private _halfHeight;
        private _midpointX;
        private _midpointY;
        private static _object;
        private static _objectLeftEdge;
        private static _objectTopEdge;
        private static _objectRightEdge;
        private static _objectBottomEdge;
        private static _list;
        private static _useBothLists;
        private static _processingCallback;
        private static _notifyCallback;
        private static _iterator;
        private static _objectHullX;
        private static _objectHullY;
        private static _objectHullWidth;
        private static _objectHullHeight;
        private static _checkObjectHullX;
        private static _checkObjectHullY;
        private static _checkObjectHullWidth;
        private static _checkObjectHullHeight;
        public destroy(): void;
        public load(ObjectOrGroup1: Basic, ObjectOrGroup2?: Basic, NotifyCallback?, ProcessCallback?): void;
        public add(ObjectOrGroup: Basic, List: number): void;
        private addObject();
        private addToList();
        public execute(): bool;
        private overlapNode();
    }
}
