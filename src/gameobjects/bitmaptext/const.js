/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RETRO_FONT_CONST = {

    /**
     * A RetroFont character set containing the full printable ASCII range (space through tilde),
     * including both uppercase and lowercase letters, digits, and symbols.
     *
     * Text Set 1 =  !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~
     *
     * @name Phaser.GameObjects.RetroFont.TEXT_SET1
     * @type {string}
     * @since 3.6.0
     */
    TEXT_SET1: ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~',

    /**
     * A RetroFont character set containing printable ASCII characters from space through uppercase Z,
     * including digits and common symbols but no lowercase letters.
     *
     * Text Set 2 =  !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ
     *
     * @name Phaser.GameObjects.RetroFont.TEXT_SET2
     * @type {string}
     * @since 3.6.0
     */
    TEXT_SET2: ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ',

    /**
     * A RetroFont character set containing uppercase letters followed by digits, with a trailing space.
     *
     * Text Set 3 = ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
     *
     * @name Phaser.GameObjects.RetroFont.TEXT_SET3
     * @type {string}
     * @since 3.6.0
     */
    TEXT_SET3: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ',

    /**
     * A RetroFont character set containing uppercase letters, a space, then digits. The space
     * character appears between the alphabet and the digits rather than at the end.
     *
     * Text Set 4 = ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
     *
     * @name Phaser.GameObjects.RetroFont.TEXT_SET4
     * @type {string}
     * @since 3.6.0
     */
    TEXT_SET4: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789',

    /**
     * A RetroFont character set containing uppercase letters followed by common punctuation
     * symbols and digits. Useful for fonts that include sentence punctuation such as periods,
     * commas, parentheses, and question marks.
     *
     * Text Set 5 = ABCDEFGHIJKLMNOPQRSTUVWXYZ.,/() '!?-*:0123456789
     *
     * @name Phaser.GameObjects.RetroFont.TEXT_SET5
     * @type {string}
     * @since 3.6.0
     */
    TEXT_SET5: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ.,/() \'!?-*:0123456789',

    /**
     * A RetroFont character set containing uppercase letters, digits, and a range of punctuation
     * symbols including quotes, parentheses, and a trailing space.
     *
     * Text Set 6 = ABCDEFGHIJKLMNOPQRSTUVWXYZ!?:;0123456789"(),-.`
     *
     * @name Phaser.GameObjects.RetroFont.TEXT_SET6
     * @type {string}
     * @since 3.6.0
     */
    TEXT_SET6: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!?:;0123456789"(),-.\' ',

    /**
     * A RetroFont character set where the characters are arranged in a non-sequential,
     * interleaved order. This matches the sprite layout of certain retro font sheets where
     * every fifth character continues the sequence (A, G, M, S, Y, then B, H, N, T, Z, etc.).
     *
     * Text Set 7 = AGMSY+:4BHNTZ!;5CIOU.?06DJPV,(17EKQW")28FLRX-'39
     *
     * @name Phaser.GameObjects.RetroFont.TEXT_SET7
     * @type {string}
     * @since 3.6.0
     */
    TEXT_SET7: 'AGMSY+:4BHNTZ!;5CIOU.?06DJPV,(17EKQW")28FLRX-\'39',

    /**
     * A RetroFont character set where digits come first, followed by a space, period, and then
     * uppercase letters. Use this when the font sprite sheet places numerals before the alphabet.
     *
     * Text Set 8 = 0123456789 .ABCDEFGHIJKLMNOPQRSTUVWXYZ
     *
     * @name Phaser.GameObjects.RetroFont.TEXT_SET8
     * @type {string}
     * @since 3.6.0
     */
    TEXT_SET8: '0123456789 .ABCDEFGHIJKLMNOPQRSTUVWXYZ',

    /**
     * A RetroFont character set containing uppercase letters, parentheses and a hyphen, digits,
     * and common sentence punctuation including quotes and an exclamation mark.
     *
     * Text Set 9 = ABCDEFGHIJKLMNOPQRSTUVWXYZ()-0123456789.:,'"?!
     *
     * @name Phaser.GameObjects.RetroFont.TEXT_SET9
     * @type {string}
     * @since 3.6.0
     */
    TEXT_SET9: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ()-0123456789.:,\'"?!',

    /**
     * A RetroFont character set containing only the 26 uppercase letters of the alphabet.
     * Use this for font sprite sheets that contain no digits, spaces, or punctuation glyphs.
     *
     * Text Set 10 = ABCDEFGHIJKLMNOPQRSTUVWXYZ
     *
     * @name Phaser.GameObjects.RetroFont.TEXT_SET10
     * @type {string}
     * @since 3.6.0
     */
    TEXT_SET10: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',

    /**
     * A RetroFont character set containing uppercase letters, a broad selection of punctuation
     * symbols including quotes and arithmetic operators, followed by digits.
     *
     * Text Set 11 = ABCDEFGHIJKLMNOPQRSTUVWXYZ.,"-+!?()':;0123456789
     *
     * @name Phaser.GameObjects.RetroFont.TEXT_SET11
     * @since 3.6.0
     * @type {string}
     */
    TEXT_SET11: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ.,"-+!?()\':;0123456789'

};

module.exports = RETRO_FONT_CONST;
