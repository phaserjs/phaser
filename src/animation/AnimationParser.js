/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Responsible for parsing sprite sheet and JSON data into the internal FrameData format that Phaser uses for animations.
*
* @class Phaser.AnimationParser
*/
Phaser.AnimationParser = {

    /**
    * Parse a Sprite Sheet and extract the animation frame data from it.
    *
    * @method Phaser.AnimationParser.spriteSheet
    * @param {Phaser.Game} game - A reference to the currently running game.
    * @param {string} key - The Game.Cache asset key of the Sprite Sheet image.
    * @param {number} frameWidth - The fixed width of each frame of the animation.
    * @param {number} frameHeight - The fixed height of each frame of the animation.
    * @param {number} [frameMax=-1] - The total number of animation frames to extact from the Sprite Sheet. The default value of -1 means "extract all frames".
    * @return {Phaser.FrameData} A FrameData object containing the parsed frames.
    */
    spriteSheet: function (game, key, frameWidth, frameHeight, frameMax) {

        //  How big is our image?
        var img = game.cache.getImage(key);

        if (img == null)
        {
            return null;
        }

        var width = img.width;
        var height = img.height;

        if (frameWidth <= 0)
        {
            frameWidth = Math.floor(-width / Math.min(-1, frameWidth));
        }

        if (frameHeight <= 0)
        {
            frameHeight = Math.floor(-height / Math.min(-1, frameHeight));
        }

        var row = Math.round(width / frameWidth);
        var column = Math.round(height / frameHeight);
        var total = row * column;
        
        if (frameMax !== -1)
        {
            total = frameMax;
        }

        //  Zero or smaller than frame sizes?
        if (width == 0 || height == 0 || width < frameWidth || height < frameHeight || total === 0)
        {
            console.warn("Phaser.AnimationParser.spriteSheet: width/height zero or width/height < given frameWidth/frameHeight");
            return null;
        }

        //  Let's create some frames then
        var data = new Phaser.FrameData();
        var x = 0;
        var y = 0;

        for (var i = 0; i < total; i++)
        {
            var uuid = game.rnd.uuid();

            data.addFrame(new Phaser.Frame(i, x, y, frameWidth, frameHeight, '', uuid));

            PIXI.TextureCache[uuid] = new PIXI.Texture(PIXI.BaseTextureCache[key], {
                x: x,
                y: y,
                width: frameWidth,
                height: frameHeight
            });

            x += frameWidth;

            if (x === width)
            {
                x = 0;
                y += frameHeight;
            }
        }

        return data;

    },

    /**
    * Parse the JSON data and extract the animation frame data from it.
    *
    * @method Phaser.AnimationParser.JSONData
    * @param {Phaser.Game} game - A reference to the currently running game.
    * @param {Object} json - The JSON data from the Texture Atlas. Must be in Array format.
    * @param {string} cacheKey - The Game.Cache asset key of the texture image.
    * @return {Phaser.FrameData} A FrameData object containing the parsed frames.
    */
    JSONData: function (game, json, cacheKey) {

        //  Malformed?
        if (!json['frames'])
        {
            console.warn("Phaser.AnimationParser.JSONData: Invalid Texture Atlas JSON given, missing 'frames' array");
            console.log(json);
            return;
        }

        //  Let's create some frames then
        var data = new Phaser.FrameData();
        
        //  By this stage frames is a fully parsed array
        var frames = json['frames'];
        var newFrame;
        
        for (var i = 0; i < frames.length; i++)
        {
            var uuid = game.rnd.uuid();

            newFrame = data.addFrame(new Phaser.Frame(
                i,
            	frames[i].frame.x, 
            	frames[i].frame.y, 
            	frames[i].frame.w, 
            	frames[i].frame.h, 
            	frames[i].filename,
                uuid
			));

            PIXI.TextureCache[uuid] = new PIXI.Texture(PIXI.BaseTextureCache[cacheKey], {
                x: frames[i].frame.x,
                y: frames[i].frame.y,
                width: frames[i].frame.w,
                height: frames[i].frame.h
            });

            if (frames[i].trimmed)
            {
                newFrame.setTrim(
                    frames[i].trimmed, 
                    frames[i].sourceSize.w, 
                    frames[i].sourceSize.h, 
                    frames[i].spriteSourceSize.x, 
                    frames[i].spriteSourceSize.y, 
                    frames[i].spriteSourceSize.w, 
                    frames[i].spriteSourceSize.h
                );

                //  We had to hack Pixi to get this to work :(
                PIXI.TextureCache[uuid].trimmed = true;
                PIXI.TextureCache[uuid].trim.x = frames[i].spriteSourceSize.x;
                PIXI.TextureCache[uuid].trim.y = frames[i].spriteSourceSize.y;

            }
        }

        return data;

    },

    /**
    * Parse the JSON data and extract the animation frame data from it.
    *
    * @method Phaser.AnimationParser.JSONDataHash
    * @param {Phaser.Game} game - A reference to the currently running game.
    * @param {Object} json - The JSON data from the Texture Atlas. Must be in JSON Hash format.
    * @param {string} cacheKey - The Game.Cache asset key of the texture image.
    * @return {Phaser.FrameData} A FrameData object containing the parsed frames.
    */
    JSONDataHash: function (game, json, cacheKey) {

        //  Malformed?
        if (!json['frames'])
        {
            console.warn("Phaser.AnimationParser.JSONDataHash: Invalid Texture Atlas JSON given, missing 'frames' object");
            console.log(json);
            return;
        }
            
        //  Let's create some frames then
        var data = new Phaser.FrameData();

        //  By this stage frames is a fully parsed array
        var frames = json['frames'];
        var newFrame;
        var i = 0;
        
        for (var key in frames)
        {
            var uuid = game.rnd.uuid();

            newFrame = data.addFrame(new Phaser.Frame(
                i,
                frames[key].frame.x, 
                frames[key].frame.y, 
                frames[key].frame.w, 
                frames[key].frame.h, 
                key,
                uuid
            ));

            PIXI.TextureCache[uuid] = new PIXI.Texture(PIXI.BaseTextureCache[cacheKey], {
                x: frames[key].frame.x,
                y: frames[key].frame.y,
                width: frames[key].frame.w,
                height: frames[key].frame.h
            });

            if (frames[key].trimmed)
            {
                newFrame.setTrim(
                    frames[key].trimmed, 
                    frames[key].sourceSize.w, 
                    frames[key].sourceSize.h, 
                    frames[key].spriteSourceSize.x, 
                    frames[key].spriteSourceSize.y, 
                    frames[key].spriteSourceSize.w, 
                    frames[key].spriteSourceSize.h
                );

                //  We had to hack Pixi to get this to work :(
                PIXI.TextureCache[uuid].trimmed = true;
                PIXI.TextureCache[uuid].trim.x = frames[key].spriteSourceSize.x;
                PIXI.TextureCache[uuid].trim.y = frames[key].spriteSourceSize.y;

            }

            i++;
        }

        return data;

    },

    /**
    * Parse the XML data and extract the animation frame data from it.
    *
    * @method Phaser.AnimationParser.XMLData
    * @param {Phaser.Game} game - A reference to the currently running game.
    * @param {Object} xml - The XML data from the Texture Atlas. Must be in Starling XML format.
    * @param {string} cacheKey - The Game.Cache asset key of the texture image.
    * @return {Phaser.FrameData} A FrameData object containing the parsed frames.
    */
    XMLData: function (game, xml, cacheKey) {

        //  Malformed?
        if (!xml.getElementsByTagName('TextureAtlas'))
        {
            console.warn("Phaser.AnimationParser.XMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");
            return;
        }

        //  Let's create some frames then
        var data = new Phaser.FrameData();
        var frames = xml.getElementsByTagName('SubTexture');
        var newFrame;
        
        for (var i = 0; i < frames.length; i++)
        {
            var uuid = game.rnd.uuid();

            var frame = frames[i].attributes;

            newFrame = data.addFrame(new Phaser.Frame(
                i,
            	frame.x.nodeValue, 
            	frame.y.nodeValue, 
            	frame.width.nodeValue, 
            	frame.height.nodeValue, 
            	frame.name.nodeValue,
                uuid
            ));

            PIXI.TextureCache[uuid] = new PIXI.Texture(PIXI.BaseTextureCache[cacheKey], {
                x: frame.x.nodeValue,
                y: frame.y.nodeValue,
                width: frame.width.nodeValue,
                height: frame.height.nodeValue
            });

            //  Trimmed?
            if (frame.frameX.nodeValue != '-0' || frame.frameY.nodeValue != '-0')
            {
                newFrame.setTrim(
                	true, 
                	frame.width.nodeValue, 
                	frame.height.nodeValue, 
                	Math.abs(frame.frameX.nodeValue), 
                	Math.abs(frame.frameY.nodeValue), 
                	frame.frameWidth.nodeValue, 
                	frame.frameHeight.nodeValue
                );

                PIXI.TextureCache[uuid].realSize = {
                    x: Math.abs(frame.frameX.nodeValue),
                    y: Math.abs(frame.frameY.nodeValue),
                    w: frame.frameWidth.nodeValue,
                    h: frame.frameHeight.nodeValue
                };

                //  We had to hack Pixi to get this to work :(
                PIXI.TextureCache[uuid].trimmed = true;
                PIXI.TextureCache[uuid].trim.x = Math.abs(frame.frameX.nodeValue);
                PIXI.TextureCache[uuid].trim.y = Math.abs(frame.frameY.nodeValue);

            }
        }

        return data;

    }

};
