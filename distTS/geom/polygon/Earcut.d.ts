/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare function earcut(data: any, holeIndices: any, dim: any): any[];
declare function linkedList(data: any, start: any, end: any, dim: any, clockwise: any): any;
declare function filterPoints(start: any, end: any): any;
declare function earcutLinked(ear: any, triangles: any, dim: any, minX: any, minY: any, size: any, pass: any): void;
declare function isEar(ear: any): boolean;
declare function isEarHashed(ear: any, minX: any, minY: any, size: any): boolean;
declare function cureLocalIntersections(start: any, triangles: any, dim: any): any;
declare function splitEarcut(start: any, triangles: any, dim: any, minX: any, minY: any, size: any): void;
declare function eliminateHoles(data: any, holeIndices: any, outerNode: any, dim: any): any;
declare function compareX(a: any, b: any): number;
declare function eliminateHole(hole: any, outerNode: any): void;
declare function findHoleBridge(hole: any, outerNode: any): any;
declare function indexCurve(start: any, minX: any, minY: any, size: any): void;
declare function sortLinked(list: any): any;
declare function zOrder(x: any, y: any, minX: any, minY: any, size: any): number;
declare function getLeftmost(start: any): any;
declare function pointInTriangle(ax: any, ay: any, bx: any, by: any, cx: any, cy: any, px: any, py: any): boolean;
declare function isValidDiagonal(a: any, b: any): boolean;
declare function area(p: any, q: any, r: any): number;
declare function equals(p1: any, p2: any): boolean;
declare function intersectsPolygon(a: any, b: any): boolean;
declare function locallyInside(a: any, b: any): boolean;
declare function middleInside(a: any, b: any): boolean;
declare function splitPolygon(a: any, b: any): any;
declare function insertNode(i: any, x: any, y: any, last: any): any;
declare function removeNode(p: any): void;
declare function Node(i: any, x: any, y: any): void;
declare function signedArea(data: any, start: any, end: any, dim: any): number;
