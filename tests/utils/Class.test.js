var Class = require('../../src/utils/Class');

describe('Phaser.Class', function ()
{
    describe('basic class creation', function ()
    {
        it('should create a class with no definition', function ()
        {
            var MyClass = new Class({});
            var instance = new MyClass();
            expect(instance).toBeDefined();
        });

        it('should create a class when definition is omitted', function ()
        {
            var MyClass = new Class();
            var instance = new MyClass();
            expect(instance).toBeDefined();
        });

        it('should return a constructor function', function ()
        {
            var MyClass = new Class({});
            expect(typeof MyClass).toBe('function');
        });

        it('should set the prototype constructor correctly', function ()
        {
            var MyClass = new Class({});
            expect(MyClass.prototype.constructor).toBe(MyClass);
        });
    });

    describe('initialize', function ()
    {
        it('should use the initialize function as the constructor', function ()
        {
            var MyClass = new Class({
                initialize: function ()
                {
                    this.value = 42;
                }
            });

            var instance = new MyClass();
            expect(instance.value).toBe(42);
        });

        it('should pass constructor arguments through initialize', function ()
        {
            var MyClass = new Class({
                initialize: function (x, y)
                {
                    this.x = x;
                    this.y = y;
                }
            });

            var instance = new MyClass(10, 20);
            expect(instance.x).toBe(10);
            expect(instance.y).toBe(20);
        });

        it('should throw an error if initialize is not a function', function ()
        {
            expect(function ()
            {
                new Class({ initialize: 'notAFunction' });
            }).toThrow('initialize must be a function');
        });

        it('should not expose initialize as a prototype method', function ()
        {
            var MyClass = new Class({
                initialize: function () {}
            });

            expect(MyClass.prototype.initialize).toBeUndefined();
        });
    });

    describe('prototype methods', function ()
    {
        it('should add methods to the prototype', function ()
        {
            var MyClass = new Class({
                initialize: function ()
                {
                    this.val = 5;
                },
                getVal: function ()
                {
                    return this.val;
                }
            });

            var instance = new MyClass();
            expect(typeof instance.getVal).toBe('function');
            expect(instance.getVal()).toBe(5);
        });

        it('should share prototype methods across instances', function ()
        {
            var MyClass = new Class({
                greet: function ()
                {
                    return 'hello';
                }
            });

            var a = new MyClass();
            var b = new MyClass();
            expect(a.greet).toBe(b.greet);
        });

        it('should support multiple methods', function ()
        {
            var MyClass = new Class({
                foo: function () { return 'foo'; },
                bar: function () { return 'bar'; },
                baz: function () { return 'baz'; }
            });

            var instance = new MyClass();
            expect(instance.foo()).toBe('foo');
            expect(instance.bar()).toBe('bar');
            expect(instance.baz()).toBe('baz');
        });
    });

    describe('Extends', function ()
    {
        it('should set up prototype inheritance from a parent class', function ()
        {
            var Base = new Class({
                initialize: function ()
                {
                    this.type = 'base';
                },
                getType: function ()
                {
                    return this.type;
                }
            });

            var Child = new Class({
                Extends: Base,
                initialize: function ()
                {
                    Base.call(this);
                    this.type = 'child';
                }
            });

            var instance = new Child();
            expect(instance.getType()).toBe('child');
            expect(instance instanceof Base).toBe(true);
            expect(instance instanceof Child).toBe(true);
        });

        it('should auto-delegate to parent constructor when no initialize is provided', function ()
        {
            var Base = new Class({
                initialize: function ()
                {
                    this.fromBase = true;
                }
            });

            var Child = new Class({
                Extends: Base
            });

            var instance = new Child();
            expect(instance.fromBase).toBe(true);
        });

        it('should inherit parent prototype methods', function ()
        {
            var Base = new Class({
                hello: function ()
                {
                    return 'hello from base';
                }
            });

            var Child = new Class({
                Extends: Base
            });

            var instance = new Child();
            expect(instance.hello()).toBe('hello from base');
        });

        it('should allow child to override parent methods', function ()
        {
            var Base = new Class({
                greet: function ()
                {
                    return 'base';
                }
            });

            var Child = new Class({
                Extends: Base,
                greet: function ()
                {
                    return 'child';
                }
            });

            var instance = new Child();
            expect(instance.greet()).toBe('child');
        });

        it('should not expose Extends as a prototype property', function ()
        {
            var Base = new Class({});

            var Child = new Class({
                Extends: Base
            });

            expect(Child.prototype.Extends).toBeUndefined();
        });

        it('should support multi-level inheritance', function ()
        {
            var A = new Class({
                initialize: function ()
                {
                    this.a = 1;
                },
                getA: function () { return this.a; }
            });

            var B = new Class({
                Extends: A,
                initialize: function ()
                {
                    A.call(this);
                    this.b = 2;
                },
                getB: function () { return this.b; }
            });

            var C = new Class({
                Extends: B,
                initialize: function ()
                {
                    B.call(this);
                    this.c = 3;
                },
                getC: function () { return this.c; }
            });

            var instance = new C();
            expect(instance.getA()).toBe(1);
            expect(instance.getB()).toBe(2);
            expect(instance.getC()).toBe(3);
            expect(instance instanceof A).toBe(true);
            expect(instance instanceof B).toBe(true);
            expect(instance instanceof C).toBe(true);
        });

        it('should set the prototype constructor to the child class', function ()
        {
            var Base = new Class({});
            var Child = new Class({ Extends: Base });
            expect(Child.prototype.constructor).toBe(Child);
        });
    });

    describe('Mixins', function ()
    {
        it('should mix in methods from a plain object', function ()
        {
            var mixin = {
                mixedMethod: function () { return 'mixed'; }
            };

            var MyClass = new Class({
                Mixins: mixin
            });

            var instance = new MyClass();
            expect(typeof instance.mixedMethod).toBe('function');
            expect(instance.mixedMethod()).toBe('mixed');
        });

        it('should mix in methods from an array of objects', function ()
        {
            var mixinA = { fromA: function () { return 'a'; } };
            var mixinB = { fromB: function () { return 'b'; } };

            var MyClass = new Class({
                Mixins: [ mixinA, mixinB ]
            });

            var instance = new MyClass();
            expect(instance.fromA()).toBe('a');
            expect(instance.fromB()).toBe('b');
        });

        it('should mix in from a constructor prototype', function ()
        {
            var Source = new Class({
                sharedMethod: function () { return 'shared'; }
            });

            var MyClass = new Class({
                Mixins: Source
            });

            var instance = new MyClass();
            expect(instance.sharedMethod()).toBe('shared');
        });

        it('should not expose Mixins as a prototype property', function ()
        {
            var mixin = { foo: function () {} };
            var MyClass = new Class({ Mixins: mixin });
            expect(MyClass.prototype.Mixins).toBeUndefined();
        });

        it('should apply mixins before the class definition methods', function ()
        {
            var mixin = { method: function () { return 'mixin'; } };

            var MyClass = new Class({
                Mixins: mixin,
                method: function () { return 'class'; }
            });

            var instance = new MyClass();
            expect(instance.method()).toBe('class');
        });
    });

    describe('getters and setters', function ()
    {
        it('should support getter definitions on the prototype', function ()
        {
            var MyClass = new Class({
                initialize: function ()
                {
                    this._val = 10;
                },
                value: {
                    get: function () { return this._val; }
                }
            });

            var instance = new MyClass();
            expect(instance.value).toBe(10);
        });

        it('should support setter definitions on the prototype', function ()
        {
            var MyClass = new Class({
                initialize: function ()
                {
                    this._val = 0;
                },
                value: {
                    get: function () { return this._val; },
                    set: function (v) { this._val = v * 2; }
                }
            });

            var instance = new MyClass();
            instance.value = 5;
            expect(instance.value).toBe(10);
        });
    });

    describe('Class.ignoreFinals', function ()
    {
        it('should default to false', function ()
        {
            expect(Class.ignoreFinals).toBe(false);
        });

        it('should throw when trying to override a non-configurable property without ignoreFinals', function ()
        {
            var Base = new Class({});

            Object.defineProperty(Base.prototype, 'locked', {
                value: function () { return 'locked'; },
                configurable: false,
                writable: false,
                enumerable: true
            });

            Class.ignoreFinals = false;

            expect(function ()
            {
                new Class({
                    Extends: Base,
                    locked: {
                        get: function () { return 'override'; }
                    }
                });
            }).toThrow();
        });

        it('should skip non-configurable properties when ignoreFinals is true', function ()
        {
            var Base = new Class({});

            Object.defineProperty(Base.prototype, 'final', {
                value: function () { return 'final'; },
                configurable: false,
                writable: false,
                enumerable: true
            });

            Class.ignoreFinals = true;

            expect(function ()
            {
                new Class({
                    Extends: Base,
                    final: {
                        get: function () { return 'override'; }
                    }
                });
            }).not.toThrow();

            Class.ignoreFinals = false;
        });
    });

    describe('Class.extend', function ()
    {
        it('should be exposed as a static method', function ()
        {
            expect(typeof Class.extend).toBe('function');
        });

        it('should add properties from a definition object to a constructor prototype', function ()
        {
            var Ctor = function () {};

            Class.extend(Ctor, {
                hello: function () { return 'hello'; }
            }, true);

            var instance = new Ctor();
            expect(instance.hello()).toBe('hello');
        });
    });

    describe('Class.mixin', function ()
    {
        it('should be exposed as a static method', function ()
        {
            expect(typeof Class.mixin).toBe('function');
        });

        it('should blend plain object methods into a constructor prototype', function ()
        {
            var Ctor = function () {};

            Class.mixin(Ctor, { mixed: function () { return true; } });

            var instance = new Ctor();
            expect(instance.mixed()).toBe(true);
        });

        it('should handle null mixins gracefully', function ()
        {
            var Ctor = function () {};

            expect(function ()
            {
                Class.mixin(Ctor, null);
            }).not.toThrow();
        });

        it('should handle undefined mixins gracefully', function ()
        {
            var Ctor = function () {};

            expect(function ()
            {
                Class.mixin(Ctor, undefined);
            }).not.toThrow();
        });
    });

    describe('instance isolation', function ()
    {
        it('should not share instance properties between instances', function ()
        {
            var MyClass = new Class({
                initialize: function ()
                {
                    this.value = 0;
                }
            });

            var a = new MyClass();
            var b = new MyClass();
            a.value = 99;
            expect(b.value).toBe(0);
        });
    });
});
