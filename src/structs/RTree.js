/**
 * @author       Vladimir Agafonkin
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var quickselect = require('../utils/array/QuickSelect');

/**
 * @classdesc
 * RBush is a high-performance JavaScript library for 2D spatial indexing of points and rectangles.
 * It's based on an optimized R-tree data structure with bulk insertion support.
 *
 * Spatial index is a special data structure for points and rectangles that allows you to perform queries like
 * "all items within this bounding box" very efficiently (e.g. hundreds of times faster than looping over all items).
 *
 * This version of RBush uses a fixed min/max accessor structure of `[ '.left', '.top', '.right', '.bottom' ]`.
 * This is to avoid the eval-like function creation that the original library used, which caused CSP policy violations.
 *
 * rbush is forked from https://github.com/mourner/rbush by Vladimir Agafonkin
 *
 * @class RTree
 * @memberof Phaser.Structs
 * @constructor
 * @since 3.0.0
 */

function rbush (maxEntries)
{
    var format = [ '.left', '.top', '.right', '.bottom' ];

    if (!(this instanceof rbush)) return new rbush(maxEntries, format);

    // max entries in a node is 9 by default; min node fill is 40% for best performance
    this._maxEntries = Math.max(4, maxEntries || 9);
    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));

    this.clear();
}

rbush.prototype = {

    /**
     * Returns all items stored in the RTree as a flat array.
     *
     * @method Phaser.Structs.RTree#all
     * @since 3.0.0
     *
     * @return {any[]} An array containing all items currently stored in the tree.
     */
    all: function ()
    {
        return this._all(this.data, []);
    },

    /**
     * Searches the RTree for all items that intersect with the given bounding box and returns them as an array.
     *
     * @method Phaser.Structs.RTree#search
     * @since 3.0.0
     *
     * @param {Object} bbox - The bounding box to search within. Must have `minX`, `minY`, `maxX`, and `maxY` properties.
     *
     * @return {any[]} An array of all items in the tree that intersect with the given bounding box.
     */
    search: function (bbox)
    {
        var node = this.data,
            result = [],
            toBBox = this.toBBox;

        if (!intersects(bbox, node)) return result;

        var nodesToSearch = [],
            i, len, child, childBBox;

        while (node) {
            for (i = 0, len = node.children.length; i < len; i++) {

                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;

                if (intersects(bbox, childBBox)) {
                    if (node.leaf) result.push(child);
                    else if (contains(bbox, childBBox)) this._all(child, result);
                    else nodesToSearch.push(child);
                }
            }
            node = nodesToSearch.pop();
        }

        return result;
    },

    /**
     * Tests whether any item in the RTree intersects with the given bounding box.
     *
     * Unlike `search`, this method stops as soon as the first intersection is found, making it more
     * efficient when you only need to know whether a collision exists rather than retrieving all results.
     *
     * @method Phaser.Structs.RTree#collides
     * @since 3.0.0
     *
     * @param {Object} bbox - The bounding box to test against. Must have `minX`, `minY`, `maxX`, and `maxY` properties.
     *
     * @return {boolean} `true` if any item in the tree intersects with the bounding box, otherwise `false`.
     */
    collides: function (bbox)
    {
        var node = this.data,
            toBBox = this.toBBox;

        if (!intersects(bbox, node)) return false;

        var nodesToSearch = [],
            i, len, child, childBBox;

        while (node) {
            for (i = 0, len = node.children.length; i < len; i++) {

                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;

                if (intersects(bbox, childBBox)) {
                    if (node.leaf || contains(bbox, childBBox)) return true;
                    nodesToSearch.push(child);
                }
            }
            node = nodesToSearch.pop();
        }

        return false;
    },

    /**
     * Bulk loads an array of items into the RTree.
     *
     * Bulk loading is significantly more efficient than inserting items one by one when adding large
     * datasets, as it builds an optimally structured tree in a single pass using the OMT algorithm.
     * If the array is smaller than the minimum entry threshold, items are inserted individually instead.
     *
     * @method Phaser.Structs.RTree#load
     * @since 3.0.0
     *
     * @param {any[]} data - An array of items to insert. Each item must have `left`, `top`, `right`, and `bottom` properties.
     *
     * @return {Phaser.Structs.RTree} This RTree instance, for chaining.
     */
    load: function (data)
    {
        if (!(data && data.length)) return this;

        if (data.length < this._minEntries) {
            for (var i = 0, len = data.length; i < len; i++) {
                this.insert(data[i]);
            }
            return this;
        }

        // recursively build the tree with the given data from scratch using OMT algorithm
        var node = this._build(data.slice(), 0, data.length - 1, 0);

        if (!this.data.children.length) {
            // save as is if tree is empty
            this.data = node;

        } else if (this.data.height === node.height) {
            // split root if trees have the same height
            this._splitRoot(this.data, node);

        } else {
            if (this.data.height < node.height) {
                // swap trees if inserted one is bigger
                var tmpNode = this.data;
                this.data = node;
                node = tmpNode;
            }

            // insert the small tree into the large tree at appropriate level
            this._insert(node, this.data.height - node.height - 1, true);
        }

        return this;
    },

    /**
     * Inserts a single item into the RTree.
     *
     * @method Phaser.Structs.RTree#insert
     * @since 3.0.0
     *
     * @param {*} item - The item to insert. Must have `left`, `top`, `right`, and `bottom` properties.
     *
     * @return {Phaser.Structs.RTree} This RTree instance, for chaining.
     */
    insert: function (item)
    {
        if (item) this._insert(item, this.data.height - 1);
        return this;
    },

    /**
     * Removes all items from the RTree, resetting it to an empty state.
     *
     * @method Phaser.Structs.RTree#clear
     * @since 3.0.0
     *
     * @return {Phaser.Structs.RTree} This RTree instance, for chaining.
     */
    clear: function ()
    {
        this.data = createNode([]);
        return this;
    },

    /**
     * Removes a single item from the RTree.
     *
     * An optional equality function can be provided to compare items by value rather than by reference,
     * which is useful when the original item reference is not available. The function receives two items
     * and should return `true` if they are considered equal.
     *
     * @method Phaser.Structs.RTree#remove
     * @since 3.0.0
     *
     * @param {*} item - The item to remove.
     * @param {function} [equalsFn] - An optional custom equality function taking two items and returning a boolean.
     *
     * @return {Phaser.Structs.RTree} This RTree instance, for chaining.
     */
    remove: function (item, equalsFn)
    {
        if (!item) return this;

        var node = this.data,
            bbox = this.toBBox(item),
            path = [],
            indexes = [],
            i, parent, index, goingUp;

        // depth-first iterative tree traversal
        while (node || path.length) {

            if (!node) { // go up
                node = path.pop();
                parent = path[path.length - 1];
                i = indexes.pop();
                goingUp = true;
            }

            if (node.leaf) { // check current node
                index = findItem(item, node.children, equalsFn);

                if (index !== -1) {
                    // item found, remove the item and condense tree upwards
                    node.children.splice(index, 1);
                    path.push(node);
                    this._condense(path);
                    return this;
                }
            }

            if (!goingUp && !node.leaf && contains(node, bbox)) { // go down
                path.push(node);
                indexes.push(i);
                i = 0;
                parent = node;
                node = node.children[0];

            } else if (parent) { // go right
                i++;
                node = parent.children[i];
                goingUp = false;

            } else node = null; // nothing found
        }

        return this;
    },

    toBBox: function (item) { return item; },

    compareMinX: compareNodeMinX,
    compareMinY: compareNodeMinY,

    /**
     * Returns the raw internal tree data as a JSON-compatible object.
     *
     * The returned value can be passed to `fromJSON` to restore the tree state at a later point.
     *
     * @method Phaser.Structs.RTree#toJSON
     * @since 3.0.0
     *
     * @return {Object} The internal tree data object.
     */
    toJSON: function () { return this.data; },

    /**
     * Populates this RTree with data previously exported via `toJSON`.
     *
     * This allows a tree to be serialized and restored without re-inserting every item individually.
     *
     * @method Phaser.Structs.RTree#fromJSON
     * @since 3.0.0
     *
     * @param {Object} data - The tree data to import, as returned by `toJSON`.
     *
     * @return {Phaser.Structs.RTree} This RTree instance, for chaining.
     */
    fromJSON: function (data)
    {
        this.data = data;
        return this;
    },

    _all: function (node, result)
    {
        var nodesToSearch = [];
        while (node) {
            if (node.leaf) result.push.apply(result, node.children);
            else nodesToSearch.push.apply(nodesToSearch, node.children);

            node = nodesToSearch.pop();
        }
        return result;
    },

    _build: function (items, left, right, height)
    {
        var N = right - left + 1,
            M = this._maxEntries,
            node;

        if (N <= M) {
            // reached leaf level; return leaf
            node = createNode(items.slice(left, right + 1));
            calcBBox(node, this.toBBox);
            return node;
        }

        if (!height) {
            // target height of the bulk-loaded tree
            height = Math.ceil(Math.log(N) / Math.log(M));

            // target number of root entries to maximize storage utilization
            M = Math.ceil(N / Math.pow(M, height - 1));
        }

        node = createNode([]);
        node.leaf = false;
        node.height = height;

        // split the items into M mostly square tiles

        var N2 = Math.ceil(N / M),
            N1 = N2 * Math.ceil(Math.sqrt(M)),
            i, j, right2, right3;

        multiSelect(items, left, right, N1, this.compareMinX);

        for (i = left; i <= right; i += N1) {

            right2 = Math.min(i + N1 - 1, right);

            multiSelect(items, i, right2, N2, this.compareMinY);

            for (j = i; j <= right2; j += N2) {

                right3 = Math.min(j + N2 - 1, right2);

                // pack each entry recursively
                node.children.push(this._build(items, j, right3, height - 1));
            }
        }

        calcBBox(node, this.toBBox);

        return node;
    },

    _chooseSubtree: function (bbox, node, level, path)
    {
        var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;

        while (true) {
            path.push(node);

            if (node.leaf || path.length - 1 === level) break;

            minArea = minEnlargement = Infinity;

            for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                area = bboxArea(child);
                enlargement = enlargedArea(bbox, child) - area;

                // choose entry with the least area enlargement
                if (enlargement < minEnlargement) {
                    minEnlargement = enlargement;
                    minArea = area < minArea ? area : minArea;
                    targetNode = child;

                } else if (enlargement === minEnlargement) {
                    // otherwise choose one with the smallest area
                    if (area < minArea) {
                        minArea = area;
                        targetNode = child;
                    }
                }
            }

            node = targetNode || node.children[0];
        }

        return node;
    },

    _insert: function (item, level, isNode)
    {
        var toBBox = this.toBBox,
            bbox = isNode ? item : toBBox(item),
            insertPath = [];

        // find the best node for accommodating the item, saving all nodes along the path too
        var node = this._chooseSubtree(bbox, this.data, level, insertPath);

        // put the item into the node
        node.children.push(item);
        extend(node, bbox);

        // split on node overflow; propagate upwards if necessary
        while (level >= 0) {
            if (insertPath[level].children.length > this._maxEntries) {
                this._split(insertPath, level);
                level--;
            } else break;
        }

        // adjust bboxes along the insertion path
        this._adjustParentBBoxes(bbox, insertPath, level);
    },

    // split overflowed node into two
    _split: function (insertPath, level)
    {
        var node = insertPath[level],
            M = node.children.length,
            m = this._minEntries;

        this._chooseSplitAxis(node, m, M);

        var splitIndex = this._chooseSplitIndex(node, m, M);

        var newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
        newNode.height = node.height;
        newNode.leaf = node.leaf;

        calcBBox(node, this.toBBox);
        calcBBox(newNode, this.toBBox);

        if (level) insertPath[level - 1].children.push(newNode);
        else this._splitRoot(node, newNode);
    },

    _splitRoot: function (node, newNode)
    {
        // split root node
        this.data = createNode([node, newNode]);
        this.data.height = node.height + 1;
        this.data.leaf = false;
        calcBBox(this.data, this.toBBox);
    },

    _chooseSplitIndex: function (node, m, M)
    {
        var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;

        minOverlap = minArea = Infinity;

        for (i = m; i <= M - m; i++) {
            bbox1 = distBBox(node, 0, i, this.toBBox);
            bbox2 = distBBox(node, i, M, this.toBBox);

            overlap = intersectionArea(bbox1, bbox2);
            area = bboxArea(bbox1) + bboxArea(bbox2);

            // choose distribution with minimum overlap
            if (overlap < minOverlap) {
                minOverlap = overlap;
                index = i;

                minArea = area < minArea ? area : minArea;

            } else if (overlap === minOverlap) {
                // otherwise choose distribution with minimum area
                if (area < minArea) {
                    minArea = area;
                    index = i;
                }
            }
        }

        return index;
    },

    // sorts node children by the best axis for split
    _chooseSplitAxis: function (node, m, M)
    {
        var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX,
            compareMinY = node.leaf ? this.compareMinY : compareNodeMinY,
            xMargin = this._allDistMargin(node, m, M, compareMinX),
            yMargin = this._allDistMargin(node, m, M, compareMinY);

        // if total distributions margin value is minimal for x, sort by minX,
        // otherwise it's already sorted by minY
        if (xMargin < yMargin) node.children.sort(compareMinX);
    },

    // total margin of all possible split distributions where each node is at least m full
    _allDistMargin: function (node, m, M, compare)
    {
        node.children.sort(compare);

        var toBBox = this.toBBox,
            leftBBox = distBBox(node, 0, m, toBBox),
            rightBBox = distBBox(node, M - m, M, toBBox),
            margin = bboxMargin(leftBBox) + bboxMargin(rightBBox),
            i, child;

        for (i = m; i < M - m; i++) {
            child = node.children[i];
            extend(leftBBox, node.leaf ? toBBox(child) : child);
            margin += bboxMargin(leftBBox);
        }

        for (i = M - m - 1; i >= m; i--) {
            child = node.children[i];
            extend(rightBBox, node.leaf ? toBBox(child) : child);
            margin += bboxMargin(rightBBox);
        }

        return margin;
    },

    _adjustParentBBoxes: function (bbox, path, level)
    {
        // adjust bboxes along the given tree path
        for (var i = level; i >= 0; i--) {
            extend(path[i], bbox);
        }
    },

    _condense: function (path)
    {
        // go through the path, removing empty nodes and updating bboxes
        for (var i = path.length - 1, siblings; i >= 0; i--) {
            if (path[i].children.length === 0) {
                if (i > 0) {
                    siblings = path[i - 1].children;
                    siblings.splice(siblings.indexOf(path[i]), 1);

                } else this.clear();

            } else calcBBox(path[i], this.toBBox);
        }
    },

    /**
     * Comparator function used to sort items by their minimum X boundary (`left` property).
     *
     * Returns a negative number if `a` should sort before `b`, a positive number if after, or zero if equal.
     *
     * @method Phaser.Structs.RTree#compareMinX
     * @since 3.0.0
     *
     * @param {Object} a - The first item to compare.
     * @param {Object} b - The second item to compare.
     *
     * @return {number} The difference between the `left` values of the two items.
     */
    compareMinX: function (a, b)
    {
        return a.left - b.left;
    },

    /**
     * Comparator function used to sort items by their minimum Y boundary (`top` property).
     *
     * Returns a negative number if `a` should sort before `b`, a positive number if after, or zero if equal.
     *
     * @method Phaser.Structs.RTree#compareMinY
     * @since 3.0.0
     *
     * @param {Object} a - The first item to compare.
     * @param {Object} b - The second item to compare.
     *
     * @return {number} The difference between the `top` values of the two items.
     */
    compareMinY: function (a, b)
    {
        return a.top - b.top;
    },

    /**
     * Converts a Phaser-style bounds object into the internal bounding box format used by the RTree.
     *
     * Maps the `left`, `top`, `right`, and `bottom` properties of the input to `minX`, `minY`, `maxX`,
     * and `maxY` respectively, which is the format expected by the R-tree algorithms.
     *
     * @method Phaser.Structs.RTree#toBBox
     * @since 3.0.0
     *
     * @param {Object} a - The object to convert. Must have `left`, `top`, `right`, and `bottom` properties.
     *
     * @return {Object} A bounding box object with `minX`, `minY`, `maxX`, and `maxY` properties.
     */
    toBBox: function (a)
    {
        return {
            minX: a.left,
            minY: a.top,
            maxX: a.right,
            maxY: a.bottom
        };
    }
};

function findItem (item, items, equalsFn)
{
    if (!equalsFn) return items.indexOf(item);

    for (var i = 0; i < items.length; i++) {
        if (equalsFn(item, items[i])) return i;
    }
    return -1;
}

// calculate node's bbox from bboxes of its children
function calcBBox (node, toBBox)
{
    distBBox(node, 0, node.children.length, toBBox, node);
}

// min bounding rectangle of node children from k to p-1
function distBBox (node, k, p, toBBox, destNode)
{
    if (!destNode) destNode = createNode(null);
    destNode.minX = Infinity;
    destNode.minY = Infinity;
    destNode.maxX = -Infinity;
    destNode.maxY = -Infinity;

    for (var i = k, child; i < p; i++) {
        child = node.children[i];
        extend(destNode, node.leaf ? toBBox(child) : child);
    }

    return destNode;
}

function extend (a, b)
{
    a.minX = Math.min(a.minX, b.minX);
    a.minY = Math.min(a.minY, b.minY);
    a.maxX = Math.max(a.maxX, b.maxX);
    a.maxY = Math.max(a.maxY, b.maxY);
    return a;
}

function compareNodeMinX (a, b) { return a.minX - b.minX; }
function compareNodeMinY (a, b) { return a.minY - b.minY; }

function bboxArea (a) { return (a.maxX - a.minX) * (a.maxY - a.minY); }
function bboxMargin (a) { return (a.maxX - a.minX) + (a.maxY - a.minY); }

function enlargedArea (a, b)
{
    return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
           (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
}

function intersectionArea (a, b)
{
    var minX = Math.max(a.minX, b.minX),
        minY = Math.max(a.minY, b.minY),
        maxX = Math.min(a.maxX, b.maxX),
        maxY = Math.min(a.maxY, b.maxY);

    return Math.max(0, maxX - minX) *
           Math.max(0, maxY - minY);
}

function contains (a, b)
{
    return a.minX <= b.minX &&
           a.minY <= b.minY &&
           b.maxX <= a.maxX &&
           b.maxY <= a.maxY;
}

function intersects (a, b)
{
    return b.minX <= a.maxX &&
           b.minY <= a.maxY &&
           b.maxX >= a.minX &&
           b.maxY >= a.minY;
}

function createNode (children)
{
    return {
        children: children,
        height: 1,
        leaf: true,
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity
    };
}

// sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
// combines selection algorithm with binary divide & conquer approach

function multiSelect (arr, left, right, n, compare)
{
    var stack = [left, right],
        mid;

    while (stack.length)
    {
        right = stack.pop();
        left = stack.pop();

        if (right - left <= n) continue;

        mid = left + Math.ceil((right - left) / n / 2) * n;
        quickselect(arr, mid, left, right, compare);

        stack.push(left, mid, mid, right);
    }
}

module.exports = rbush;
