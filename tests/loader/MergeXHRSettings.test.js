var MergeXHRSettings = require('../../src/loader/MergeXHRSettings');
var XHRSettings = require('../../src/loader/XHRSettings');

describe('Phaser.Loader.MergeXHRSettings', function ()
{
    describe('when global is undefined', function ()
    {
        it('should return a default XHRSettings object', function ()
        {
            var result = MergeXHRSettings(undefined, undefined);

            expect(result).toBeDefined();
            expect(result.responseType).toBe('');
            expect(result.async).toBe(true);
            expect(result.user).toBe('');
            expect(result.password).toBe('');
            expect(result.timeout).toBe(0);
            expect(result.withCredentials).toBe(false);
        });

        it('should apply local settings over the defaults when global is undefined', function ()
        {
            var local = { timeout: 5000, user: 'admin' };
            var result = MergeXHRSettings(undefined, local);

            expect(result.timeout).toBe(5000);
            expect(result.user).toBe('admin');
            expect(result.async).toBe(true);
        });
    });

    describe('when global is provided', function ()
    {
        it('should return a copy of the global settings when no local is provided', function ()
        {
            var global = XHRSettings('arraybuffer', false, 'user1', 'pass1', 3000, true);
            var result = MergeXHRSettings(global, undefined);

            expect(result.responseType).toBe('arraybuffer');
            expect(result.async).toBe(false);
            expect(result.user).toBe('user1');
            expect(result.password).toBe('pass1');
            expect(result.timeout).toBe(3000);
            expect(result.withCredentials).toBe(true);
        });

        it('should not mutate the global settings object', function ()
        {
            var global = XHRSettings('text', true, '', '', 0, false);
            var local = { timeout: 9999 };
            MergeXHRSettings(global, local);

            expect(global.timeout).toBe(0);
        });

        it('should return a new object distinct from the global object', function ()
        {
            var global = XHRSettings();
            var result = MergeXHRSettings(global, undefined);

            expect(result).not.toBe(global);
        });
    });

    describe('when local overrides global', function ()
    {
        it('should override responseType from global with local value', function ()
        {
            var global = XHRSettings('text');
            var local = { responseType: 'blob' };
            var result = MergeXHRSettings(global, local);

            expect(result.responseType).toBe('blob');
        });

        it('should override async from global with local value', function ()
        {
            var global = XHRSettings('', true);
            var local = { async: false };
            var result = MergeXHRSettings(global, local);

            expect(result.async).toBe(false);
        });

        it('should override timeout from global with local value', function ()
        {
            var global = XHRSettings('', true, '', '', 1000);
            var local = { timeout: 5000 };
            var result = MergeXHRSettings(global, local);

            expect(result.timeout).toBe(5000);
        });

        it('should override withCredentials from global with local value', function ()
        {
            var global = XHRSettings('', true, '', '', 0, false);
            var local = { withCredentials: true };
            var result = MergeXHRSettings(global, local);

            expect(result.withCredentials).toBe(true);
        });

        it('should override user and password from global with local values', function ()
        {
            var global = XHRSettings('', true, 'oldUser', 'oldPass');
            var local = { user: 'newUser', password: 'newPass' };
            var result = MergeXHRSettings(global, local);

            expect(result.user).toBe('newUser');
            expect(result.password).toBe('newPass');
        });

        it('should preserve global properties not overridden by local', function ()
        {
            var global = XHRSettings('arraybuffer', false, 'user1', 'pass1', 3000, true);
            var local = { timeout: 9999 };
            var result = MergeXHRSettings(global, local);

            expect(result.responseType).toBe('arraybuffer');
            expect(result.async).toBe(false);
            expect(result.user).toBe('user1');
            expect(result.password).toBe('pass1');
            expect(result.withCredentials).toBe(true);
            expect(result.timeout).toBe(9999);
        });

        it('should allow setting headers via local', function ()
        {
            var global = XHRSettings();
            var local = { headers: { 'Authorization': 'Bearer token' } };
            var result = MergeXHRSettings(global, local);

            expect(result.headers).toEqual({ 'Authorization': 'Bearer token' });
        });

        it('should allow setting overrideMimeType via local', function ()
        {
            var global = XHRSettings();
            var local = { overrideMimeType: 'application/json' };
            var result = MergeXHRSettings(global, local);

            expect(result.overrideMimeType).toBe('application/json');
        });
    });

    describe('when local has undefined values', function ()
    {
        it('should not override global values with undefined local values', function ()
        {
            var global = XHRSettings('text', true, 'user1', 'pass1', 1000, true);
            var local = { timeout: undefined, user: undefined };
            var result = MergeXHRSettings(global, local);

            expect(result.timeout).toBe(1000);
            expect(result.user).toBe('user1');
        });
    });

    describe('when local is null or falsy', function ()
    {
        it('should return global settings when local is null', function ()
        {
            var global = XHRSettings('blob', false, 'u', 'p', 500, true);
            var result = MergeXHRSettings(global, null);

            expect(result.responseType).toBe('blob');
            expect(result.async).toBe(false);
            expect(result.timeout).toBe(500);
        });

        it('should return global settings when local is an empty object', function ()
        {
            var global = XHRSettings('text', true, '', '', 2000, false);
            var result = MergeXHRSettings(global, {});

            expect(result.responseType).toBe('text');
            expect(result.timeout).toBe(2000);
        });
    });
});
