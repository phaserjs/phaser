var RTree = require('../../src/structs/RTree');

describe('RTree', function ()
{
    function makeItem (left, top, right, bottom)
    {
        return { left: left, top: top, right: right, bottom: bottom };
    }

    function makeBBox (minX, minY, maxX, maxY)
    {
        return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
    }

    describe('constructor', function ()
    {
        it('should create an instance with default maxEntries', function ()
        {
            var tree = new RTree();
            expect(tree._maxEntries).toBe(9);
        });

        it('should create an instance with custom maxEntries', function ()
        {
            var tree = new RTree(16);
            expect(tree._maxEntries).toBe(16);
        });

        it('should enforce a minimum maxEntries of 4', function ()
        {
            var tree = new RTree(2);
            expect(tree._maxEntries).toBe(4);
        });

        it('should set minEntries to at least 2', function ()
        {
            var tree = new RTree();
            expect(tree._minEntries).toBeGreaterThanOrEqual(2);
        });

        it('should set minEntries to 40% of maxEntries', function ()
        {
            var tree = new RTree(10);
            expect(tree._minEntries).toBe(4);
        });

        it('should start with empty data', function ()
        {
            var tree = new RTree();
            expect(tree.data).toBeDefined();
            expect(tree.data.children).toBeDefined();
            expect(tree.data.children.length).toBe(0);
        });

        it('should work without new keyword', function ()
        {
            var tree = RTree();
            expect(tree).toBeInstanceOf(RTree);
        });
    });

    describe('clear', function ()
    {
        it('should remove all items from the tree', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            tree.insert(makeItem(20, 20, 30, 30));
            tree.clear();
            expect(tree.all().length).toBe(0);
        });

        it('should return the tree instance for chaining', function ()
        {
            var tree = new RTree();
            var result = tree.clear();
            expect(result).toBe(tree);
        });

        it('should reset the data node', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            tree.clear();
            expect(tree.data.children.length).toBe(0);
            expect(tree.data.leaf).toBe(true);
            expect(tree.data.height).toBe(1);
        });
    });

    describe('insert', function ()
    {
        it('should insert a single item', function ()
        {
            var tree = new RTree();
            var item = makeItem(0, 0, 10, 10);
            tree.insert(item);
            expect(tree.all().length).toBe(1);
        });

        it('should return the tree instance for chaining', function ()
        {
            var tree = new RTree();
            var result = tree.insert(makeItem(0, 0, 10, 10));
            expect(result).toBe(tree);
        });

        it('should ignore null/undefined items', function ()
        {
            var tree = new RTree();
            tree.insert(null);
            tree.insert(undefined);
            expect(tree.all().length).toBe(0);
        });

        it('should insert multiple items correctly', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            tree.insert(makeItem(20, 20, 30, 30));
            tree.insert(makeItem(5, 5, 15, 15));
            expect(tree.all().length).toBe(3);
        });

        it('should preserve the inserted item reference', function ()
        {
            var tree = new RTree();
            var item = makeItem(5, 5, 15, 15);
            tree.insert(item);
            var all = tree.all();
            expect(all[0]).toBe(item);
        });
    });

    describe('all', function ()
    {
        it('should return an empty array when tree is empty', function ()
        {
            var tree = new RTree();
            var result = tree.all();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        it('should return all inserted items', function ()
        {
            var tree = new RTree();
            var items = [
                makeItem(0, 0, 10, 10),
                makeItem(20, 20, 30, 30),
                makeItem(50, 50, 60, 60)
            ];
            tree.load(items);
            expect(tree.all().length).toBe(3);
        });

        it('should return a flat array regardless of tree structure', function ()
        {
            var tree = new RTree();
            for (var i = 0; i < 20; i++)
            {
                tree.insert(makeItem(i * 10, i * 10, i * 10 + 5, i * 10 + 5));
            }
            expect(tree.all().length).toBe(20);
        });
    });

    describe('search', function ()
    {
        it('should return an empty array when tree is empty', function ()
        {
            var tree = new RTree();
            var result = tree.search(makeBBox(0, 0, 100, 100));
            expect(result.length).toBe(0);
        });

        it('should return items that intersect the bounding box', function ()
        {
            var tree = new RTree();
            var item1 = makeItem(0, 0, 10, 10);
            var item2 = makeItem(50, 50, 60, 60);
            tree.insert(item1);
            tree.insert(item2);

            var result = tree.search(makeBBox(0, 0, 20, 20));
            expect(result.length).toBe(1);
            expect(result[0]).toBe(item1);
        });

        it('should return all items when bbox contains the entire tree', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            tree.insert(makeItem(20, 20, 30, 30));
            tree.insert(makeItem(50, 50, 60, 60));

            var result = tree.search(makeBBox(-100, -100, 200, 200));
            expect(result.length).toBe(3);
        });

        it('should return no items when bbox does not intersect any item', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            tree.insert(makeItem(20, 20, 30, 30));

            var result = tree.search(makeBBox(100, 100, 200, 200));
            expect(result.length).toBe(0);
        });

        it('should return multiple items that intersect the bbox', function ()
        {
            var tree = new RTree();
            var item1 = makeItem(0, 0, 10, 10);
            var item2 = makeItem(5, 5, 15, 15);
            var item3 = makeItem(100, 100, 200, 200);
            tree.insert(item1);
            tree.insert(item2);
            tree.insert(item3);

            var result = tree.search(makeBBox(0, 0, 20, 20));
            expect(result.length).toBe(2);
        });

        it('should find items that partially overlap the bbox', function ()
        {
            var tree = new RTree();
            var item = makeItem(5, 5, 15, 15);
            tree.insert(item);

            var result = tree.search(makeBBox(0, 0, 10, 10));
            expect(result.length).toBe(1);
        });

        it('should work correctly with a large number of items', function ()
        {
            var tree = new RTree();
            var items = [];
            for (var i = 0; i < 50; i++)
            {
                var item = makeItem(i * 10, i * 10, i * 10 + 8, i * 10 + 8);
                items.push(item);
            }
            tree.load(items);

            var result = tree.search(makeBBox(0, 0, 49, 49));
            expect(result.length).toBe(5);
        });
    });

    describe('collides', function ()
    {
        it('should return false when tree is empty', function ()
        {
            var tree = new RTree();
            expect(tree.collides(makeBBox(0, 0, 100, 100))).toBe(false);
        });

        it('should return true when an item intersects the bbox', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            expect(tree.collides(makeBBox(5, 5, 15, 15))).toBe(true);
        });

        it('should return false when no item intersects the bbox', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            expect(tree.collides(makeBBox(100, 100, 200, 200))).toBe(false);
        });

        it('should return true even if only one of many items intersects', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            tree.insert(makeItem(20, 20, 30, 30));
            tree.insert(makeItem(40, 40, 50, 50));

            expect(tree.collides(makeBBox(25, 25, 35, 35))).toBe(true);
        });

        it('should return false when bbox is between items', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            tree.insert(makeItem(40, 40, 50, 50));

            expect(tree.collides(makeBBox(15, 15, 35, 35))).toBe(false);
        });
    });

    describe('load', function ()
    {
        it('should bulk-load multiple items', function ()
        {
            var tree = new RTree();
            var items = [
                makeItem(0, 0, 10, 10),
                makeItem(20, 20, 30, 30),
                makeItem(40, 40, 50, 50)
            ];
            tree.load(items);
            expect(tree.all().length).toBe(3);
        });

        it('should return the tree instance for chaining', function ()
        {
            var tree = new RTree();
            var result = tree.load([makeItem(0, 0, 10, 10)]);
            expect(result).toBe(tree);
        });

        it('should handle empty array gracefully', function ()
        {
            var tree = new RTree();
            tree.load([]);
            expect(tree.all().length).toBe(0);
        });

        it('should handle null/undefined gracefully', function ()
        {
            var tree = new RTree();
            tree.load(null);
            tree.load(undefined);
            expect(tree.all().length).toBe(0);
        });

        it('should load items that are below minEntries threshold individually', function ()
        {
            var tree = new RTree();
            var item = makeItem(0, 0, 10, 10);
            tree.load([item]);
            expect(tree.all().length).toBe(1);
        });

        it('should merge with existing items when loading into non-empty tree', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            tree.load([
                makeItem(20, 20, 30, 30),
                makeItem(40, 40, 50, 50),
                makeItem(60, 60, 70, 70),
                makeItem(80, 80, 90, 90),
                makeItem(100, 100, 110, 110)
            ]);
            expect(tree.all().length).toBe(6);
        });

        it('should produce a searchable tree after bulk load', function ()
        {
            var tree = new RTree();
            var items = [];
            for (var i = 0; i < 30; i++)
            {
                items.push(makeItem(i * 10, i * 10, i * 10 + 8, i * 10 + 8));
            }
            tree.load(items);

            var result = tree.search(makeBBox(0, 0, 25, 25));
            expect(result.length).toBe(3);
        });
    });

    describe('remove', function ()
    {
        it('should remove an inserted item', function ()
        {
            var tree = new RTree();
            var item = makeItem(0, 0, 10, 10);
            tree.insert(item);
            tree.remove(item);
            expect(tree.all().length).toBe(0);
        });

        it('should return the tree instance for chaining', function ()
        {
            var tree = new RTree();
            var item = makeItem(0, 0, 10, 10);
            tree.insert(item);
            var result = tree.remove(item);
            expect(result).toBe(tree);
        });

        it('should handle removing null gracefully', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            tree.remove(null);
            expect(tree.all().length).toBe(1);
        });

        it('should not affect other items when removing one', function ()
        {
            var tree = new RTree();
            var item1 = makeItem(0, 0, 10, 10);
            var item2 = makeItem(20, 20, 30, 30);
            tree.insert(item1);
            tree.insert(item2);
            tree.remove(item1);
            expect(tree.all().length).toBe(1);
            expect(tree.all()[0]).toBe(item2);
        });

        it('should handle removing an item not in the tree gracefully', function ()
        {
            var tree = new RTree();
            var item = makeItem(0, 0, 10, 10);
            var notInserted = makeItem(50, 50, 60, 60);
            tree.insert(item);
            tree.remove(notInserted);
            expect(tree.all().length).toBe(1);
        });

        it('should support custom equality function', function ()
        {
            var tree = new RTree();
            var item1 = makeItem(0, 0, 10, 10);
            item1.id = 'a';
            var item2 = makeItem(0, 0, 10, 10);
            item2.id = 'b';
            tree.insert(item1);
            tree.insert(item2);

            var toRemove = makeItem(0, 0, 10, 10);
            toRemove.id = 'a';

            tree.remove(toRemove, function (a, b)
            {
                return a.id === b.id;
            });

            var remaining = tree.all();
            expect(remaining.length).toBe(1);
            expect(remaining[0].id).toBe('b');
        });

        it('should remove items loaded via bulk load', function ()
        {
            var tree = new RTree();
            var items = [];
            for (var i = 0; i < 20; i++)
            {
                items.push(makeItem(i * 10, i * 10, i * 10 + 8, i * 10 + 8));
            }
            tree.load(items);
            tree.remove(items[0]);
            expect(tree.all().length).toBe(19);
        });
    });

    describe('toJSON', function ()
    {
        it('should return the internal data object', function ()
        {
            var tree = new RTree();
            var json = tree.toJSON();
            expect(json).toBe(tree.data);
        });

        it('should reflect the current state of the tree', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            var json = tree.toJSON();
            expect(json.children).toBeDefined();
        });
    });

    describe('fromJSON', function ()
    {
        it('should restore tree from exported JSON data', function ()
        {
            var tree1 = new RTree();
            tree1.insert(makeItem(0, 0, 10, 10));
            tree1.insert(makeItem(20, 20, 30, 30));

            var json = tree1.toJSON();

            var tree2 = new RTree();
            tree2.fromJSON(json);

            expect(tree2.all().length).toBe(2);
        });

        it('should return the tree instance for chaining', function ()
        {
            var tree = new RTree();
            var result = tree.fromJSON(tree.toJSON());
            expect(result).toBe(tree);
        });

        it('should allow searching after fromJSON restore', function ()
        {
            var tree1 = new RTree();
            var item = makeItem(5, 5, 15, 15);
            tree1.insert(item);

            var tree2 = new RTree();
            tree2.fromJSON(tree1.toJSON());

            var result = tree2.search(makeBBox(0, 0, 20, 20));
            expect(result.length).toBe(1);
        });
    });

    describe('compareMinX', function ()
    {
        it('should return negative when a.left < b.left', function ()
        {
            var tree = new RTree();
            var a = makeItem(5, 0, 10, 10);
            var b = makeItem(10, 0, 20, 10);
            expect(tree.compareMinX(a, b)).toBeLessThan(0);
        });

        it('should return positive when a.left > b.left', function ()
        {
            var tree = new RTree();
            var a = makeItem(20, 0, 30, 10);
            var b = makeItem(5, 0, 15, 10);
            expect(tree.compareMinX(a, b)).toBeGreaterThan(0);
        });

        it('should return zero when a.left === b.left', function ()
        {
            var tree = new RTree();
            var a = makeItem(10, 0, 20, 10);
            var b = makeItem(10, 5, 25, 15);
            expect(tree.compareMinX(a, b)).toBe(0);
        });
    });

    describe('compareMinY', function ()
    {
        it('should return negative when a.top < b.top', function ()
        {
            var tree = new RTree();
            var a = makeItem(0, 5, 10, 10);
            var b = makeItem(0, 10, 10, 20);
            expect(tree.compareMinY(a, b)).toBeLessThan(0);
        });

        it('should return positive when a.top > b.top', function ()
        {
            var tree = new RTree();
            var a = makeItem(0, 20, 10, 30);
            var b = makeItem(0, 5, 10, 15);
            expect(tree.compareMinY(a, b)).toBeGreaterThan(0);
        });

        it('should return zero when a.top === b.top', function ()
        {
            var tree = new RTree();
            var a = makeItem(0, 10, 10, 20);
            var b = makeItem(5, 10, 15, 25);
            expect(tree.compareMinY(a, b)).toBe(0);
        });
    });

    describe('toBBox', function ()
    {
        it('should convert left/top/right/bottom to minX/minY/maxX/maxY', function ()
        {
            var tree = new RTree();
            var item = makeItem(10, 20, 30, 40);
            var bbox = tree.toBBox(item);
            expect(bbox.minX).toBe(10);
            expect(bbox.minY).toBe(20);
            expect(bbox.maxX).toBe(30);
            expect(bbox.maxY).toBe(40);
        });

        it('should return a new object', function ()
        {
            var tree = new RTree();
            var item = makeItem(0, 0, 10, 10);
            var bbox = tree.toBBox(item);
            expect(bbox).not.toBe(item);
        });

        it('should handle zero values', function ()
        {
            var tree = new RTree();
            var item = makeItem(0, 0, 0, 0);
            var bbox = tree.toBBox(item);
            expect(bbox.minX).toBe(0);
            expect(bbox.minY).toBe(0);
            expect(bbox.maxX).toBe(0);
            expect(bbox.maxY).toBe(0);
        });

        it('should handle negative values', function ()
        {
            var tree = new RTree();
            var item = makeItem(-20, -30, -10, -5);
            var bbox = tree.toBBox(item);
            expect(bbox.minX).toBe(-20);
            expect(bbox.minY).toBe(-30);
            expect(bbox.maxX).toBe(-10);
            expect(bbox.maxY).toBe(-5);
        });
    });

    describe('integration', function ()
    {
        it('should correctly search after insert and remove operations', function ()
        {
            var tree = new RTree();
            var item1 = makeItem(0, 0, 10, 10);
            var item2 = makeItem(5, 5, 15, 15);
            var item3 = makeItem(50, 50, 60, 60);

            tree.insert(item1);
            tree.insert(item2);
            tree.insert(item3);

            var result = tree.search(makeBBox(0, 0, 20, 20));
            expect(result.length).toBe(2);

            tree.remove(item1);
            result = tree.search(makeBBox(0, 0, 20, 20));
            expect(result.length).toBe(1);
            expect(result[0]).toBe(item2);
        });

        it('should handle clear followed by new inserts', function ()
        {
            var tree = new RTree();
            tree.insert(makeItem(0, 0, 10, 10));
            tree.insert(makeItem(20, 20, 30, 30));
            tree.clear();

            var newItem = makeItem(5, 5, 15, 15);
            tree.insert(newItem);

            expect(tree.all().length).toBe(1);
            expect(tree.all()[0]).toBe(newItem);
        });

        it('should round-trip correctly through toJSON and fromJSON', function ()
        {
            var tree1 = new RTree();
            var items = [];
            for (var i = 0; i < 10; i++)
            {
                var item = makeItem(i * 10, i * 10, i * 10 + 8, i * 10 + 8);
                items.push(item);
            }
            tree1.load(items);

            var tree2 = new RTree();
            tree2.fromJSON(tree1.toJSON());

            expect(tree2.all().length).toBe(10);
            expect(tree2.collides(makeBBox(0, 0, 15, 15))).toBe(true);
            expect(tree2.collides(makeBBox(500, 500, 600, 600))).toBe(false);
        });

        it('should support method chaining', function ()
        {
            var tree = new RTree();
            var item1 = makeItem(0, 0, 10, 10);
            var item2 = makeItem(20, 20, 30, 30);

            var result = tree.insert(item1).insert(item2).clear().insert(item1);
            expect(result).toBe(tree);
            expect(tree.all().length).toBe(1);
        });
    });
});
