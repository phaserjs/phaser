var Group = require('../../../src/gameobjects/group/Group');

function createMockScene ()
{
    return {
        sys: {
            updateList: {
                add: vi.fn(),
                remove: vi.fn()
            },
            displayList: {}
        }
    };
}

function MockChild (active)
{
    this.active = (active !== undefined) ? active : true;
    this.visible = true;
    this.x = 0;
    this.y = 0;
    this.alpha = 1;
    this.depth = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.on = vi.fn();
    this.off = vi.fn();
    this.emit = vi.fn();
    this.setActive = function (val) { this.active = val; return this; };
    this.setVisible = function (val) { this.visible = val; return this; };
    this.update = vi.fn();
    this.destroy = vi.fn();
    this.removeFromDisplayList = vi.fn();
    this.removeFromUpdateList = vi.fn();
}

function createMockChild (active)
{
    return new MockChild(active);
}

function createMockClassType ()
{
    return function MockClassType (scene, x, y, key, frame)
    {
        this.scene = scene;
        this.x = x || 0;
        this.y = y || 0;
        this.key = key || null;
        this.frame = frame || null;
        this.active = true;
        this.visible = true;
        this.alpha = 1;
        this.depth = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.on = vi.fn();
        this.off = vi.fn();
        this.emit = vi.fn();
        this.setActive = function (val) { this.active = val; return this; };
        this.setVisible = function (val) { this.visible = val; return this; };
        this.destroy = vi.fn();
        this.addToDisplayList = vi.fn();
        this.addToUpdateList = vi.fn();
        this.removeFromDisplayList = vi.fn();
        this.removeFromUpdateList = vi.fn();
        this.update = vi.fn();
    };
}

describe('Group', function ()
{
    var scene;

    beforeEach(function ()
    {
        scene = createMockScene();
    });

    describe('constructor', function ()
    {
        it('should create a group with default property values', function ()
        {
            var group = new Group(scene);

            expect(group.scene).toBe(scene);
            expect(group.isParent).toBe(true);
            expect(group.type).toBe('Group');
            expect(group.name).toBe('');
            expect(group.active).toBe(true);
            expect(group.maxSize).toBe(-1);
            expect(group.defaultKey).toBeNull();
            expect(group.defaultFrame).toBeNull();
            expect(group.runChildUpdate).toBe(false);
            expect(group.createCallback).toBeNull();
            expect(group.removeCallback).toBeNull();
            expect(group.createMultipleCallback).toBeNull();
        });

        it('should start with an empty children set', function ()
        {
            var group = new Group(scene);

            expect(group.children).toBeDefined();
            expect(group.children.size).toBe(0);
        });

        it('should apply config options', function ()
        {
            var cb = function () {};
            var group = new Group(scene, null, {
                name: 'bullets',
                active: false,
                maxSize: 10,
                defaultKey: 'bullet',
                defaultFrame: 0,
                runChildUpdate: true,
                createCallback: cb
            });

            expect(group.name).toBe('bullets');
            expect(group.active).toBe(false);
            expect(group.maxSize).toBe(10);
            expect(group.defaultKey).toBe('bullet');
            expect(group.defaultFrame).toBe(0);
            expect(group.runChildUpdate).toBe(true);
            expect(group.createCallback).toBe(cb);
        });

        it('should accept a plain object as the children argument and treat it as config', function ()
        {
            var group = new Group(scene, { name: 'fromConfig', maxSize: 5 });

            expect(group.name).toBe('fromConfig');
            expect(group.maxSize).toBe(5);
        });

        it('should add children passed as an array', function ()
        {
            var child1 = createMockChild();
            var child2 = createMockChild();

            var group = new Group(scene, [ child1, child2 ]);

            expect(group.getLength()).toBe(2);
            expect(group.contains(child1)).toBe(true);
            expect(group.contains(child2)).toBe(true);
        });
    });

    describe('add', function ()
    {
        it('should add a child to the group', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();

            group.add(child);

            expect(group.contains(child)).toBe(true);
            expect(group.getLength()).toBe(1);
        });

        it('should return this for chaining', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();

            var result = group.add(child);

            expect(result).toBe(group);
        });

        it('should call createCallback when adding a child', function ()
        {
            var called = false;
            var calledWith = null;
            var group = new Group(scene, null, {
                createCallback: function (child)
                {
                    called = true;
                    calledWith = child;
                }
            });
            var child = createMockChild();

            group.add(child);

            expect(called).toBe(true);
            expect(calledWith).toBe(child);
        });

        it('should not add beyond maxSize', function ()
        {
            var group = new Group(scene, null, { maxSize: 2 });
            var child1 = createMockChild();
            var child2 = createMockChild();
            var child3 = createMockChild();

            group.add(child1);
            group.add(child2);
            group.add(child3);

            expect(group.getLength()).toBe(2);
            expect(group.contains(child3)).toBe(false);
        });

        it('should register a DESTROY listener on the child', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();

            group.add(child);

            expect(child.on).toHaveBeenCalled();
        });
    });

    describe('addMultiple', function ()
    {
        it('should add multiple children at once', function ()
        {
            var group = new Group(scene);
            var children = [ createMockChild(), createMockChild(), createMockChild() ];

            group.addMultiple(children);

            expect(group.getLength()).toBe(3);
        });

        it('should return this for chaining', function ()
        {
            var group = new Group(scene);

            var result = group.addMultiple([]);

            expect(result).toBe(group);
        });
    });

    describe('remove', function ()
    {
        it('should remove a child from the group', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();

            group.add(child);
            group.remove(child);

            expect(group.contains(child)).toBe(false);
            expect(group.getLength()).toBe(0);
        });

        it('should return this for chaining', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();

            group.add(child);

            var result = group.remove(child);

            expect(result).toBe(group);
        });

        it('should call removeCallback when removing a child', function ()
        {
            var calledWith = null;
            var group = new Group(scene, null, {
                removeCallback: function (child)
                {
                    calledWith = child;
                }
            });
            var child = createMockChild();

            group.add(child);
            group.remove(child);

            expect(calledWith).toBe(child);
        });

        it('should do nothing if the child is not in the group', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();
            var other = createMockChild();

            group.add(child);
            group.remove(other);

            expect(group.getLength()).toBe(1);
        });

        it('should unregister the DESTROY listener from the child', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();

            group.add(child);
            group.remove(child);

            expect(child.off).toHaveBeenCalled();
        });
    });

    describe('clear', function ()
    {
        it('should remove all children', function ()
        {
            var group = new Group(scene);

            group.add(createMockChild());
            group.add(createMockChild());
            group.add(createMockChild());

            group.clear();

            expect(group.getLength()).toBe(0);
        });

        it('should return this for chaining', function ()
        {
            var group = new Group(scene);

            var result = group.clear();

            expect(result).toBe(group);
        });

        it('should call destroy on children when destroyChild is true', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();

            group.add(child);
            group.clear(false, true);

            expect(child.destroy).toHaveBeenCalled();
        });

        it('should call removeFromDisplayList when removeFromScene is true', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();

            group.add(child);
            group.clear(true, false);

            expect(child.removeFromDisplayList).toHaveBeenCalled();
            expect(child.removeFromUpdateList).toHaveBeenCalled();
        });
    });

    describe('contains', function ()
    {
        it('should return true for a member of the group', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();

            group.add(child);

            expect(group.contains(child)).toBe(true);
        });

        it('should return false for a non-member', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();

            expect(group.contains(child)).toBe(false);
        });
    });

    describe('getChildren', function ()
    {
        it('should return an array of all members', function ()
        {
            var group = new Group(scene);
            var child1 = createMockChild();
            var child2 = createMockChild();

            group.add(child1);
            group.add(child2);

            var result = group.getChildren();

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
            expect(result).toContain(child1);
            expect(result).toContain(child2);
        });

        it('should return an empty array when group is empty', function ()
        {
            var group = new Group(scene);

            expect(group.getChildren()).toEqual([]);
        });
    });

    describe('getLength', function ()
    {
        it('should return zero for an empty group', function ()
        {
            var group = new Group(scene);

            expect(group.getLength()).toBe(0);
        });

        it('should return the correct count after adding and removing members', function ()
        {
            var group = new Group(scene);
            var child1 = createMockChild();
            var child2 = createMockChild();

            group.add(child1);
            group.add(child2);
            expect(group.getLength()).toBe(2);

            group.remove(child1);
            expect(group.getLength()).toBe(1);
        });
    });

    describe('isFull', function ()
    {
        it('should return false when maxSize is -1 (unlimited)', function ()
        {
            var group = new Group(scene);

            expect(group.isFull()).toBe(false);
        });

        it('should return false when group has fewer members than maxSize', function ()
        {
            var group = new Group(scene, null, { maxSize: 5 });

            group.add(createMockChild());
            group.add(createMockChild());

            expect(group.isFull()).toBe(false);
        });

        it('should return true when group has reached maxSize', function ()
        {
            var group = new Group(scene, null, { maxSize: 2 });

            group.add(createMockChild());
            group.add(createMockChild());

            expect(group.isFull()).toBe(true);
        });
    });

    describe('countActive', function ()
    {
        it('should count active members by default', function ()
        {
            var group = new Group(scene);

            group.add(createMockChild(true));
            group.add(createMockChild(true));
            group.add(createMockChild(false));

            expect(group.countActive()).toBe(2);
        });

        it('should count inactive members when passed false', function ()
        {
            var group = new Group(scene);

            group.add(createMockChild(true));
            group.add(createMockChild(false));
            group.add(createMockChild(false));

            expect(group.countActive(false)).toBe(2);
        });

        it('should return zero when group is empty', function ()
        {
            var group = new Group(scene);

            expect(group.countActive()).toBe(0);
        });
    });

    describe('getTotalUsed', function ()
    {
        it('should return the count of active members', function ()
        {
            var group = new Group(scene);

            group.add(createMockChild(true));
            group.add(createMockChild(false));

            expect(group.getTotalUsed()).toBe(1);
        });
    });

    describe('getTotalFree', function ()
    {
        it('should return a large number when maxSize is -1', function ()
        {
            var group = new Group(scene);

            group.add(createMockChild(true));

            expect(group.getTotalFree()).toBeGreaterThan(1000);
        });

        it('should return remaining capacity when maxSize is set', function ()
        {
            var group = new Group(scene, null, { maxSize: 10 });

            group.add(createMockChild(true));
            group.add(createMockChild(true));
            group.add(createMockChild(false));

            // maxSize - active = 10 - 2 = 8
            expect(group.getTotalFree()).toBe(8);
        });
    });

    describe('getMatching', function ()
    {
        it('should return members matching a property value', function ()
        {
            var group = new Group(scene);
            var activeChild = createMockChild(true);
            var inactiveChild = createMockChild(false);

            group.add(activeChild);
            group.add(inactiveChild);

            var result = group.getMatching('active', true);

            expect(result.length).toBe(1);
            expect(result[0]).toBe(activeChild);
        });

        it('should return an empty array when no members match', function ()
        {
            var group = new Group(scene);

            group.add(createMockChild(true));

            var result = group.getMatching('active', false);

            expect(result).toEqual([]);
        });
    });

    describe('getFirst', function ()
    {
        it('should return the first member matching the active state', function ()
        {
            var group = new Group(scene);
            var active1 = createMockChild(true);
            var active2 = createMockChild(true);
            var inactive = createMockChild(false);

            group.add(inactive);
            group.add(active1);
            group.add(active2);

            var result = group.getFirst(true, false);

            expect(result).toBe(active1);
        });

        it('should return null when no member matches and createIfNull is false', function ()
        {
            var group = new Group(scene);

            group.add(createMockChild(true));

            var result = group.getFirst(false, false);

            expect(result).toBeNull();
        });

        it('should assign x and y to the found member', function ()
        {
            var group = new Group(scene);
            var child = createMockChild(true);

            group.add(child);

            group.getFirst(true, false, 100, 200);

            expect(child.x).toBe(100);
            expect(child.y).toBe(200);
        });
    });

    describe('getLast', function ()
    {
        it('should return the last member matching the active state', function ()
        {
            var group = new Group(scene);
            var active1 = createMockChild(true);
            var active2 = createMockChild(true);

            group.add(active1);
            group.add(active2);

            var result = group.getLast(true, false);

            expect(result).toBe(active2);
        });

        it('should return null when no member matches', function ()
        {
            var group = new Group(scene);

            group.add(createMockChild(true));

            var result = group.getLast(false, false);

            expect(result).toBeNull();
        });
    });

    describe('getFirstAlive', function ()
    {
        it('should return the first active member', function ()
        {
            var group = new Group(scene);
            var alive = createMockChild(true);
            var dead = createMockChild(false);

            group.add(alive);
            group.add(dead);

            expect(group.getFirstAlive(false)).toBe(alive);
        });
    });

    describe('getFirstDead', function ()
    {
        it('should return the first inactive member', function ()
        {
            var group = new Group(scene);
            var alive = createMockChild(true);
            var dead = createMockChild(false);

            group.add(alive);
            group.add(dead);

            expect(group.getFirstDead(false)).toBe(dead);
        });
    });

    describe('setActive', function ()
    {
        it('should set the active property of the group', function ()
        {
            var group = new Group(scene);

            group.setActive(false);

            expect(group.active).toBe(false);
        });

        it('should return this for chaining', function ()
        {
            var group = new Group(scene);

            var result = group.setActive(true);

            expect(result).toBe(group);
        });
    });

    describe('setName', function ()
    {
        it('should set the name property of the group', function ()
        {
            var group = new Group(scene);

            group.setName('myGroup');

            expect(group.name).toBe('myGroup');
        });

        it('should return this for chaining', function ()
        {
            var group = new Group(scene);

            var result = group.setName('test');

            expect(result).toBe(group);
        });
    });

    describe('kill', function ()
    {
        it('should deactivate a member of the group', function ()
        {
            var group = new Group(scene);
            var child = createMockChild(true);

            group.add(child);
            group.kill(child);

            expect(child.active).toBe(false);
        });

        it('should not affect objects not in the group', function ()
        {
            var group = new Group(scene);
            var outsider = createMockChild(true);

            group.kill(outsider);

            expect(outsider.active).toBe(true);
        });
    });

    describe('killAndHide', function ()
    {
        it('should deactivate and hide a member of the group', function ()
        {
            var group = new Group(scene);
            var child = createMockChild(true);
            child.visible = true;

            group.add(child);
            group.killAndHide(child);

            expect(child.active).toBe(false);
            expect(child.visible).toBe(false);
        });

        it('should not affect objects not in the group', function ()
        {
            var group = new Group(scene);
            var outsider = createMockChild(true);

            group.killAndHide(outsider);

            expect(outsider.active).toBe(true);
            expect(outsider.visible).toBe(true);
        });
    });

    describe('preUpdate', function ()
    {
        it('should not call child update when runChildUpdate is false', function ()
        {
            var group = new Group(scene, null, { runChildUpdate: false });
            var child = createMockChild(true);

            group.add(child);
            group.preUpdate(100, 16);

            expect(child.update).not.toHaveBeenCalled();
        });

        it('should call update on active children when runChildUpdate is true', function ()
        {
            var group = new Group(scene, null, { runChildUpdate: true });
            var activeChild = createMockChild(true);
            var inactiveChild = createMockChild(false);

            group.add(activeChild);
            group.add(inactiveChild);

            group.preUpdate(100, 16);

            expect(activeChild.update).toHaveBeenCalledWith(100, 16);
            expect(inactiveChild.update).not.toHaveBeenCalled();
        });

        it('should not call update when group has no children', function ()
        {
            var group = new Group(scene, null, { runChildUpdate: true });

            // should not throw
            expect(function () { group.preUpdate(0, 16); }).not.toThrow();
        });
    });

    describe('propertyValueSet', function ()
    {
        it('should set a named property on all children', function ()
        {
            var group = new Group(scene);
            var child1 = createMockChild();
            var child2 = createMockChild();

            group.add(child1);
            group.add(child2);

            group.propertyValueSet('alpha', 0.5);

            expect(child1.alpha).toBe(0.5);
            expect(child2.alpha).toBe(0.5);
        });

        it('should return this for chaining', function ()
        {
            var group = new Group(scene);

            var result = group.propertyValueSet('alpha', 1);

            expect(result).toBe(group);
        });
    });

    describe('propertyValueInc', function ()
    {
        it('should increment a named property on all children', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();
            child.depth = 5;

            group.add(child);

            group.propertyValueInc('depth', 3);

            expect(child.depth).toBe(8);
        });

        it('should return this for chaining', function ()
        {
            var group = new Group(scene);

            var result = group.propertyValueInc('x', 1);

            expect(result).toBe(group);
        });
    });

    describe('setX', function ()
    {
        it('should set x on all children', function ()
        {
            var group = new Group(scene);
            var child1 = createMockChild();
            var child2 = createMockChild();
            child1.x = 0;
            child2.x = 0;

            group.add(child1);
            group.add(child2);

            group.setX(100);

            expect(child1.x).toBe(100);
            expect(child2.x).toBe(100);
        });

        it('should apply step offset per iteration', function ()
        {
            var group = new Group(scene);
            var child1 = createMockChild();
            var child2 = createMockChild();
            child1.x = 0;
            child2.x = 0;

            group.add(child1);
            group.add(child2);

            group.setX(0, 50);

            expect(child1.x).toBe(0);
            expect(child2.x).toBe(50);
        });

        it('should return this for chaining', function ()
        {
            var group = new Group(scene);

            var result = group.setX(0);

            expect(result).toBe(group);
        });
    });

    describe('setY', function ()
    {
        it('should set y on all children', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();
            child.y = 0;

            group.add(child);

            group.setY(200);

            expect(child.y).toBe(200);
        });
    });

    describe('setXY', function ()
    {
        it('should set x and y on all children', function ()
        {
            var group = new Group(scene);
            var child = createMockChild();
            child.x = 0;
            child.y = 0;

            group.add(child);

            group.setXY(50, 75);

            expect(child.x).toBe(50);
            expect(child.y).toBe(75);
        });

        it('should return this for chaining', function ()
        {
            var group = new Group(scene);

            var result = group.setXY(0, 0);

            expect(result).toBe(group);
        });
    });

    describe('create', function ()
    {
        it('should return null when the group is full', function ()
        {
            var MockType = createMockClassType();
            var group = new Group(scene, null, { maxSize: 0, classType: MockType });

            var result = group.create(0, 0, 'key');

            expect(result).toBeNull();
        });

        it('should create an instance of classType and add it to the group', function ()
        {
            var MockType = createMockClassType();
            var group = new Group(scene, null, { classType: MockType });

            var result = group.create(10, 20, 'testKey');

            expect(result).toBeInstanceOf(MockType);
            expect(result.x).toBe(10);
            expect(result.y).toBe(20);
            expect(result.key).toBe('testKey');
            expect(group.getLength()).toBe(1);
        });
    });

    describe('destroy', function ()
    {
        it('should clear all children and unset scene', function ()
        {
            var group = new Group(scene);

            group.add(createMockChild());
            group.add(createMockChild());

            group.destroy();

            expect(group.scene).toBeUndefined();
            expect(group.children).toBeUndefined();
        });

        it('should not throw if called on an already-destroyed group', function ()
        {
            var group = new Group(scene);

            group.destroy();

            expect(function () { group.destroy(); }).not.toThrow();
        });
    });
});
