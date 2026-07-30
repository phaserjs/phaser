/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  Hardcoded extension dictionary, as defined by the PCT format specification
var EXT = { 1: '.png', 2: '.webp', 3: '.jpg', 4: '.jpeg', 5: '.gif' };

var isAllDigits = function (str)
{
    if (str.length === 0)
    {
        return false;
    }

    for (var i = 0; i < str.length; i++)
    {
        var c = str.charCodeAt(i);

        if (c < 48 || c > 57)
        {
            return false;
        }
    }

    return true;
};

var zeroPad = function (n, len)
{
    var s = String(n);

    while (s.length < len)
    {
        s = '0' + s;
    }

    return s;
};

var resolveFullName = function (raw, folders, extSuffix)
{
    var name = raw;
    var folder = '';

    //  Folder index: "N/rest"
    var slashIdx = name.indexOf('/');

    if (slashIdx > 0 && isAllDigits(name.substring(0, slashIdx)))
    {
        var folderIdx = parseInt(name.substring(0, slashIdx), 10);

        folder = folders[folderIdx];

        name = name.substring(slashIdx + 1);
    }

    //  Extension index: "name~N" (per-name, overrides line-level)
    var extMatch = /~([1-5])$/.exec(name);

    if (extMatch)
    {
        var ext = EXT[parseInt(extMatch[1], 10)];

        name = name.substring(0, name.length - 2) + ext;
    }
    else if (extSuffix)
    {
        name = name + extSuffix;
    }

    if (folder)
    {
        return folder + '/' + name;
    }

    return name;
};

var expandNames = function (line, folders)
{
    //  Check for trailing extension suffix: ~N at very end
    var extSuffix = '';
    var extMatch = /~([1-5])$/.exec(line);

    if (extMatch)
    {
        extSuffix = EXT[parseInt(extMatch[1], 10)];

        line = line.substring(0, line.length - 2);
    }

    var results = [];
    var segments = line.split(',');

    for (var s = 0; s < segments.length; s++)
    {
        var segment = segments[s];
        var hashIdx = segment.indexOf('#');

        if (hashIdx >= 0)
        {
            var prefix = segment.substring(0, hashIdx);
            var range = segment.substring(hashIdx + 1);
            var dashIdx = range.indexOf('-');
            var startStr = range.substring(0, dashIdx);
            var endStr = range.substring(dashIdx + 1);
            var start = parseInt(startStr, 10);
            var end = parseInt(endStr, 10);
            var padLen = (startStr.length > 1 && startStr.charAt(0) === '0') ? startStr.length : 0;

            for (var i = start; i <= end; i++)
            {
                var numStr = (padLen > 0) ? zeroPad(i, padLen) : String(i);

                results.push(resolveFullName(prefix + numStr, folders, extSuffix));
            }
        }
        else
        {
            results.push(resolveFullName(segment, folders, extSuffix));
        }
    }

    return results;
};

/**
 * Decodes a Phaser Compact Texture Atlas (PCT) file from its raw text representation into a
 * structured object.
 *
 * This is a standalone helper used by both the PCT atlas loader and the `PCT` texture parser.
 * It converts the line-oriented PCT text format into an object containing a `pages` array
 * (one entry per atlas page), a `folders` dictionary, and a `frames` map with fully-resolved
 * frame names and positions. Frame `page` indices map directly to the `pages` array.
 *
 * The function validates the version header and rejects files with an unsupported major
 * version or a missing `PCT:` header, returning `null` in those cases after logging a warning.
 * Unknown line prefixes introduced in future minor versions are silently skipped, as required
 * by the specification.
 *
 * See the Phaser Compact Texture Atlas Format Specification document for a full description
 * of the format and the semantics of the returned object.
 *
 * @function Phaser.Textures.Parsers.PCTDecode
 * @memberof Phaser.Textures.Parsers
 * @since 4.0.0
 *
 * @param {string} text - The raw text contents of a `.pct` file.
 *
 * @return {?{pages: object[], folders: string[], frames: object}} The decoded PCT structure, or `null` if the input is invalid.
 */
var PCTDecode = function (text)
{
    if (typeof text !== 'string' || text.length === 0)
    {
        console.warn('Invalid PCT file: empty or not a string');
        return null;
    }

    var lines = text.split('\n');

    //  Validate the version header - must be the first line
    var firstLine = lines[0];

    if (firstLine.charCodeAt(firstLine.length - 1) === 13)
    {
        firstLine = firstLine.substring(0, firstLine.length - 1);
    }

    if (!firstLine || firstLine.indexOf('PCT:') !== 0)
    {
        console.warn('Not a PCT file: missing PCT: header');
        return null;
    }

    var versionStr = firstLine.substring(4);
    var versionParts = versionStr.split('.');
    var major = parseInt(versionParts[0], 10);

    if (isNaN(major) || major > 1)
    {
        console.warn('Unsupported PCT version: ' + versionStr);
        return null;
    }

    var pages = [];
    var folders = [];
    var frames = {};
    var currentPage = 0;
    var pendingBlock = null;

    for (var i = 1; i < lines.length; i++)
    {
        var line = lines[i];

        if (!line)
        {
            continue;
        }

        //  Strip trailing \r if the file uses CRLF line endings
        if (line.charCodeAt(line.length - 1) === 13)
        {
            line = line.substring(0, line.length - 1);

            if (!line)
            {
                continue;
            }
        }

        //  A pending block ALWAYS consumes the next non-empty line as its
        //  names line, regardless of what prefix character that line starts
        //  with. This must be checked before any prefix-based dispatch below.
        if (pendingBlock !== null)
        {
            var blk = pendingBlock;
            pendingBlock = null;

            var padding = pages[blk.page].padding;
            var cellW = blk.frameW + padding * 2;
            var cellH = blk.frameH + padding * 2;
            var names = expandNames(line, folders);

            for (var n = 0; n < names.length; n++)
            {
                var col = n % blk.cols;
                var row = Math.floor(n / blk.cols);
                var blockName = names[n];
                var blockFrame = {
                    key: blockName,
                    page: blk.page,
                    x: blk.x + col * cellW + padding,
                    y: blk.y + row * cellH + padding,
                    w: blk.frameW,
                    h: blk.frameH,
                    trimmed: blk.trimmed,
                    rotated: false
                };

                if (blk.trimmed)
                {
                    blockFrame.sourceW = blk.sourceW;
                    blockFrame.sourceH = blk.sourceH;
                    blockFrame.trimX = blk.trimX;
                    blockFrame.trimY = blk.trimY;
                }
                else
                {
                    blockFrame.sourceW = blk.frameW;
                    blockFrame.sourceH = blk.frameH;
                    blockFrame.trimX = 0;
                    blockFrame.trimY = 0;
                }

                frames[blockName] = blockFrame;
            }

            continue;
        }

        var prefix2 = line.substring(0, 2);

        if (prefix2 === 'P:')
        {
            var parts = line.substring(2).split(',');

            pages.push({
                filename: parts[0],
                format: parts[1],
                width: parseInt(parts[2], 10),
                height: parseInt(parts[3], 10),
                padding: parseInt(parts[4], 10)
            });
        }
        else if (prefix2 === 'F:')
        {
            folders.push(line.substring(2));
        }
        else if (line.charAt(0) === '#')
        {
            currentPage = parseInt(line.substring(1), 10);
        }
        else if (prefix2 === 'B:')
        {
            var trimParts = line.substring(2).split('|');
            var main = trimParts[0].split(',');
            var block = {
                page: currentPage,
                x: parseInt(main[0], 10),
                y: parseInt(main[1], 10),
                cols: parseInt(main[2], 10),
                frameW: parseInt(main[3], 10),
                frameH: parseInt(main[4], 10),
                trimmed: trimParts.length > 1
            };

            if (block.trimmed)
            {
                var trim = trimParts[1].split(',');

                block.sourceW = parseInt(trim[0], 10);
                block.sourceH = parseInt(trim[1], 10);
                block.trimX = parseInt(trim[2], 10);
                block.trimY = parseInt(trim[3], 10);
            }

            pendingBlock = block;
        }
        else if (prefix2 === 'A:')
        {
            //  Alias: A:originalName=dupName1,dupName2,...
            var eqIdx = line.indexOf('=', 2);

            if (eqIdx === -1)
            {
                continue;
            }

            var originalName = resolveFullName(line.substring(2, eqIdx), folders, '');
            var dupNames = expandNames(line.substring(eqIdx + 1), folders);
            var orig = frames[originalName];

            if (orig)
            {
                for (var d = 0; d < dupNames.length; d++)
                {
                    var dupName = dupNames[d];
                    var dup = {};

                    for (var k in orig)
                    {
                        dup[k] = orig[k];
                    }

                    dup.key = dupName;

                    frames[dupName] = dup;
                }
            }
        }
        else
        {
            //  Individual frame line
            var fparts = line.split('|');

            if (fparts.length < 3)
            {
                //  Unknown or future line type — skip safely
                continue;
            }

            var fname = resolveFullName(fparts[0], folders, '');
            var flags = parseInt(fparts[1], 10);
            var isTrimmed = (flags & 2) !== 0;
            var fv = fparts[2].split(',');
            var iframe = {
                key: fname,
                page: currentPage,
                x: parseInt(fv[0], 10),
                y: parseInt(fv[1], 10),
                w: parseInt(fv[2], 10),
                h: parseInt(fv[3], 10),
                trimmed: isTrimmed,
                rotated: (flags & 1) !== 0
            };

            if (isTrimmed)
            {
                //  Trim data is packed into a single segment as "sw,sh,sx,sy",
                //  mirroring the layout used by the B: block header trim fields.
                var tv = fparts[3].split(',');

                iframe.sourceW = parseInt(tv[0], 10);
                iframe.sourceH = parseInt(tv[1], 10);
                iframe.trimX = parseInt(tv[2], 10);
                iframe.trimY = parseInt(tv[3], 10);
            }
            else
            {
                iframe.sourceW = iframe.w;
                iframe.sourceH = iframe.h;
                iframe.trimX = 0;
                iframe.trimY = 0;
            }

            frames[fname] = iframe;
        }
    }

    return {
        pages: pages,
        folders: folders,
        frames: frames
    };
};

module.exports = PCTDecode;
