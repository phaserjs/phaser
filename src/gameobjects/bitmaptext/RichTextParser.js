/**
 * Parses `[style]...[/style]` markup into rich-text segments.
 * `[[` and `]]` are escapes for literal brackets.
 *
 * @function Phaser.GameObjects.BitmapText.ParseRichText
 * @since 4.3.0
 *
 * @param {string} text - The markup string to parse.
 *
 * @return {Phaser.Types.GameObjects.BitmapText.Segment[]} The parsed segments.
 */
var ParseRichText = function (text)
{
    var segments = [];
    var currentStyle;
    var currentText = '';
    var currentTag = '';
    var tagStartIndex = 0;
    var isParsingTag = false;

    var flush = function ()
    {
        if (currentText === '') { return; }

        var last = segments[segments.length - 1];

        if (last !== undefined && last.style === currentStyle)
        {
            last.text += currentText;
        }
        else
        {
            var segment = { text: currentText };

            if (currentStyle !== undefined) { segment.style = currentStyle; }

            segments.push(segment);
        }

        currentText = '';
    };

    for (var i = 0; i < text.length; i++)
    {
        var ch = text[i];

        if (isParsingTag)
        {
            if (ch !== ']')
            {
                currentTag += ch;

                continue;
            }

            isParsingTag = false;

            if (currentTag[0] === '/')
            {
                var closing = currentTag.substring(1);

                if (closing !== currentStyle)
                {
                    console.warn('BitmapText rich text: unexpected closing tag [/' + closing + '] in "' + text + '"');
                }

                currentStyle = undefined;
            }
            else
            {
                currentStyle = currentTag;
            }

            continue;
        }

        if (ch === '[' && text[i + 1] !== '[')
        {
            flush();

            isParsingTag = true;
            currentTag = '';
            tagStartIndex = i;

            continue;
        }

        if (ch === ']' && text[i + 1] !== ']')
        {
            console.warn('BitmapText rich text: unmatched "]" at index ' + i + ' in "' + text + '"');

            continue;
        }

        //  Escaped bracket: skip the twin, keep one literal
        if (ch === '[' || ch === ']') { i++; }

        currentText += ch;
    }

    if (isParsingTag)
    {
        console.warn('BitmapText rich text: unclosed bracket at index ' + tagStartIndex + ' in "' + text + '"');
    }

    flush();

    return segments;
};

module.exports = ParseRichText;
