var XHRSettings = require('../../src/loader/XHRSettings');

describe('Phaser.Loader.XHRSettings', function ()
{
    describe('default values', function ()
    {
        it('should return an object with default responseType of empty string', function ()
        {
            var result = XHRSettings();
            expect(result.responseType).toBe('');
        });

        it('should return an object with default async of true', function ()
        {
            var result = XHRSettings();
            expect(result.async).toBe(true);
        });

        it('should return an object with default user of empty string', function ()
        {
            var result = XHRSettings();
            expect(result.user).toBe('');
        });

        it('should return an object with default password of empty string', function ()
        {
            var result = XHRSettings();
            expect(result.password).toBe('');
        });

        it('should return an object with default timeout of 0', function ()
        {
            var result = XHRSettings();
            expect(result.timeout).toBe(0);
        });

        it('should return an object with default withCredentials of false', function ()
        {
            var result = XHRSettings();
            expect(result.withCredentials).toBe(false);
        });

        it('should return an object with headers set to undefined', function ()
        {
            var result = XHRSettings();
            expect(result.headers).toBeUndefined();
        });

        it('should return an object with header set to undefined', function ()
        {
            var result = XHRSettings();
            expect(result.header).toBeUndefined();
        });

        it('should return an object with headerValue set to undefined', function ()
        {
            var result = XHRSettings();
            expect(result.headerValue).toBeUndefined();
        });

        it('should return an object with requestedWith set to false', function ()
        {
            var result = XHRSettings();
            expect(result.requestedWith).toBe(false);
        });

        it('should return an object with overrideMimeType set to undefined', function ()
        {
            var result = XHRSettings();
            expect(result.overrideMimeType).toBeUndefined();
        });
    });

    describe('custom values', function ()
    {
        it('should accept a custom responseType', function ()
        {
            var result = XHRSettings('arraybuffer');
            expect(result.responseType).toBe('arraybuffer');
        });

        it('should accept async set to false', function ()
        {
            var result = XHRSettings('', false);
            expect(result.async).toBe(false);
        });

        it('should accept a custom user', function ()
        {
            var result = XHRSettings('', true, 'admin');
            expect(result.user).toBe('admin');
        });

        it('should accept a custom password', function ()
        {
            var result = XHRSettings('', true, '', 'secret');
            expect(result.password).toBe('secret');
        });

        it('should accept a custom timeout', function ()
        {
            var result = XHRSettings('', true, '', '', 5000);
            expect(result.timeout).toBe(5000);
        });

        it('should accept withCredentials set to true', function ()
        {
            var result = XHRSettings('', true, '', '', 0, true);
            expect(result.withCredentials).toBe(true);
        });

        it('should accept all custom values together', function ()
        {
            var result = XHRSettings('blob', false, 'user1', 'pass1', 3000, true);
            expect(result.responseType).toBe('blob');
            expect(result.async).toBe(false);
            expect(result.user).toBe('user1');
            expect(result.password).toBe('pass1');
            expect(result.timeout).toBe(3000);
            expect(result.withCredentials).toBe(true);
        });
    });

    describe('responseType values', function ()
    {
        it('should accept text responseType', function ()
        {
            var result = XHRSettings('text');
            expect(result.responseType).toBe('text');
        });

        it('should accept blob responseType', function ()
        {
            var result = XHRSettings('blob');
            expect(result.responseType).toBe('blob');
        });

        it('should accept document responseType', function ()
        {
            var result = XHRSettings('document');
            expect(result.responseType).toBe('document');
        });

        it('should accept json responseType', function ()
        {
            var result = XHRSettings('json');
            expect(result.responseType).toBe('json');
        });
    });

    describe('return type', function ()
    {
        it('should return a plain object', function ()
        {
            var result = XHRSettings();
            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
        });

        it('should return a new object on each call', function ()
        {
            var result1 = XHRSettings();
            var result2 = XHRSettings();
            expect(result1).not.toBe(result2);
        });

        it('should have exactly the expected keys', function ()
        {
            var result = XHRSettings();
            var keys = Object.keys(result).sort();
            var expected = [
                'async',
                'header',
                'headerValue',
                'headers',
                'overrideMimeType',
                'password',
                'requestedWith',
                'responseType',
                'timeout',
                'user',
                'withCredentials'
            ].sort();
            expect(keys).toEqual(expected);
        });
    });

    describe('edge cases', function ()
    {
        it('should treat timeout of 0 as no timeout', function ()
        {
            var result = XHRSettings('', true, '', '', 0);
            expect(result.timeout).toBe(0);
        });

        it('should accept large timeout values', function ()
        {
            var result = XHRSettings('', true, '', '', 999999);
            expect(result.timeout).toBe(999999);
        });

        it('should preserve empty string credentials', function ()
        {
            var result = XHRSettings('', true, '', '');
            expect(result.user).toBe('');
            expect(result.password).toBe('');
        });
    });
});
