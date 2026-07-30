var FILE_CONST = require('../../src/loader/const');

describe('const', function ()
{
    describe('Loader state constants', function ()
    {
        it('should define LOADER_IDLE as 0', function ()
        {
            expect(FILE_CONST.LOADER_IDLE).toBe(0);
        });

        it('should define LOADER_LOADING as 1', function ()
        {
            expect(FILE_CONST.LOADER_LOADING).toBe(1);
        });

        it('should define LOADER_PROCESSING as 2', function ()
        {
            expect(FILE_CONST.LOADER_PROCESSING).toBe(2);
        });

        it('should define LOADER_COMPLETE as 3', function ()
        {
            expect(FILE_CONST.LOADER_COMPLETE).toBe(3);
        });

        it('should define LOADER_SHUTDOWN as 4', function ()
        {
            expect(FILE_CONST.LOADER_SHUTDOWN).toBe(4);
        });

        it('should define LOADER_DESTROYED as 5', function ()
        {
            expect(FILE_CONST.LOADER_DESTROYED).toBe(5);
        });

        it('should have loader states in ascending sequential order', function ()
        {
            expect(FILE_CONST.LOADER_IDLE).toBeLessThan(FILE_CONST.LOADER_LOADING);
            expect(FILE_CONST.LOADER_LOADING).toBeLessThan(FILE_CONST.LOADER_PROCESSING);
            expect(FILE_CONST.LOADER_PROCESSING).toBeLessThan(FILE_CONST.LOADER_COMPLETE);
            expect(FILE_CONST.LOADER_COMPLETE).toBeLessThan(FILE_CONST.LOADER_SHUTDOWN);
            expect(FILE_CONST.LOADER_SHUTDOWN).toBeLessThan(FILE_CONST.LOADER_DESTROYED);
        });
    });

    describe('File state constants', function ()
    {
        it('should define FILE_PENDING as 10', function ()
        {
            expect(FILE_CONST.FILE_PENDING).toBe(10);
        });

        it('should define FILE_LOADING as 11', function ()
        {
            expect(FILE_CONST.FILE_LOADING).toBe(11);
        });

        it('should define FILE_LOADED as 12', function ()
        {
            expect(FILE_CONST.FILE_LOADED).toBe(12);
        });

        it('should define FILE_FAILED as 13', function ()
        {
            expect(FILE_CONST.FILE_FAILED).toBe(13);
        });

        it('should define FILE_PROCESSING as 14', function ()
        {
            expect(FILE_CONST.FILE_PROCESSING).toBe(14);
        });

        it('should define FILE_ERRORED as 16', function ()
        {
            expect(FILE_CONST.FILE_ERRORED).toBe(16);
        });

        it('should define FILE_COMPLETE as 17', function ()
        {
            expect(FILE_CONST.FILE_COMPLETE).toBe(17);
        });

        it('should define FILE_DESTROYED as 18', function ()
        {
            expect(FILE_CONST.FILE_DESTROYED).toBe(18);
        });

        it('should define FILE_POPULATED as 19', function ()
        {
            expect(FILE_CONST.FILE_POPULATED).toBe(19);
        });

        it('should define FILE_PENDING_DESTROY as 20', function ()
        {
            expect(FILE_CONST.FILE_PENDING_DESTROY).toBe(20);
        });

        it('should have file states starting at 10 to avoid collision with loader states', function ()
        {
            expect(FILE_CONST.FILE_PENDING).toBeGreaterThanOrEqual(10);
        });

        it('should skip 15 between FILE_PROCESSING and FILE_ERRORED', function ()
        {
            expect(FILE_CONST.FILE_PROCESSING).toBe(14);
            expect(FILE_CONST.FILE_ERRORED).toBe(16);
        });
    });

    describe('constant types', function ()
    {
        it('should export all constants as numbers', function ()
        {
            var keys = Object.keys(FILE_CONST);

            keys.forEach(function (key)
            {
                expect(typeof FILE_CONST[key]).toBe('number');
            });
        });

        it('should export exactly 16 constants', function ()
        {
            expect(Object.keys(FILE_CONST).length).toBe(16);
        });

        it('should have all unique values', function ()
        {
            var values = Object.values(FILE_CONST);
            var unique = new Set(values);

            expect(unique.size).toBe(values.length);
        });
    });

    describe('loader and file constant separation', function ()
    {
        it('should have no overlap between loader state values and file state values', function ()
        {
            var loaderValues = [
                FILE_CONST.LOADER_IDLE,
                FILE_CONST.LOADER_LOADING,
                FILE_CONST.LOADER_PROCESSING,
                FILE_CONST.LOADER_COMPLETE,
                FILE_CONST.LOADER_SHUTDOWN,
                FILE_CONST.LOADER_DESTROYED
            ];

            var fileValues = [
                FILE_CONST.FILE_PENDING,
                FILE_CONST.FILE_LOADING,
                FILE_CONST.FILE_LOADED,
                FILE_CONST.FILE_FAILED,
                FILE_CONST.FILE_PROCESSING,
                FILE_CONST.FILE_ERRORED,
                FILE_CONST.FILE_COMPLETE,
                FILE_CONST.FILE_DESTROYED,
                FILE_CONST.FILE_POPULATED,
                FILE_CONST.FILE_PENDING_DESTROY
            ];

            loaderValues.forEach(function (loaderVal)
            {
                expect(fileValues.indexOf(loaderVal)).toBe(-1);
            });
        });
    });
});
