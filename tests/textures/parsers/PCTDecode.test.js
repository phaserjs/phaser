var PCTDecode = require('../../../src/textures/parsers/PCTDecode');

describe('Phaser.Textures.Parsers.PCTDecode', function ()
{
    var warnSpy;

    beforeEach(function ()
    {
        //  Silence the console.warn calls made by the decoder for invalid input so
        //  the test runner output stays clean. Individual tests that want to assert
        //  on the warnings read from warnSpy.mock.calls directly.
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});
    });

    afterEach(function ()
    {
        warnSpy.mockRestore();
    });

    // -------------------------------------------------------------------------
    // Header / version validation
    // -------------------------------------------------------------------------

    describe('header validation', function ()
    {
        it('should return null for a non-string input', function ()
        {
            expect(PCTDecode(null)).toBeNull();
            expect(PCTDecode(undefined)).toBeNull();
            expect(PCTDecode(42)).toBeNull();
            expect(PCTDecode({})).toBeNull();
        });

        it('should return null for an empty string', function ()
        {
            expect(PCTDecode('')).toBeNull();
        });

        it('should return null when the PCT: header is missing', function ()
        {
            var text = 'P:atlas_0.png,RGBA8888,256,256,0\n';

            expect(PCTDecode(text)).toBeNull();
        });

        it('should warn when the PCT: header is missing', function ()
        {
            PCTDecode('P:atlas_0.png,RGBA8888,256,256,0\n');

            expect(warnSpy).toHaveBeenCalled();
        });

        it('should return null for an unsupported major version', function ()
        {
            var text = 'PCT:2.0\nP:atlas_0.png,RGBA8888,256,256,0\n';

            expect(PCTDecode(text)).toBeNull();
        });

        it('should warn for an unsupported major version', function ()
        {
            PCTDecode('PCT:2.0\nP:atlas_0.png,RGBA8888,256,256,0\n');

            expect(warnSpy).toHaveBeenCalled();
        });

        it('should accept version 1.0', function ()
        {
            var text = 'PCT:1.0\nP:atlas_0.png,RGBA8888,256,256,0\n';

            expect(PCTDecode(text)).not.toBeNull();
        });

        it('should accept minor version greater than 0', function ()
        {
            //  Minor bumps must load successfully in a 1.0 parser
            var text = 'PCT:1.5\nP:atlas_0.png,RGBA8888,256,256,0\n';

            expect(PCTDecode(text)).not.toBeNull();
        });

        it('should strip a trailing CR from the header line', function ()
        {
            var text = 'PCT:1.0\r\nP:atlas_0.png,RGBA8888,256,256,0\r\n';

            expect(PCTDecode(text)).not.toBeNull();
        });
    });

    // -------------------------------------------------------------------------
    // Page header (P:)
    // -------------------------------------------------------------------------

    describe('page headers', function ()
    {
        it('should parse a single page header into the pages array', function ()
        {
            var text = 'PCT:1.0\nP:atlas_0.png,RGBA8888,1024,512,2\n';
            var result = PCTDecode(text);

            expect(result.pages).toEqual([
                { filename: 'atlas_0.png', format: 'RGBA8888', width: 1024, height: 512, padding: 2 }
            ]);
        });

        it('should parse multiple page headers in order', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,2048,512,2\n' +
                'P:atlas_1.png,RGBA8888,1024,256,4\n';

            var result = PCTDecode(text);

            expect(result.pages.length).toBe(2);
            expect(result.pages[0].filename).toBe('atlas_0.png');
            expect(result.pages[1].filename).toBe('atlas_1.png');
            expect(result.pages[0].padding).toBe(2);
            expect(result.pages[1].padding).toBe(4);
        });
    });

    // -------------------------------------------------------------------------
    // Folder dictionary (F:)
    // -------------------------------------------------------------------------

    describe('folder dictionary', function ()
    {
        it('should return an empty folders array when there are no F: lines', function ()
        {
            var text = 'PCT:1.0\nP:atlas_0.png,RGBA8888,256,256,0\n';
            var result = PCTDecode(text);

            expect(result.folders).toEqual([]);
        });

        it('should parse folder entries in declaration order', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'F:warrior\n' +
                'F:knight\n' +
                'F:effects\n';

            var result = PCTDecode(text);

            expect(result.folders).toEqual([ 'warrior', 'knight', 'effects' ]);
        });

        it('should allow folder names with slashes', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'F:knight/idle\n';

            var result = PCTDecode(text);

            expect(result.folders[0]).toBe('knight/idle');
        });
    });

    // -------------------------------------------------------------------------
    // Block (B:) header and block names line
    // -------------------------------------------------------------------------

    describe('block headers and names', function ()
    {
        it('should expand a simple single-row block (spec Example 1)', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,1024,256,2\n' +
                'B:2,2,8,64,64\n' +
                'frame#1-8\n';

            var result = PCTDecode(text);
            var names = Object.keys(result.frames);

            expect(names.length).toBe(8);

            // Positions documented in the spec: blockX=2, padding=2, cellW=64+4=68
            var expected = [ 4, 72, 140, 208, 276, 344, 412, 480 ];

            for (var i = 0; i < 8; i++)
            {
                var frame = result.frames['frame' + (i + 1)];

                expect(frame).toBeDefined();
                expect(frame.x).toBe(expected[i]);
                expect(frame.y).toBe(4);
                expect(frame.w).toBe(64);
                expect(frame.h).toBe(64);
                expect(frame.trimmed).toBe(false);
                expect(frame.page).toBe(0);
            }
        });

        it('should lay out multi-row blocks by col = i % cols, row = floor(i/cols)', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,512,512,0\n' +
                'B:0,0,3,10,10\n' +
                'a,b,c,d,e,f\n';

            var result = PCTDecode(text);

            // padding=0 → cellW=10, cellH=10
            expect(result.frames.a).toMatchObject({ x: 0,  y: 0  });
            expect(result.frames.b).toMatchObject({ x: 10, y: 0  });
            expect(result.frames.c).toMatchObject({ x: 20, y: 0  });
            expect(result.frames.d).toMatchObject({ x: 0,  y: 10 });
            expect(result.frames.e).toMatchObject({ x: 10, y: 10 });
            expect(result.frames.f).toMatchObject({ x: 20, y: 10 });
        });

        it('should parse trimmed block headers and copy the trim data onto each frame', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,2048,512,2\n' +
                'B:2,2,6,120,108|134,120,4,6\n' +
                'frame#01-06\n';

            var result = PCTDecode(text);
            var f1 = result.frames.frame01;

            expect(f1.trimmed).toBe(true);
            expect(f1.sourceW).toBe(134);
            expect(f1.sourceH).toBe(120);
            expect(f1.trimX).toBe(4);
            expect(f1.trimY).toBe(6);
            //  The w/h on a trimmed frame still reflects the in-atlas packed size
            expect(f1.w).toBe(120);
            expect(f1.h).toBe(108);
        });

        it('should default sourceW/H/trimX/trimY for untrimmed blocks', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'B:0,0,2,32,32\n' +
                'a,b\n';

            var result = PCTDecode(text);

            expect(result.frames.a.sourceW).toBe(32);
            expect(result.frames.a.sourceH).toBe(32);
            expect(result.frames.a.trimX).toBe(0);
            expect(result.frames.a.trimY).toBe(0);
            expect(result.frames.a.trimmed).toBe(false);
        });

        it('should consume the next line as block names even if it starts with #', function ()
        {
            // Edge case: the reorder fix ensures a pending block always consumes
            // the next non-empty line, even if it happens to start with '#'.
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'B:0,0,3,10,10\n' +
                '#1-3\n';

            var result = PCTDecode(text);

            expect(Object.keys(result.frames).sort()).toEqual([ '1', '2', '3' ]);
            expect(result.frames['1'].x).toBe(0);
            expect(result.frames['2'].x).toBe(10);
            expect(result.frames['3'].x).toBe(20);
        });
    });

    // -------------------------------------------------------------------------
    // Range compression
    // -------------------------------------------------------------------------

    describe('range compression', function ()
    {
        it('should zero-pad generated numbers when startStr has a leading zero', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'B:0,0,12,10,10\n' +
                'idle_#001-012\n';

            var result = PCTDecode(text);

            expect(result.frames.idle_001).toBeDefined();
            expect(result.frames.idle_012).toBeDefined();
            //  idle_12 (non-padded) should NOT be emitted
            expect(result.frames.idle_12).toBeUndefined();
        });

        it('should not zero-pad when the start number has no leading zero', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'B:0,0,5,10,10\n' +
                'frame#1-5\n';

            var result = PCTDecode(text);

            expect(result.frames.frame1).toBeDefined();
            expect(result.frames.frame5).toBeDefined();
            expect(result.frames.frame01).toBeUndefined();
        });

        it('should emit literal comma-separated names without expansion', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'B:0,0,3,10,10\n' +
                'alpha,beta,gamma\n';

            var result = PCTDecode(text);

            expect(result.frames.alpha).toBeDefined();
            expect(result.frames.beta).toBeDefined();
            expect(result.frames.gamma).toBeDefined();
        });

        it('should mix literal names and ranges on the same line', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'B:0,0,5,10,10\n' +
                'intro,frame#1-3,outro\n';

            var result = PCTDecode(text);

            expect(Object.keys(result.frames).sort()).toEqual([
                'frame1', 'frame2', 'frame3', 'intro', 'outro'
            ]);
        });
    });

    // -------------------------------------------------------------------------
    // Folder and extension index resolution
    // -------------------------------------------------------------------------

    describe('name encoding', function ()
    {
        it('should resolve folder indices via "N/rest" prefix', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'F:warrior\n' +
                'F:knight\n' +
                'B:0,0,2,10,10\n' +
                '0/idle,1/idle\n';

            var result = PCTDecode(text);

            expect(result.frames['warrior/idle']).toBeDefined();
            expect(result.frames['knight/idle']).toBeDefined();
        });

        it('should not treat a non-numeric segment before slash as a folder index', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'F:warrior\n' +
                'B:0,0,1,10,10\n' +
                'abc/def\n';

            var result = PCTDecode(text);

            //  abc/def should NOT be resolved through the folder table
            expect(result.frames['abc/def']).toBeDefined();
            expect(result.frames['warrior/def']).toBeUndefined();
        });

        it('should apply the line-level ~N extension suffix to all block names', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'B:0,0,3,10,10\n' +
                'a,b,c~1\n';

            var result = PCTDecode(text);

            expect(result.frames['a.png']).toBeDefined();
            expect(result.frames['b.png']).toBeDefined();
            expect(result.frames['c.png']).toBeDefined();
        });

        it('should apply the hardcoded extension dictionary correctly', function ()
        {
            //  1=.png, 2=.webp, 3=.jpg, 4=.jpeg, 5=.gif
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'one~1|0|0,0,1,1\n' +
                'two~2|0|0,0,1,1\n' +
                'three~3|0|0,0,1,1\n' +
                'four~4|0|0,0,1,1\n' +
                'five~5|0|0,0,1,1\n';

            var result = PCTDecode(text);

            expect(result.frames['one.png']).toBeDefined();
            expect(result.frames['two.webp']).toBeDefined();
            expect(result.frames['three.jpg']).toBeDefined();
            expect(result.frames['four.jpeg']).toBeDefined();
            expect(result.frames['five.gif']).toBeDefined();
        });

        it('should compose folder index, range compression and extension suffix', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'F:warrior\n' +
                'B:0,0,4,10,10\n' +
                '0/idle_#01-04~1\n';

            var result = PCTDecode(text);

            expect(result.frames['warrior/idle_01.png']).toBeDefined();
            expect(result.frames['warrior/idle_02.png']).toBeDefined();
            expect(result.frames['warrior/idle_03.png']).toBeDefined();
            expect(result.frames['warrior/idle_04.png']).toBeDefined();
        });

        it('should leave names with a raw .ext suffix untouched', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'heightmap.tga|0|0,0,32,32\n';

            var result = PCTDecode(text);

            expect(result.frames['heightmap.tga']).toBeDefined();
        });
    });

    // -------------------------------------------------------------------------
    // Individual frames
    // -------------------------------------------------------------------------

    describe('individual frames', function ()
    {
        it('should parse an untrimmed individual frame', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,1\n' +
                'logo|0|1,1,200,180\n';

            var result = PCTDecode(text);
            var logo = result.frames.logo;

            expect(logo).toBeDefined();
            expect(logo.x).toBe(1);
            expect(logo.y).toBe(1);
            expect(logo.w).toBe(200);
            expect(logo.h).toBe(180);
            expect(logo.trimmed).toBe(false);
            expect(logo.rotated).toBe(false);
            //  sourceW/H default to w/h for untrimmed
            expect(logo.sourceW).toBe(200);
            expect(logo.sourceH).toBe(180);
            expect(logo.trimX).toBe(0);
            expect(logo.trimY).toBe(0);
        });

        it('should parse a trimmed individual frame with trim data in one segment', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,1024,512,0\n' +
                'shield|2|726,48,72,68|80,80,4,6\n';

            var result = PCTDecode(text);
            var shield = result.frames.shield;

            expect(shield.trimmed).toBe(true);
            expect(shield.x).toBe(726);
            expect(shield.y).toBe(48);
            expect(shield.w).toBe(72);
            expect(shield.h).toBe(68);
            expect(shield.sourceW).toBe(80);
            expect(shield.sourceH).toBe(80);
            expect(shield.trimX).toBe(4);
            expect(shield.trimY).toBe(6);
        });

        it('should set rotated=true when flag bit 0 is set', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'r|1|0,0,32,32\n';

            var result = PCTDecode(text);

            expect(result.frames.r.rotated).toBe(true);
            expect(result.frames.r.trimmed).toBe(false);
        });

        it('should set both trimmed and rotated when flags=3', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'rt|3|0,0,32,32|40,40,2,2\n';

            var result = PCTDecode(text);

            expect(result.frames.rt.rotated).toBe(true);
            expect(result.frames.rt.trimmed).toBe(true);
            expect(result.frames.rt.sourceW).toBe(40);
            expect(result.frames.rt.trimX).toBe(2);
        });

        it('should associate individual frames with the current #page', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'P:atlas_1.png,RGBA8888,256,256,0\n' +
                'a|0|0,0,10,10\n' +
                '#1\n' +
                'b|0|0,0,10,10\n';

            var result = PCTDecode(text);

            expect(result.frames.a.page).toBe(0);
            expect(result.frames.b.page).toBe(1);
        });

        it('should skip individual frame lines with fewer than 3 pipe segments', function ()
        {
            //  These are unknown/future record types and must be silently ignored.
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'some-future-line\n' +
                'another|one\n' +
                'ok|0|0,0,10,10\n';

            var result = PCTDecode(text);

            expect(result.frames.ok).toBeDefined();
            expect(Object.keys(result.frames).length).toBe(1);
        });
    });

    // -------------------------------------------------------------------------
    // Page selector (#)
    // -------------------------------------------------------------------------

    describe('page selector', function ()
    {
        it('should route subsequent block frames to the selected page', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'P:atlas_1.png,RGBA8888,256,256,0\n' +
                '#1\n' +
                'B:0,0,2,10,10\n' +
                'a,b\n';

            var result = PCTDecode(text);

            expect(result.frames.a.page).toBe(1);
            expect(result.frames.b.page).toBe(1);
        });

        it('should default to page 0 when no # selector is used', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'logo|0|0,0,10,10\n';

            var result = PCTDecode(text);

            expect(result.frames.logo.page).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // Aliases (A:)
    // -------------------------------------------------------------------------

    describe('aliases', function ()
    {
        it('should create duplicate frames that share the original\'s position', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'orig|0|42,24,16,16\n' +
                'A:orig=dup1,dup2\n';

            var result = PCTDecode(text);

            expect(result.frames.dup1).toBeDefined();
            expect(result.frames.dup2).toBeDefined();
            expect(result.frames.dup1.x).toBe(42);
            expect(result.frames.dup1.y).toBe(24);
            expect(result.frames.dup2.x).toBe(42);
            expect(result.frames.dup2.y).toBe(24);
        });

        it('should set the duplicate\'s key to its own name, not the original\'s', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'orig|0|0,0,10,10\n' +
                'A:orig=dup\n';

            var result = PCTDecode(text);

            expect(result.frames.dup.key).toBe('dup');
            expect(result.frames.orig.key).toBe('orig');
        });

        it('should deep-copy so mutating a duplicate does not affect the original', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'orig|0|5,5,10,10\n' +
                'A:orig=dup\n';

            var result = PCTDecode(text);

            result.frames.dup.x = 999;

            expect(result.frames.orig.x).toBe(5);
        });

        it('should silently skip aliases that reference a missing original', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'A:does_not_exist=dup\n';

            var result = PCTDecode(text);

            expect(result.frames.dup).toBeUndefined();
        });

        it('should silently skip malformed alias lines with no = separator', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'orig|0|0,0,10,10\n' +
                'A:no_equals_sign_here\n';

            var result = PCTDecode(text);

            expect(result.frames.orig).toBeDefined();
        });

        it('should resolve folder and extension indices on both sides of the = sign', function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                'F:warrior\n' +
                'B:0,0,3,10,10\n' +
                '0/idle_#01-03~1\n' +
                'A:0/idle_01~1=0/idle_02,0/idle_03~1\n';

            var result = PCTDecode(text);

            //  Both idle_02.png and idle_03.png existed from the block expansion,
            //  and the alias should overwrite them with copies of idle_01.
            expect(result.frames['warrior/idle_02.png'].x).toBe(result.frames['warrior/idle_01.png'].x);
            expect(result.frames['warrior/idle_03.png'].x).toBe(result.frames['warrior/idle_01.png'].x);
        });
    });

    // -------------------------------------------------------------------------
    // Line ending handling
    // -------------------------------------------------------------------------

    describe('line endings', function ()
    {
        it('should handle CRLF line endings throughout the file', function ()
        {
            var text =
                'PCT:1.0\r\n' +
                'P:atlas_0.png,RGBA8888,256,256,1\r\n' +
                'logo|0|1,1,200,180\r\n';

            var result = PCTDecode(text);

            expect(result.frames.logo).toBeDefined();
            expect(result.frames.logo.x).toBe(1);
            expect(result.frames.logo.w).toBe(200);
        });

        it('should skip empty lines without breaking', function ()
        {
            var text =
                'PCT:1.0\n' +
                '\n' +
                'P:atlas_0.png,RGBA8888,256,256,0\n' +
                '\n' +
                'logo|0|0,0,10,10\n' +
                '\n';

            var result = PCTDecode(text);

            expect(result.frames.logo).toBeDefined();
        });
    });

    // -------------------------------------------------------------------------
    // End-to-end spec example
    // -------------------------------------------------------------------------

    describe('full spec Example 2', function ()
    {
        var result;

        beforeEach(function ()
        {
            var text =
                'PCT:1.0\n' +
                'P:atlas_0.png,RGBA8888,2048,512,2\n' +
                'P:atlas_1.png,RGBA8888,2048,256,2\n' +
                'F:warrior\n' +
                'F:knight\n' +
                'F:effects\n' +
                '#0\n' +
                'B:2,2,6,120,108|134,120,4,6\n' +
                '0/idle_#01-24~1\n' +
                'B:2,222,6,120,108|134,120,4,6\n' +
                '1/idle_#01-18~1\n' +
                'sword~1|0|726,2,86,42\n' +
                'shield~1|2|726,48,72,68|80,80,4,6\n' +
                '#1\n' +
                'B:2,2,10,48,48\n' +
                '2/spark_#01-30~1\n' +
                'A:0/idle_01~1=0/idle_12,0/idle_18~1\n' +
                'A:1/idle_01~1=1/idle_09~1\n';

            result = PCTDecode(text);
        });

        it('should decode both pages', function ()
        {
            expect(result.pages.length).toBe(2);
            expect(result.pages[0].filename).toBe('atlas_0.png');
            expect(result.pages[1].filename).toBe('atlas_1.png');
        });

        it('should decode all three folders', function ()
        {
            expect(result.folders).toEqual([ 'warrior', 'knight', 'effects' ]);
        });

        it('should produce 24 warrior + 18 knight + 30 effects + 2 individual = 74 frames', function ()
        {
            expect(Object.keys(result.frames).length).toBe(74);
        });

        it('should place warrior/idle_01.png at the documented position (4, 4)', function ()
        {
            var f = result.frames['warrior/idle_01.png'];

            expect(f.x).toBe(4);
            expect(f.y).toBe(4);
            expect(f.trimmed).toBe(true);
            expect(f.sourceW).toBe(134);
            expect(f.sourceH).toBe(120);
            expect(f.trimX).toBe(4);
            expect(f.trimY).toBe(6);
        });

        it('should place warrior/idle_24.png at the last cell of a 4-row block', function ()
        {
            //  cols=6, index 23 → col=5, row=3
            //  cellW = 120+4 = 124, cellH = 108+4 = 112
            //  x = 2 + 5*124 + 2 = 624
            //  y = 2 + 3*112 + 2 = 340
            var f = result.frames['warrior/idle_24.png'];

            expect(f.x).toBe(624);
            expect(f.y).toBe(340);
        });

        it('should place knight/idle_01.png in the second block at (4, 224)', function ()
        {
            var f = result.frames['knight/idle_01.png'];

            expect(f.x).toBe(4);
            expect(f.y).toBe(224);
        });

        it('should route effects/spark_01.png to page 1', function ()
        {
            expect(result.frames['effects/spark_01.png'].page).toBe(1);
        });

        it('should decode the untrimmed sword individual frame', function ()
        {
            var s = result.frames['sword.png'];

            expect(s.x).toBe(726);
            expect(s.y).toBe(2);
            expect(s.w).toBe(86);
            expect(s.h).toBe(42);
            expect(s.trimmed).toBe(false);
            expect(s.page).toBe(0);
        });

        it('should decode the trimmed shield individual frame', function ()
        {
            var s = result.frames['shield.png'];

            expect(s.trimmed).toBe(true);
            expect(s.sourceW).toBe(80);
            expect(s.sourceH).toBe(80);
            expect(s.trimX).toBe(4);
            expect(s.trimY).toBe(6);
        });

        it('should make the warrior aliases share the original\'s atlas position', function ()
        {
            var orig = result.frames['warrior/idle_01.png'];
            var a1 = result.frames['warrior/idle_12.png'];
            var a2 = result.frames['warrior/idle_18.png'];

            expect(a1.x).toBe(orig.x);
            expect(a1.y).toBe(orig.y);
            expect(a2.x).toBe(orig.x);
            expect(a2.y).toBe(orig.y);
        });
    });
});
