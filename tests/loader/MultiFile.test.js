var MultiFile = require('../../src/loader/MultiFile');
var CONST = require('../../src/loader/const');

describe('MultiFile', function ()
{
    var mockLoader;
    var mockFile1;
    var mockFile2;

    function createMockLoader (prefix)
    {
        return {
            prefix: prefix || '',
            baseURL: 'http://example.com/',
            path: 'assets/',
            multiKeyIndex: 0,
            emit: vi.fn(),
            flagForRemoval: vi.fn()
        };
    }

    function createMockFile (type, key)
    {
        return {
            type: type || 'image',
            key: key || 'testFile',
            multiFile: null,
            pendingDestroy: vi.fn()
        };
    }

    beforeEach(function ()
    {
        mockLoader = createMockLoader();
        mockFile1 = createMockFile('image', 'file1');
        mockFile2 = createMockFile('json', 'file2');
    });

    describe('constructor', function ()
    {
        it('should set the loader reference', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.loader).toBe(mockLoader);
        });

        it('should set the type', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.type).toBe('atlas');
        });

        it('should set the key', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.key).toBe('myAtlas');
        });

        it('should prepend prefix to key when loader has a prefix', function ()
        {
            var loader = createMockLoader('prefix_');
            var multi = new MultiFile(loader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.key).toBe('prefix_myAtlas');
        });

        it('should not prepend prefix when loader prefix is empty string', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.key).toBe('myAtlas');
        });

        it('should store the files array', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.files.length).toBe(2);
            expect(multi.files[0]).toBe(mockFile1);
            expect(multi.files[1]).toBe(mockFile2);
        });

        it('should filter out null entries from files array', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, null, mockFile2, undefined]);
            expect(multi.files.length).toBe(2);
            expect(multi.files[0]).toBe(mockFile1);
            expect(multi.files[1]).toBe(mockFile2);
        });

        it('should set pending to the number of valid files', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.pending).toBe(2);
        });

        it('should set pending correctly after filtering null files', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, null, mockFile2]);
            expect(multi.pending).toBe(2);
        });

        it('should set complete to false', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.complete).toBe(false);
        });

        it('should set failed to 0', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.failed).toBe(0);
        });

        it('should set state to FILE_PENDING', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.state).toBe(CONST.FILE_PENDING);
        });

        it('should set config to an empty object', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.config).toEqual({});
        });

        it('should copy baseURL from loader', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.baseURL).toBe('http://example.com/');
        });

        it('should copy path from loader', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.path).toBe('assets/');
        });

        it('should copy prefix from loader', function ()
        {
            var loader = createMockLoader('myPrefix_');
            var multi = new MultiFile(loader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.prefix).toBe('myPrefix_');
        });

        it('should link each file back to this MultiFile', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(mockFile1.multiFile).toBe(multi);
            expect(mockFile2.multiFile).toBe(multi);
        });

        it('should increment the loader multiKeyIndex', function ()
        {
            expect(mockLoader.multiKeyIndex).toBe(0);
            new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            expect(mockLoader.multiKeyIndex).toBe(1);
        });

        it('should assign sequential multiKeyIndex values', function ()
        {
            var multi1 = new MultiFile(mockLoader, 'atlas', 'atlas1', [mockFile1]);
            var multi2 = new MultiFile(mockLoader, 'atlas', 'atlas2', [mockFile2]);
            expect(multi1.multiKeyIndex).toBe(0);
            expect(multi2.multiKeyIndex).toBe(1);
        });

        it('should handle an empty files array', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', []);
            expect(multi.files.length).toBe(0);
            expect(multi.pending).toBe(0);
        });
    });

    describe('isReadyToProcess', function ()
    {
        it('should return true when pending is 0, failed is 0, and complete is false', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.pending = 0;
            multi.failed = 0;
            multi.complete = false;
            expect(multi.isReadyToProcess()).toBe(true);
        });

        it('should return false when pending is greater than 0', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.pending = 1;
            multi.failed = 0;
            multi.complete = false;
            expect(multi.isReadyToProcess()).toBe(false);
        });

        it('should return false when failed is greater than 0', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.pending = 0;
            multi.failed = 1;
            multi.complete = false;
            expect(multi.isReadyToProcess()).toBe(false);
        });

        it('should return false when complete is true', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.pending = 0;
            multi.failed = 0;
            multi.complete = true;
            expect(multi.isReadyToProcess()).toBe(false);
        });

        it('should return false when both pending and failed are nonzero', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.pending = 1;
            multi.failed = 1;
            multi.complete = false;
            expect(multi.isReadyToProcess()).toBe(false);
        });
    });

    describe('addToMultiFile', function ()
    {
        it('should add the file to the files array', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            var newFile = createMockFile('text', 'extra');
            multi.addToMultiFile(newFile);
            expect(multi.files.length).toBe(2);
            expect(multi.files[1]).toBe(newFile);
        });

        it('should set the file multiFile reference to this instance', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            var newFile = createMockFile('text', 'extra');
            multi.addToMultiFile(newFile);
            expect(newFile.multiFile).toBe(multi);
        });

        it('should increment pending', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            var initialPending = multi.pending;
            multi.addToMultiFile(mockFile2);
            expect(multi.pending).toBe(initialPending + 1);
        });

        it('should set complete to false', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.complete = true;
            multi.addToMultiFile(mockFile2);
            expect(multi.complete).toBe(false);
        });

        it('should return the MultiFile instance', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            var result = multi.addToMultiFile(mockFile2);
            expect(result).toBe(multi);
        });
    });

    describe('onFileComplete', function ()
    {
        it('should decrement pending when the file is in the files array', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.pending).toBe(2);
            multi.onFileComplete(mockFile1);
            expect(multi.pending).toBe(1);
        });

        it('should decrement pending to zero when last file completes', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.onFileComplete(mockFile1);
            expect(multi.pending).toBe(0);
        });

        it('should not decrement pending when file is not in the files array', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            var outsideFile = createMockFile('image', 'outsider');
            multi.onFileComplete(outsideFile);
            expect(multi.pending).toBe(1);
        });

        it('should handle multiple file completions independently', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            multi.onFileComplete(mockFile1);
            multi.onFileComplete(mockFile2);
            expect(multi.pending).toBe(0);
        });
    });

    describe('onFileFailed', function ()
    {
        it('should increment failed when the file is in the files array', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            expect(multi.failed).toBe(0);
            multi.onFileFailed(mockFile1);
            expect(multi.failed).toBe(1);
        });

        it('should not increment failed when file is not in the files array', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            var outsideFile = createMockFile('image', 'outsider');
            multi.onFileFailed(outsideFile);
            expect(multi.failed).toBe(0);
        });

        it('should increment failed for each failing file', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            multi.onFileFailed(mockFile1);
            multi.onFileFailed(mockFile2);
            expect(multi.failed).toBe(2);
        });

        it('should not affect pending count', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            multi.onFileFailed(mockFile1);
            expect(multi.pending).toBe(2);
        });
    });

    describe('pendingDestroy', function ()
    {
        it('should emit FILE_COMPLETE event on the loader', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.pendingDestroy();
            expect(mockLoader.emit).toHaveBeenCalledWith(
                expect.stringContaining('filecomplete'),
                'myAtlas',
                'atlas'
            );
        });

        it('should call flagForRemoval on the loader', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.pendingDestroy();
            expect(mockLoader.flagForRemoval).toHaveBeenCalledWith(multi);
        });

        it('should call pendingDestroy on each child file', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1, mockFile2]);
            multi.pendingDestroy();
            expect(mockFile1.pendingDestroy).toHaveBeenCalled();
            expect(mockFile2.pendingDestroy).toHaveBeenCalled();
        });

        it('should set state to FILE_PENDING_DESTROY', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.pendingDestroy();
            expect(multi.state).toBe(CONST.FILE_PENDING_DESTROY);
        });

        it('should not emit events or call flagForRemoval if already in FILE_PENDING_DESTROY state', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.state = CONST.FILE_PENDING_DESTROY;
            multi.pendingDestroy();
            expect(mockLoader.emit).not.toHaveBeenCalled();
            expect(mockLoader.flagForRemoval).not.toHaveBeenCalled();
        });

        it('should emit FILE_KEY_COMPLETE event with type and key in event name', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.pendingDestroy();
            var calls = mockLoader.emit.mock.calls;
            var keyCompleteCall = calls.find(function (call)
            {
                return typeof call[0] === 'string' && call[0].indexOf('atlas') !== -1 && call[0].indexOf('myAtlas') !== -1;
            });
            expect(keyCompleteCall).toBeDefined();
        });
    });

    describe('destroy', function ()
    {
        it('should set loader to null', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.destroy();
            expect(multi.loader).toBeNull();
        });

        it('should set files to null', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.destroy();
            expect(multi.files).toBeNull();
        });

        it('should set config to null', function ()
        {
            var multi = new MultiFile(mockLoader, 'atlas', 'myAtlas', [mockFile1]);
            multi.destroy();
            expect(multi.config).toBeNull();
        });
    });
});
