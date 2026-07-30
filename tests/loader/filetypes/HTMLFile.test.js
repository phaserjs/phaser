var HTMLFile = require('../../../src/loader/filetypes/HTMLFile');
var CONST = require('../../../src/loader/const');

function createMockLoader ()
{
    return {
        cacheManager: {
            html: {}
        },
        prefix: '',
        path: '',
        crossOrigin: undefined
    };
}

function createHTMLFile (key, url, xhrSettings)
{
    var loader = createMockLoader();
    return new HTMLFile(loader, key, url, xhrSettings);
}

describe('HTMLFile', function ()
{
    describe('constructor (string key)', function ()
    {
        it('should set type to text', function ()
        {
            var file = createHTMLFile('mypage', 'page.html');
            expect(file.type).toBe('text');
        });

        it('should set key correctly', function ()
        {
            var file = createHTMLFile('mypage', 'page.html');
            expect(file.key).toBe('mypage');
        });

        it('should set url correctly', function ()
        {
            var file = createHTMLFile('mypage', 'page.html');
            expect(file.url).toBe('page.html');
        });

        it('should set cache to loader cacheManager.html', function ()
        {
            var loader = createMockLoader();
            var file = new HTMLFile(loader, 'mypage', 'page.html');
            expect(file.cache).toBe(loader.cacheManager.html);
        });

        it('should default url to key.html when url is not provided', function ()
        {
            var file = createHTMLFile('story');
            expect(file.url).toBe('story.html');
        });

        it('should set responseType to text via xhrSettings', function ()
        {
            var file = createHTMLFile('mypage', 'page.html');
            expect(file.xhrSettings.responseType).toBe('text');
        });

        it('should set state to FILE_PENDING', function ()
        {
            var file = createHTMLFile('mypage', 'page.html');
            expect(file.state).toBe(CONST.FILE_PENDING);
        });
    });

    describe('constructor (config object)', function ()
    {
        it('should accept a plain object config with key and url', function ()
        {
            var loader = createMockLoader();
            var file = new HTMLFile(loader, { key: 'login', url: 'forms/login.html' });
            expect(file.key).toBe('login');
            expect(file.url).toBe('forms/login.html');
        });

        it('should use default html extension from config when no extension given', function ()
        {
            var loader = createMockLoader();
            var file = new HTMLFile(loader, { key: 'login' });
            expect(file.url).toBe('login.html');
        });

        it('should use custom extension from config', function ()
        {
            var loader = createMockLoader();
            var file = new HTMLFile(loader, { key: 'template', url: 'template.htm', extension: 'htm' });
            expect(file.url).toBe('template.htm');
        });

        it('should use xhrSettings from config object', function ()
        {
            var loader = createMockLoader();
            var xhrSettings = { responseType: 'text', async: true };
            var file = new HTMLFile(loader, { key: 'page', url: 'page.html', xhrSettings: xhrSettings });
            expect(file.xhrSettings).toBeDefined();
        });

        it('should set type to text when using config object', function ()
        {
            var loader = createMockLoader();
            var file = new HTMLFile(loader, { key: 'page', url: 'page.html' });
            expect(file.type).toBe('text');
        });
    });

    describe('constructor (with loader prefix)', function ()
    {
        it('should prepend loader prefix to key', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'LEVEL1.';
            var file = new HTMLFile(loader, 'story', 'story.html');
            expect(file.key).toBe('LEVEL1.story');
        });
    });

    describe('onProcess', function ()
    {
        it('should set state to FILE_PROCESSING', function ()
        {
            var file = createHTMLFile('mypage', 'page.html');
            file.xhrLoader = { responseText: '<p>Hello</p>' };
            file.onProcessComplete = function () {};
            file.onProcess();
            expect(file.state).toBe(CONST.FILE_PROCESSING);
        });

        it('should set data to xhrLoader responseText', function ()
        {
            var file = createHTMLFile('mypage', 'page.html');
            var htmlContent = '<div class="form"><input type="text" /></div>';
            file.xhrLoader = { responseText: htmlContent };
            file.onProcessComplete = function () {};
            file.onProcess();
            expect(file.data).toBe(htmlContent);
        });

        it('should call onProcessComplete', function ()
        {
            var file = createHTMLFile('mypage', 'page.html');
            file.xhrLoader = { responseText: '<p>test</p>' };
            var called = false;
            file.onProcessComplete = function () { called = true; };
            file.onProcess();
            expect(called).toBe(true);
        });

        it('should handle empty responseText', function ()
        {
            var file = createHTMLFile('mypage', 'page.html');
            file.xhrLoader = { responseText: '' };
            file.onProcessComplete = function () {};
            file.onProcess();
            expect(file.data).toBe('');
        });

        it('should handle multiline HTML responseText', function ()
        {
            var file = createHTMLFile('mypage', 'page.html');
            var multiline = '<html>\n<body>\n<p>Hello</p>\n</body>\n</html>';
            file.xhrLoader = { responseText: multiline };
            file.onProcessComplete = function () {};
            file.onProcess();
            expect(file.data).toBe(multiline);
        });

        it('should set FILE_PROCESSING state before calling onProcessComplete', function ()
        {
            var file = createHTMLFile('mypage', 'page.html');
            file.xhrLoader = { responseText: '<p>test</p>' };
            var stateAtComplete;
            file.onProcessComplete = function () { stateAtComplete = file.state; };
            file.onProcess();
            expect(stateAtComplete).toBe(CONST.FILE_PROCESSING);
        });
    });
});
