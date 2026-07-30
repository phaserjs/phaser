var AnimationJSONFile = require('../../../src/loader/filetypes/AnimationJSONFile');
var LoaderEvents = require('../../../src/loader/events');

describe('AnimationJSONFile', function ()
{
    describe('module', function ()
    {
        it('should be importable', function ()
        {
            expect(AnimationJSONFile).toBeDefined();
        });

        it('should be a constructor function', function ()
        {
            expect(typeof AnimationJSONFile).toBe('function');
        });

        it('should expose onProcess on its prototype', function ()
        {
            expect(typeof AnimationJSONFile.prototype.onProcess).toBe('function');
        });

        it('should expose onLoadComplete on its prototype', function ()
        {
            expect(typeof AnimationJSONFile.prototype.onLoadComplete).toBe('function');
        });
    });

    describe('onLoadComplete', function ()
    {
        it('should call loader.systems.anims.fromJSON with file data', function ()
        {
            var animData = { anims: [] };
            var fromJSON = vi.fn();
            var mockFile = {
                loader: {
                    systems: {
                        anims: { fromJSON: fromJSON }
                    }
                },
                data: animData
            };

            AnimationJSONFile.prototype.onLoadComplete.call(mockFile);

            expect(fromJSON).toHaveBeenCalledWith(animData);
        });

        it('should call fromJSON exactly once', function ()
        {
            var fromJSON = vi.fn();
            var mockFile = {
                loader: {
                    systems: {
                        anims: { fromJSON: fromJSON }
                    }
                },
                data: {}
            };

            AnimationJSONFile.prototype.onLoadComplete.call(mockFile);

            expect(fromJSON).toHaveBeenCalledTimes(1);
        });

        it('should pass null data to fromJSON when file data is null', function ()
        {
            var fromJSON = vi.fn();
            var mockFile = {
                loader: {
                    systems: {
                        anims: { fromJSON: fromJSON }
                    }
                },
                data: null
            };

            AnimationJSONFile.prototype.onLoadComplete.call(mockFile);

            expect(fromJSON).toHaveBeenCalledWith(null);
        });

        it('should pass complex animation data structures to fromJSON', function ()
        {
            var animData = {
                anims: [
                    { key: 'walk', frames: [ { key: 'player', frame: 0 } ], frameRate: 10, repeat: -1 },
                    { key: 'run', frames: [ { key: 'player', frame: 4 } ], frameRate: 24, repeat: 0 }
                ]
            };
            var fromJSON = vi.fn();
            var mockFile = {
                loader: {
                    systems: {
                        anims: { fromJSON: fromJSON }
                    }
                },
                data: animData
            };

            AnimationJSONFile.prototype.onLoadComplete.call(mockFile);

            expect(fromJSON).toHaveBeenCalledWith(animData);
        });

        it('should pass an array data structure to fromJSON', function ()
        {
            var animData = [
                { key: 'explode', frames: [], frameRate: 30 }
            ];
            var fromJSON = vi.fn();
            var mockFile = {
                loader: {
                    systems: {
                        anims: { fromJSON: fromJSON }
                    }
                },
                data: animData
            };

            AnimationJSONFile.prototype.onLoadComplete.call(mockFile);

            expect(fromJSON).toHaveBeenCalledWith(animData);
        });
    });

    describe('onProcess', function ()
    {
        var JSONFileProto;
        var parentOnProcessSpy;

        beforeEach(function ()
        {
            JSONFileProto = Object.getPrototypeOf(AnimationJSONFile.prototype);
            parentOnProcessSpy = vi.spyOn(JSONFileProto, 'onProcess').mockImplementation(function () {});
        });

        afterEach(function ()
        {
            parentOnProcessSpy.mockRestore();
        });

        it('should register a POST_PROCESS listener on the loader', function ()
        {
            var onceSpy = vi.fn();
            var mockFile = {
                loader: { once: onceSpy },
                onLoadComplete: AnimationJSONFile.prototype.onLoadComplete
            };

            AnimationJSONFile.prototype.onProcess.call(mockFile);

            expect(onceSpy).toHaveBeenCalledWith(
                LoaderEvents.POST_PROCESS,
                mockFile.onLoadComplete,
                mockFile
            );
        });

        it('should register the POST_PROCESS listener with the correct event name', function ()
        {
            var onceSpy = vi.fn();
            var mockFile = {
                loader: { once: onceSpy },
                onLoadComplete: AnimationJSONFile.prototype.onLoadComplete
            };

            AnimationJSONFile.prototype.onProcess.call(mockFile);

            var callArgs = onceSpy.mock.calls[0];
            expect(callArgs[0]).toBe('postprocess');
        });

        it('should register onLoadComplete as the POST_PROCESS callback', function ()
        {
            var onceSpy = vi.fn();
            var mockFile = {
                loader: { once: onceSpy },
                onLoadComplete: AnimationJSONFile.prototype.onLoadComplete
            };

            AnimationJSONFile.prototype.onProcess.call(mockFile);

            var callArgs = onceSpy.mock.calls[0];
            expect(callArgs[1]).toBe(AnimationJSONFile.prototype.onLoadComplete);
        });

        it('should pass the file instance as context for the POST_PROCESS callback', function ()
        {
            var onceSpy = vi.fn();
            var mockFile = {
                loader: { once: onceSpy },
                onLoadComplete: AnimationJSONFile.prototype.onLoadComplete
            };

            AnimationJSONFile.prototype.onProcess.call(mockFile);

            var callArgs = onceSpy.mock.calls[0];
            expect(callArgs[2]).toBe(mockFile);
        });

        it('should call parent JSONFile onProcess', function ()
        {
            var mockFile = {
                loader: { once: vi.fn() },
                onLoadComplete: AnimationJSONFile.prototype.onLoadComplete
            };

            AnimationJSONFile.prototype.onProcess.call(mockFile);

            expect(parentOnProcessSpy).toHaveBeenCalled();
        });

        it('should call parent onProcess with the file instance as context', function ()
        {
            var mockFile = {
                loader: { once: vi.fn() },
                onLoadComplete: AnimationJSONFile.prototype.onLoadComplete
            };

            AnimationJSONFile.prototype.onProcess.call(mockFile);

            expect(parentOnProcessSpy).toHaveBeenCalledTimes(1);
        });

        it('should register the listener before calling parent onProcess', function ()
        {
            var callOrder = [];
            var onceSpy = vi.fn(function () { callOrder.push('once'); });
            parentOnProcessSpy.mockImplementation(function () { callOrder.push('parentOnProcess'); });

            var mockFile = {
                loader: { once: onceSpy },
                onLoadComplete: AnimationJSONFile.prototype.onLoadComplete
            };

            AnimationJSONFile.prototype.onProcess.call(mockFile);

            expect(callOrder[0]).toBe('once');
            expect(callOrder[1]).toBe('parentOnProcess');
        });
    });
});
