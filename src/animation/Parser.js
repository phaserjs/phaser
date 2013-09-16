/**
* Animation Parser
*
* Responsible for parsing sprite sheet and JSON data into the internal FrameData format that Phaser uses for animations.
*
* @package    Phaser.Animation.Parser
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
Phaser.Animation.Parser = {

	/**
	* Parse a sprite sheet from asset data.
	* @param key {string} Asset key for the sprite sheet data.
	* @param frameWidth {number} Width of animation frame.
	* @param frameHeight {number} Height of animation frame.
	* @param frameMax {number} Number of animation frames.
	* @return {FrameData} Generated FrameData object.
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
            console.warn("Phaser.Animation.Parser.spriteSheet: width/height zero or width/height < given frameWidth/frameHeight");
            return null;
        }

        //  Let's create some frames then
        var data = new Phaser.Animation.FrameData();
        var x = 0;
        var y = 0;

        for (var i = 0; i < total; i++)
        {
            var uuid = game.rnd.uuid();

            data.addFrame(new Phaser.Animation.Frame(x, y, frameWidth, frameHeight, '', uuid));

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
    * Parse frame data from json texture atlas in Array format.
    * @param json {object} Json data you want to parse.
    * @return {FrameData} Generated FrameData object.
    */
    JSONData: function (game, json, cacheKey) {

        //  Malformed?
        if (!json['frames'])
        {
            console.warn("Phaser.Animation.Parser.JSONData: Invalid Texture Atlas JSON given, missing 'frames' array");
            console.log(json);
            return;
        }

        //  Let's create some frames then
        var data = new Phaser.Animation.FrameData();
        
        //  By this stage frames is a fully parsed array
        var frames = json['frames'];
        var newFrame;
        
        for (var i = 0; i < frames.length; i++)
        {
            var uuid = game.rnd.uuid();

            newFrame = data.addFrame(new Phaser.Animation.Frame(
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

                PIXI.TextureCache[uuid].realSize = frames[i].spriteSourceSize;
                PIXI.TextureCache[uuid].trim.x = 0;
            }
        }

        return data;

    },

    /**
    * Parse frame data from json texture atlas in Hash format.
    * @param json {object} Json data you want to parse.
    * @return {FrameData} Generated FrameData object.
    */
    JSONDataHash: function (game, json, cacheKey) {

        //  Malformed?
        if (!json['frames'])
        {
            console.warn("Phaser.Animation.Parser.JSONDataHash: Invalid Texture Atlas JSON given, missing 'frames' object");
            console.log(json);
            return;
        }
            
        //  Let's create some frames then
        var data = new Phaser.Animation.FrameData();

        //  By this stage frames is a fully parsed array
        var frames = json['frames'];
        var newFrame;
        
        for (var key in frames)
        {
            console.log(key);
            var uuid = game.rnd.uuid();

            newFrame = data.addFrame(new Phaser.Animation.Frame(
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

                PIXI.TextureCache[uuid].realSize = frames[key].spriteSourceSize;
                PIXI.TextureCache[uuid].trim.x = 0;
            }
        }

        return data;

    },

    /**
    * Parse frame data from an XML file.
    * @param xml {object} XML data you want to parse.
    * @return {FrameData} Generated FrameData object.
    */
    XMLData: function (game, xml, cacheKey) {

        //  Malformed?
        if (!xml.getElementsByTagName('TextureAtlas'))
        {
            console.warn("Phaser.Animation.Parser.XMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");
            return;
        }

        //  Let's create some frames then
        var data = new Phaser.Animation.FrameData();
        var frames = xml.getElementsByTagName('SubTexture');
        var newFrame;
        
        for (var i = 0; i < frames.length; i++)
        {
            var uuid = game.rnd.uuid();

            var frame = frames[i].attributes;

            newFrame = data.addFrame(new Phaser.Animation.Frame(
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
            if (frame.frameX.nodeValue != '-0' || frame.frameY.nodeValue != '-0') {
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

                PIXI.TextureCache[uuid].trim.x = 0;

            }
        }

        return data;

    }

};
