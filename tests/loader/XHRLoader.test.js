var XHRLoader = require('../../src/loader/XHRLoader');

describe('Phaser.Loader.XHRLoader', function ()
{
    var mockXHR;
    var MockXMLHttpRequest;

    function makeMockXHR ()
    {
        return {
            open: vi.fn(),
            send: vi.fn(),
            setRequestHeader: vi.fn(),
            overrideMimeType: vi.fn(),
            responseType: '',
            timeout: 0,
            withCredentials: false,
            onload: null,
            onerror: null,
            onprogress: null,
            ontimeout: null
        };
    }

    function makeFile (overrides)
    {
        var file = {
            base64: false,
            url: 'assets/image.png',
            src: 'assets/image.png',
            xhrSettings: {
                responseType: '',
                async: true,
                user: '',
                password: '',
                timeout: 0,
                headers: undefined,
                header: undefined,
                headerValue: undefined,
                requestedWith: false,
                overrideMimeType: undefined,
                withCredentials: false
            },
            onLoad: vi.fn(),
            onError: vi.fn(),
            onProgress: vi.fn(),
            onBase64Load: vi.fn()
        };

        if (overrides)
        {
            for (var key in overrides)
            {
                file[key] = overrides[key];
            }
        }

        return file;
    }

    function makeGlobalXHRSettings ()
    {
        return {
            responseType: '',
            async: true,
            user: '',
            password: '',
            timeout: 0,
            headers: undefined,
            header: undefined,
            headerValue: undefined,
            requestedWith: false,
            overrideMimeType: undefined,
            withCredentials: false
        };
    }

    beforeEach(function ()
    {
        mockXHR = makeMockXHR();
        MockXMLHttpRequest = vi.fn(function () { return mockXHR; });
        vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest);
    });

    afterEach(function ()
    {
        vi.unstubAllGlobals();
    });

    describe('non-base64 file', function ()
    {
        it('should create and return an XMLHttpRequest instance', function ()
        {
            var file = makeFile();
            var globalSettings = makeGlobalXHRSettings();

            var result = XHRLoader(file, globalSettings);

            expect(MockXMLHttpRequest).toHaveBeenCalledOnce();
            expect(result).toBe(mockXHR);
        });

        it('should call xhr.open with GET and file src', function ()
        {
            var file = makeFile({ src: 'assets/sprite.png' });
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.open).toHaveBeenCalledOnce();
            expect(mockXHR.open.mock.calls[0][0]).toBe('GET');
            expect(mockXHR.open.mock.calls[0][1]).toBe('assets/sprite.png');
        });

        it('should pass async flag from merged config to xhr.open', function ()
        {
            var file = makeFile();
            file.xhrSettings.async = false;
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.open.mock.calls[0][2]).toBe(false);
        });

        it('should pass user and password from merged config to xhr.open', function ()
        {
            var file = makeFile();
            file.xhrSettings.user = 'testuser';
            file.xhrSettings.password = 'testpass';
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.open.mock.calls[0][3]).toBe('testuser');
            expect(mockXHR.open.mock.calls[0][4]).toBe('testpass');
        });

        it('should set xhr.responseType from file xhrSettings', function ()
        {
            var file = makeFile();
            file.xhrSettings.responseType = 'arraybuffer';
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.responseType).toBe('arraybuffer');
        });

        it('should set xhr.timeout from merged config', function ()
        {
            var file = makeFile();
            file.xhrSettings.timeout = 5000;
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.timeout).toBe(5000);
        });

        it('should call xhr.send', function ()
        {
            var file = makeFile();
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.send).toHaveBeenCalledOnce();
        });

        it('should bind xhr.onload to file.onLoad', function ()
        {
            var file = makeFile();
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.onload).toBeTypeOf('function');
        });

        it('should bind xhr.onerror to file.onError', function ()
        {
            var file = makeFile();
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.onerror).toBeTypeOf('function');
        });

        it('should bind xhr.onprogress to file.onProgress', function ()
        {
            var file = makeFile();
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.onprogress).toBeTypeOf('function');
        });

        it('should bind xhr.ontimeout to file.onError', function ()
        {
            var file = makeFile();
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.ontimeout).toBeTypeOf('function');
        });

        it('should set request headers from config.headers object', function ()
        {
            var file = makeFile();
            file.xhrSettings.headers = { 'Accept': 'application/json', 'Cache-Control': 'no-cache' };
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Accept', 'application/json');
            expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
        });

        it('should not call setRequestHeader when headers is undefined', function ()
        {
            var file = makeFile();
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.setRequestHeader).not.toHaveBeenCalled();
        });

        it('should set header and headerValue when both are provided', function ()
        {
            var file = makeFile();
            file.xhrSettings.header = 'Authorization';
            file.xhrSettings.headerValue = 'Bearer token123';
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer token123');
        });

        it('should not set header when only header is provided without headerValue', function ()
        {
            var file = makeFile();
            file.xhrSettings.header = 'Authorization';
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.setRequestHeader).not.toHaveBeenCalledWith('Authorization', expect.anything());
        });

        it('should set X-Requested-With header when requestedWith is provided', function ()
        {
            var file = makeFile();
            file.xhrSettings.requestedWith = 'XMLHttpRequest';
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('X-Requested-With', 'XMLHttpRequest');
        });

        it('should not set X-Requested-With when requestedWith is false', function ()
        {
            var file = makeFile();
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            var calls = mockXHR.setRequestHeader.mock.calls;
            var found = calls.some(function (call) { return call[0] === 'X-Requested-With'; });
            expect(found).toBe(false);
        });

        it('should call overrideMimeType when set in config', function ()
        {
            var file = makeFile();
            file.xhrSettings.overrideMimeType = 'application/octet-stream';
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.overrideMimeType).toHaveBeenCalledWith('application/octet-stream');
        });

        it('should not call overrideMimeType when it is undefined', function ()
        {
            var file = makeFile();
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.overrideMimeType).not.toHaveBeenCalled();
        });

        it('should set xhr.withCredentials to true when config.withCredentials is true', function ()
        {
            var file = makeFile();
            file.xhrSettings.withCredentials = true;
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.withCredentials).toBe(true);
        });

        it('should not set xhr.withCredentials when config.withCredentials is false', function ()
        {
            var file = makeFile();
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(mockXHR.withCredentials).toBe(false);
        });

        it('should use global settings as defaults when file xhrSettings values are undefined', function ()
        {
            var file = makeFile();
            file.xhrSettings.timeout = undefined;
            file.xhrSettings.user = undefined;
            var globalSettings = makeGlobalXHRSettings();
            globalSettings.timeout = 3000;
            globalSettings.user = 'globaluser';

            XHRLoader(file, globalSettings);

            expect(mockXHR.timeout).toBe(3000);
            expect(mockXHR.open.mock.calls[0][3]).toBe('globaluser');
        });

        it('should allow file xhrSettings to override global settings', function ()
        {
            var file = makeFile();
            file.xhrSettings.timeout = 9000;
            var globalSettings = makeGlobalXHRSettings();
            globalSettings.timeout = 3000;

            XHRLoader(file, globalSettings);

            expect(mockXHR.timeout).toBe(9000);
        });
    });

    describe('base64 file', function ()
    {
        it('should return undefined for base64 files', function ()
        {
            var file = makeFile({
                base64: true,
                url: 'data:image/png;base64,aGVsbG8='
            });
            var globalSettings = makeGlobalXHRSettings();

            var result = XHRLoader(file, globalSettings);

            expect(result).toBeUndefined();
        });

        it('should not create an XMLHttpRequest for base64 files', function ()
        {
            var file = makeFile({
                base64: true,
                url: 'data:image/png;base64,aGVsbG8='
            });
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(MockXMLHttpRequest).not.toHaveBeenCalled();
        });

        it('should call file.onBase64Load with fakeXHR having responseText for text responseType', function ()
        {
            var file = makeFile({
                base64: true,
                url: 'data:text/plain;base64,aGVsbG8='
            });
            file.xhrSettings.responseType = '';
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(file.onBase64Load).toHaveBeenCalledOnce();
            var fakeXHR = file.onBase64Load.mock.calls[0][0];
            expect(fakeXHR).toHaveProperty('responseText');
            expect(fakeXHR.responseText).toBe('hello');
        });

        it('should call file.onBase64Load with fakeXHR having response ArrayBuffer for arraybuffer responseType', function ()
        {
            var file = makeFile({
                base64: true,
                url: 'data:image/png;base64,aGVsbG8='
            });
            file.xhrSettings.responseType = 'arraybuffer';
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(file.onBase64Load).toHaveBeenCalledOnce();
            var fakeXHR = file.onBase64Load.mock.calls[0][0];
            expect(fakeXHR).toHaveProperty('response');
            expect(fakeXHR.response).toBeInstanceOf(ArrayBuffer);
        });

        it('should decode arraybuffer base64 data to correct bytes', function ()
        {
            // 'hello' in base64 is 'aGVsbG8='
            var file = makeFile({
                base64: true,
                url: 'data:application/octet-stream;base64,aGVsbG8='
            });
            file.xhrSettings.responseType = 'arraybuffer';
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            var fakeXHR = file.onBase64Load.mock.calls[0][0];
            var bytes = new Uint8Array(fakeXHR.response);
            // 'hello' = [104, 101, 108, 108, 111]
            expect(bytes[0]).toBe(104);
            expect(bytes[1]).toBe(101);
            expect(bytes[2]).toBe(108);
            expect(bytes[3]).toBe(108);
            expect(bytes[4]).toBe(111);
        });

        it('should extract base64 data from a plain base64 string URL', function ()
        {
            // URL with no data URI prefix — split(';base64,').pop() returns the whole string
            var file = makeFile({
                base64: true,
                url: 'aGVsbG8='
            });
            file.xhrSettings.responseType = '';
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            expect(file.onBase64Load).toHaveBeenCalledOnce();
            var fakeXHR = file.onBase64Load.mock.calls[0][0];
            expect(fakeXHR.responseText).toBe('hello');
        });

        it('should not set responseText property when responseType is arraybuffer', function ()
        {
            var file = makeFile({
                base64: true,
                url: 'data:image/png;base64,aGVsbG8='
            });
            file.xhrSettings.responseType = 'arraybuffer';
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            var fakeXHR = file.onBase64Load.mock.calls[0][0];
            expect(fakeXHR).not.toHaveProperty('responseText');
        });

        it('should not set response property when responseType is not arraybuffer', function ()
        {
            var file = makeFile({
                base64: true,
                url: 'data:text/plain;base64,aGVsbG8='
            });
            file.xhrSettings.responseType = 'text';
            var globalSettings = makeGlobalXHRSettings();

            XHRLoader(file, globalSettings);

            var fakeXHR = file.onBase64Load.mock.calls[0][0];
            expect(fakeXHR).not.toHaveProperty('response');
        });
    });
});
