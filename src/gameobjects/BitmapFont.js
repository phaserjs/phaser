/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.BitmapFont
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {string} key - The font set graphic set as stored in the Game.Cache.
* @param {number} characterWidth - The width of each character in the font set.
* @param {number} characterHeight - The height of each character in the font set.
* @param {string} chars - The characters used in the font set, in display order. You can use the TEXT_SET consts for common font set arrangements.
* @param {number} charsPerRow - The number of characters per row in the font set.
* @param {number} [xSpacing=0] - If the characters in the font set have horizontal spacing between them set the required amount here.
* @param {number} [ySpacing=0] - If the characters in the font set have vertical spacing between them set the required amount here.
* @param {number} [xOffset=0] - If the font set doesn't start at the top left of the given image, specify the X coordinate offset here.
* @param {number} [yOffset=0] - If the font set doesn't start at the top left of the given image, specify the Y coordinate offset here.
*/
Phaser.BitmapFont = function (game, x, y, key, characterWidth, characterHeight, chars, charsPerRow, xSpacing, ySpacing, xOffset, yOffset) {

    /**
    * @property {number} characterWidth - The width of each character in the font set.
    */
    this.characterWidth = characterWidth;

    /**
    * @property {number} characterHeight - The height of each character in the font set.
    */
    this.characterHeight = characterHeight;

    /**
    * @property {number} characterSpacingX - If the characters in the font set have horizontal spacing between them set the required amount here.
    */
    this.characterSpacingX = xSpacing || 0;

    /**
    * @property {number} characterSpacingY - If the characters in the font set have vertical spacing between them set the required amount here.
    */
    this.characterSpacingY = ySpacing || 0;

    /**
    * @property {number} characterPerRow - The number of characters per row in the font set.
    */
    this.characterPerRow = charsPerRow;

    /**
    * @property {number} offsetX - If the font set doesn't start at the top left of the given image, specify the X coordinate offset here.
    */
    this.offsetX = xOffset || 0;

    /**
    * @property {number} offsetY - If the font set doesn't start at the top left of the given image, specify the Y coordinate offset here.
    */
    this.offsetY = yOffset || 0;

    /**
    * @property {string} align - Alignment of the text when multiLine = true or a fixedWidth is set. Set to BitmapFont.ALIGN_LEFT (default), BitmapFont.ALIGN_RIGHT or BitmapFont.ALIGN_CENTER.
    */
    this.align = "left";

    /**
    * @property {boolean} multiLine - If set to true all carriage-returns in text will form new lines (see align). If false the font will only contain one single line of text (the default)
    * @default
    */
    this.multiLine = false;

    /**
    * @property {boolean} autoUpperCase - Automatically convert any text to upper case. Lots of old bitmap fonts only contain upper-case characters, so the default is true.
    * @default
    */
    this.autoUpperCase = true;

    /**
    * @property {number} customSpacingX - Adds horizontal spacing between each character of the font, in pixels.
    * @default
    */
    this.customSpacingX = 0;

    /**
    * @property {number} customSpacingY - Adds vertical spacing between each line of multi-line text, set in pixels.
    * @default
    */
    this.customSpacingY = 0;

    /**
    * If you need this BitmapFont image to have a fixed width you can set the width in this value.
    * If text is wider than the width specified it will be cropped off.
    * @property {number} fixedWidth
    */
    this.fixedWidth = 0;

    /**
    * @property {HTMLImage} fontSet - A reference to the image stored in the Game.Cache that contains the font.
    */
    this.fontSet = game.cache.getImage(key);

    /**
    * @property {string} _text - The text of the font image.
    * @private
    */
    this._text = '';

    /**
    * @property {array} grabData - An array of rects for faster character pasting.
    * @private
    */
    this.grabData = [];
    
    //  Now generate our rects for faster copying later on
    var currentX = this.offsetX;
    var currentY = this.offsetY;
    var r = 0;
    
    for (var c = 0; c < chars.length; c++)
    {
        //  The rect is hooked to the ASCII value of the character
        this.grabData[chars.charCodeAt(c)] = new Phaser.Rectangle(currentX, currentY, this.characterWidth, this.characterHeight);
        
        r++;
        
        if (r == this.characterPerRow)
        {
            r = 0;
            currentX = this.offsetX;
            currentY += this.characterHeight + this.characterSpacingY;
        }
        else
        {
            currentX += this.characterWidth + this.characterSpacingX;
        }
    }

    /**
    * @property {Phaser.BitmapData} bmd - The internal BitmapData to which the font is rendered.
    */
    this.bmd = new Phaser.BitmapData(game, this.characterWidth, this.characterHeight);

    Phaser.Image.call(this, game, x, y, this.bmd);

    /**
    * @property {number} type - Base Phaser object type. 
    */
    this.type = Phaser.BITMAPFONT;
    
};

Phaser.BitmapFont.prototype = Object.create(Phaser.Image.prototype);
Phaser.BitmapFont.prototype.constructor = Phaser.BitmapFont;

/**
* Align each line of multi-line text to the left.
* @constant
* @type {string}
*/
Phaser.BitmapFont.ALIGN_LEFT = "left";
        
/**
* Align each line of multi-line text to the right.
* @constant
* @type {string}
*/
Phaser.BitmapFont.ALIGN_RIGHT = "right";
        
/**
* Align each line of multi-line text in the center.
* @constant
* @type {string}
*/
Phaser.BitmapFont.ALIGN_CENTER = "center";
        
/**
* Text Set 1 = !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
* @constant
* @type {string}
*/
Phaser.BitmapFont.TEXT_SET1 = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
        
/**
* Text Set 2 =  !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ
* @constant
* @type {string}
*/
Phaser.BitmapFont.TEXT_SET2 = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
/**
* Text Set 3 = ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 
* @constant
* @type {string}
*/
Phaser.BitmapFont.TEXT_SET3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
        
/**
* Text Set 4 = ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
* @constant
* @type {string}
*/
Phaser.BitmapFont.TEXT_SET4 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789";
        
/**
* Text Set 5 = ABCDEFGHIJKLMNOPQRSTUVWXYZ.,/() '!?-*:0123456789
* @constant
* @type {string}
*/
Phaser.BitmapFont.TEXT_SET5 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.,/() '!?-*:0123456789";
        
/**
* Text Set 6 = ABCDEFGHIJKLMNOPQRSTUVWXYZ!?:;0123456789\"(),-.' 
* @constant
* @type {string}
*/
Phaser.BitmapFont.TEXT_SET6 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!?:;0123456789\"(),-.' ";
        
/**
* Text Set 7 = AGMSY+:4BHNTZ!;5CIOU.?06DJPV,(17EKQW\")28FLRX-'39
* @constant
* @type {string}
*/
Phaser.BitmapFont.TEXT_SET7 = "AGMSY+:4BHNTZ!;5CIOU.?06DJPV,(17EKQW\")28FLRX-'39";
        
/**
* Text Set 8 = 0123456789 .ABCDEFGHIJKLMNOPQRSTUVWXYZ
* @constant
* @type {string}
*/
Phaser.BitmapFont.TEXT_SET8 = "0123456789 .ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
/**
* Text Set 9 = ABCDEFGHIJKLMNOPQRSTUVWXYZ()-0123456789.:,'\"?!
* @constant
* @type {string}
*/
Phaser.BitmapFont.TEXT_SET9 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ()-0123456789.:,'\"?!";
        
/**
* Text Set 10 = ABCDEFGHIJKLMNOPQRSTUVWXYZ
* @constant
* @type {string}
*/
Phaser.BitmapFont.TEXT_SET10 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
/**
* Text Set 11 = ABCDEFGHIJKLMNOPQRSTUVWXYZ.,\"-+!?()':;0123456789
* @constant
* @type {string}
*/
Phaser.BitmapFont.TEXT_SET11 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.,\"-+!?()':;0123456789";

/**
* If you need this FlxSprite to have a fixed width and custom alignment you can set the width here.<br>
* If text is wider than the width specified it will be cropped off.
*
* @method Phaser.BitmapFont#setFixedWidth
* @memberof Phaser.BitmapFont
* @param {number} width - Width in pixels of this BitmapFont. Set to zero to disable and re-enable automatic resizing.
* @param {string} [lineAlignment='left'] - Align the text within this width. Set to BitmapFont.ALIGN_LEFT (default), BitmapFont.ALIGN_RIGHT or BitmapFont.ALIGN_CENTER.
*/
Phaser.BitmapFont.prototype.setFixedWidth = function (width, lineAlignment) { 

    if (typeof lineAlignment === 'undefined') { lineAlignment = 'left'; }

    this.fixedWidth = width;
    this.align = lineAlignment;

}

/**
* A helper function that quickly sets lots of variables at once, and then updates the text.
* 
* @method Phaser.BitmapFont#setText
* @memberof Phaser.BitmapFont
* @param {string} content - The text of this sprite.
* @param {boolean} [multiLine=false] - Set to true if you want to support carriage-returns in the text and create a multi-line sprite instead of a single line.
* @param {number} [characterSpacing=0] - To add horizontal spacing between each character specify the amount in pixels.
* @param {number} [lineSpacing=0] - To add vertical spacing between each line of text, set the amount in pixels.
* @param {string} [lineAlignment='left'] - Align each line of multi-line text. Set to BitmapFont.ALIGN_LEFT, BitmapFont.ALIGN_RIGHT or BitmapFont.ALIGN_CENTER.
* @param {boolean} [allowLowerCase=false] - Lots of bitmap font sets only include upper-case characters, if yours needs to support lower case then set this to true.
*/
Phaser.BitmapFont.prototype.setText = function (content, multiLine, characterSpacing, lineSpacing, lineAlignment, allowLowerCase) {

    this.multiLine = multiLine || false;
    this.customSpacingX = characterSpacing || 0;
    this.customSpacingY = lineSpacing || 0;
    this.align = lineAlignment || 'left';
    
    if (allowLowerCase)
    {
        this.autoUpperCase = false;
    }
    else
    {
        this.autoUpperCase = true;
    }
    
    if (content.length > 0)
    {
        this.text = content;
    }

}

/**
* Updates the BitmapData of the Sprite with the text
* 
* @method Phaser.BitmapFont#buildBitmapFontText
* @memberof Phaser.BitmapFont
*/
Phaser.BitmapFont.prototype.buildBitmapFontText = function () { 

    var cx = 0;
    var cy = 0;
    
    if (this.multiLine)
    {
        var lines = this._text.split("\n");
    
        if (this.fixedWidth > 0)
        {
            this.bmd.resize(fixedWidth, (lines.length * (this.characterHeight + this.customSpacingY)) - this.customSpacingY);
        }
        else
        {
            this.bmd.resize(this.getLongestLine() * (this.characterWidth + this.customSpacingX), (lines.length * (this.characterHeight + this.customSpacingY)) - this.customSpacingY);
        }
        
        //  Loop through each line of text
        for (var i = 0; i < lines.length; i++)
        {
            //  This line of text is held in lines[i] - need to work out the alignment
            switch (this.align)
            {
                case Phaser.BitmapFont.ALIGN_LEFT:
                    cx = 0;
                    break;
                    
                case Phaser.BitmapFont.ALIGN_RIGHT:
                    cx = this.bmd.width - (lines[i].length * (this.characterWidth + this.customSpacingX));
                    break;
                    
                case Phaser.BitmapFont.ALIGN_CENTER:
                    cx = (this.bmd.width / 2) - ((lines[i].length * (this.characterWidth + this.customSpacingX)) / 2);
                    cx += this.customSpacingX / 2;
                    break;
            }
            
            //  Sanity checks
            if (cx < 0)
            {
                cx = 0;
            }
            
            this.pasteLine(lines[i], cx, cy, this.customSpacingX);
            
            cy += this.characterHeight + this.customSpacingY;
        }
    }
    else
    {
        if (this.fixedWidth > 0)
        {
            this.bmd.resize(fixedWidth, this.characterHeight);
        }
        else
        {
            this.bmd.resize(this._text.length * (this.characterWidth + this.customSpacingX), this.characterHeight);
        }
        
        switch (this.align)
        {
            case Phaser.BitmapFont.ALIGN_LEFT:
                cx = 0;
                break;
                
            case Phaser.BitmapFont.ALIGN_RIGHT:
                cx = this.bmd.width - (this._text.length * (this.characterWidth + this.customSpacingX));
                break;
                
            case Phaser.BitmapFont.ALIGN_CENTER:
                cx = (this.bmd.width / 2) - ((this._text.length * (this.characterWidth + this.customSpacingX)) / 2);
                cx += this.customSpacingX / 2;
                break;
        }
    
        this.pasteLine(this._text, cx, 0, this.customSpacingX);
    }

    this.bmd.render();

    this.width = this.bmd.width;
    this.height = this.bmd.height;

}

/**
* Internal function that takes a single line of text (2nd parameter) and pastes it into the BitmapData at the given coordinates.
* Used by getLine and getMultiLine
* 
* @method Phaser.BitmapFont#buildBitmapFontText
* @memberof Phaser.BitmapFont
* @param {string} line - The single line of text to paste.
* @param {number} x - The x coordinate.
* @param {number} y - The y coordinate.
* @param {number} customSpacingX - Custom X spacing.
*/
Phaser.BitmapFont.prototype.pasteLine = function (line, x, y, customSpacingX) { 

    for (var c = 0; c < line.length; c++)
    {
        //  If it's a space then there is no point copying, so leave a blank space
        if (line.charAt(c) == " ")
        {
            x += this.characterWidth + this.customSpacingX;
        }
        else
        {
            //  If the character doesn't exist in the font then we don't want a blank space, we just want to skip it
            if (this.grabData[line.charCodeAt(c)])
            {
                this.bmd.copyPixels(this.fontSet, this.grabData[line.charCodeAt(c)], x, y);
                
                x += this.characterWidth + this.customSpacingX;
                
                if (x > this.bmd.width)
                {
                    break;
                }
            }
        }
    }
}
        
/**
* Works out the longest line of text in _text and returns its length
* 
* @method Phaser.BitmapFont#getLongestLine
* @memberof Phaser.BitmapFont
* @return {number} The length of the longest line of text.
*/
Phaser.BitmapFont.prototype.getLongestLine = function () { 

    var longestLine = 0;
    
    if (this._text.length > 0)
    {
        var lines = this._text.split("\n");
        
        for (var i = 0; i < lines.length; i++)
        {
            if (lines[i].length > longestLine)
            {
                longestLine = lines[i].length;
            }
        }
    }
    
    return longestLine;
}
        
/**
* Internal helper function that removes all unsupported characters from the _text String, leaving only characters contained in the font set.
* 
* @method Phaser.BitmapFont#removeUnsupportedCharacters
* @memberof Phaser.BitmapFont
* @protected
* @param {boolean} [stripCR=true] - Should it strip carriage returns as well?
* @return {string}  A clean version of the string.
*/
Phaser.BitmapFont.prototype.removeUnsupportedCharacters = function (stripCR) { 

    var newString = "";
    
    for (var c = 0; c < this._text.length; c++)
    {
        if (this.grabData[this._text.charCodeAt(c)] || this._text.charCodeAt(c) == 32 || (!stripCR && this._text.charAt(c) === "\n"))
        {
            newString = newString.concat(this._text.charAt(c));
        }
    }
    
    return newString;
}

/**
* @name Phaser.BitmapText#text
* @property {string} text - Set this value to update the text in this sprite. Carriage returns are automatically stripped out if multiLine is false. Text is converted to upper case if autoUpperCase is true.
*/
Object.defineProperty(Phaser.BitmapFont.prototype, "text", {
    
    get: function () {

        return this._text;

    },

    set: function (value) {

        var newText;
        
        if (this.autoUpperCase)
        {
            newText = value.toUpperCase();
        }
        else
        {
            newText = value;
        }
        
        if (newText !== this._text)
        {
            this._text = newText;
            
            this.removeUnsupportedCharacters(this.multiLine);
            
            this.buildBitmapFontText();
        }

    }

});
