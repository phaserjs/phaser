var ListCompositor = require('../../../../src/renderer/webgl/renderNodes/ListCompositor');

describe('ListCompositor', function ()
{
    var manager;
    var node;

    function makeManager ()
    {
        return {
            renderer: {}
        };
    }

    function makeContext (blendMode)
    {
        var ctx = {
            blendMode: blendMode !== undefined ? blendMode : 0,
            released: false,
            used: false,
            setBlendModeCalled: false,
            clones: [],
            release: function ()
            {
                ctx.released = true;
            },
            use: function ()
            {
                ctx.used = true;
            },
            setBlendMode: function (mode)
            {
                ctx.blendMode = mode;
                ctx.setBlendModeCalled = true;
            },
            getClone: function ()
            {
                var clone = makeContext(ctx.blendMode);
                ctx.clones.push(clone);
                return clone;
            }
        };
        return ctx;
    }

    function makeChild (blendMode)
    {
        return {
            blendMode: blendMode !== undefined ? blendMode : 0,
            calls: [],
            renderWebGLStep: function (renderer, child, context, parentTransform, renderStep, children, index)
            {
                this.calls.push({
                    renderer: renderer,
                    child: child,
                    context: context,
                    parentTransform: parentTransform,
                    renderStep: renderStep,
                    children: children,
                    index: index
                });
            }
        };
    }

    beforeEach(function ()
    {
        manager = makeManager();
        node = new ListCompositor(manager);
    });

    describe('constructor', function ()
    {
        it('should set the node name to ListCompositor', function ()
        {
            expect(node.name).toBe('ListCompositor');
        });

        it('should store the manager reference', function ()
        {
            expect(node.manager).toBe(manager);
        });

        it('should initialise _run to null', function ()
        {
            expect(node._run).toBeNull();
        });
    });

    describe('run', function ()
    {
        it('should call onRunBegin with the display context', function ()
        {
            var ctx = makeContext(0);
            var beginArg = null;
            node.onRunBegin = function (c) { beginArg = c; };
            node.onRunEnd = function () {};

            node.run(ctx, []);

            expect(beginArg).toBe(ctx);
        });

        it('should call onRunEnd with the display context', function ()
        {
            var ctx = makeContext(0);
            var endArg = null;
            node.onRunBegin = function () {};
            node.onRunEnd = function (c) { endArg = c; };

            node.run(ctx, []);

            expect(endArg).toBe(ctx);
        });

        it('should call renderWebGLStep on each child', function ()
        {
            var ctx = makeContext(0);
            var child1 = makeChild(0);
            var child2 = makeChild(0);

            node.run(ctx, [ child1, child2 ]);

            expect(child1.calls.length).toBe(1);
            expect(child2.calls.length).toBe(1);
        });

        it('should pass the renderer from manager to renderWebGLStep', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild(0);

            node.run(ctx, [ child ]);

            expect(child.calls[0].renderer).toBe(manager.renderer);
        });

        it('should pass the child itself as the second argument to renderWebGLStep', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild(0);

            node.run(ctx, [ child ]);

            expect(child.calls[0].child).toBe(child);
        });

        it('should pass the display context to renderWebGLStep when all children share the base blend mode', function ()
        {
            var ctx = makeContext(0);
            var child1 = makeChild(0);
            var child2 = makeChild(0);

            node.run(ctx, [ child1, child2 ]);

            expect(child1.calls[0].context).toBe(ctx);
            expect(child2.calls[0].context).toBe(ctx);
        });

        it('should pass parentTransformMatrix and renderStep to renderWebGLStep', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild(0);
            var matrix = { a: 1 };

            node.run(ctx, [ child ], matrix, 3);

            expect(child.calls[0].parentTransform).toBe(matrix);
            expect(child.calls[0].renderStep).toBe(3);
        });

        it('should pass the children array and current index to renderWebGLStep', function ()
        {
            var ctx = makeContext(0);
            var child1 = makeChild(0);
            var child2 = makeChild(0);
            var list = [ child1, child2 ];

            node.run(ctx, list);

            expect(child1.calls[0].children).toBe(list);
            expect(child1.calls[0].index).toBe(0);
            expect(child2.calls[0].children).toBe(list);
            expect(child2.calls[0].index).toBe(1);
        });

        it('should handle an empty children array without error', function ()
        {
            var ctx = makeContext(0);
            expect(function () { node.run(ctx, []); }).not.toThrow();
        });

        it('should not release the display context when all children share the base blend mode', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild(0);

            node.run(ctx, [ child ]);

            expect(ctx.released).toBe(false);
        });

        it('should clone the display context when a child has a different blend mode', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild(1);

            node.run(ctx, [ child ]);

            expect(ctx.clones.length).toBe(1);
        });

        it('should set the blend mode on the cloned context', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild(5);

            node.run(ctx, [ child ]);

            var clone = ctx.clones[0];
            expect(clone.blendMode).toBe(5);
            expect(clone.setBlendModeCalled).toBe(true);
        });

        it('should call use() on the cloned context', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild(1);

            node.run(ctx, [ child ]);

            expect(ctx.clones[0].used).toBe(true);
        });

        it('should render the child using the cloned context when blend mode differs', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild(1);

            node.run(ctx, [ child ]);

            expect(child.calls[0].context).toBe(ctx.clones[0]);
        });

        it('should release the cloned context after rendering', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild(1);

            node.run(ctx, [ child ]);

            expect(ctx.clones[0].released).toBe(true);
        });

        it('should release a non-base context before switching to another non-base context', function ()
        {
            var ctx = makeContext(0);
            var child1 = makeChild(1);
            var child2 = makeChild(2);

            node.run(ctx, [ child1, child2 ]);

            // Two clones should have been created; the first is released when
            // the second child triggers another blend mode change.
            expect(ctx.clones.length).toBe(2);
            expect(ctx.clones[0].released).toBe(true);
            expect(ctx.clones[1].released).toBe(true);
        });

        it('should restore the base display context when blend mode returns to base', function ()
        {
            var ctx = makeContext(0);
            var child1 = makeChild(1);
            var child2 = makeChild(0);

            node.run(ctx, [ child1, child2 ]);

            // child2 uses base blend mode, so it should receive the original ctx.
            expect(child2.calls[0].context).toBe(ctx);
        });

        it('should release the non-base context when blend mode returns to base', function ()
        {
            var ctx = makeContext(0);
            var child1 = makeChild(1);
            var child2 = makeChild(0);

            node.run(ctx, [ child1, child2 ]);

            expect(ctx.clones[0].released).toBe(true);
        });

        it('should not release the base display context when blend mode returns to base', function ()
        {
            var ctx = makeContext(0);
            var child1 = makeChild(1);
            var child2 = makeChild(0);

            node.run(ctx, [ child1, child2 ]);

            expect(ctx.released).toBe(false);
        });

        it('should not switch context for a child with SKIP_CHECK blend mode (-1)', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild(-1); // SKIP_CHECK

            node.run(ctx, [ child ]);

            // No clones should have been created.
            expect(ctx.clones.length).toBe(0);
            // The child should receive the original context.
            expect(child.calls[0].context).toBe(ctx);
        });

        it('should not switch context for a SKIP_CHECK child even when current blend mode differs from base', function ()
        {
            var ctx = makeContext(0);
            var child1 = makeChild(1);   // triggers clone
            var child2 = makeChild(-1);  // SKIP_CHECK – should keep current context

            node.run(ctx, [ child1, child2 ]);

            // child2 should still use the cloned context (not the base),
            // because SKIP_CHECK means "don't change the blend mode".
            expect(child2.calls[0].context).toBe(ctx.clones[0]);
        });

        it('should create only one clone per distinct blend mode segment', function ()
        {
            var ctx = makeContext(0);
            var child1 = makeChild(1);
            var child2 = makeChild(1);
            var child3 = makeChild(1);

            node.run(ctx, [ child1, child2, child3 ]);

            // All three children share blend mode 1, so only one clone is needed.
            expect(ctx.clones.length).toBe(1);
        });

        it('should render multiple children with the same non-base blend mode using one cloned context', function ()
        {
            var ctx = makeContext(0);
            var child1 = makeChild(2);
            var child2 = makeChild(2);

            node.run(ctx, [ child1, child2 ]);

            var clone = ctx.clones[0];
            expect(child1.calls[0].context).toBe(clone);
            expect(child2.calls[0].context).toBe(clone);
        });
    });
});
