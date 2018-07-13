/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var quickselect: any;
/**
 * @classdesc
 * RBush is a high-performance JavaScript library for 2D spatial indexing of points and rectangles.
 * It's based on an optimized R-tree data structure with bulk insertion support.
 *
 * Spatial index is a special data structure for points and rectangles that allows you to perform queries like
 * "all items within this bounding box" very efficiently (e.g. hundreds of times faster than looping over all items).
 *
 * This version of RBush uses a fixed min/max accessor structure of `[ '.left', '.top', '.right', '.bottom' ]`.
 * This is to avoid the eval like function creation that the original library used, which caused CSP policy violations.
 *
 * @class RTree
 * @memberOf Phaser.Structs
 * @constructor
 * @since 3.0.0
 */
declare function rbush(maxEntries: any): any;
declare function findItem(item: any, items: any, equalsFn: any): any;
declare function calcBBox(node: any, toBBox: any): void;
declare function distBBox(node: any, k: any, p: any, toBBox: any, destNode: any): any;
declare function compareNodeMinX(a: any, b: any): number;
declare function compareNodeMinY(a: any, b: any): number;
declare function bboxArea(a: any): number;
declare function bboxMargin(a: any): number;
declare function enlargedArea(a: any, b: any): number;
declare function intersectionArea(a: any, b: any): number;
declare function contains(a: any, b: any): boolean;
declare function createNode(children: any): {
    children: any;
    height: number;
    leaf: boolean;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};
declare function multiSelect(arr: any, left: any, right: any, n: any, compare: any): void;
