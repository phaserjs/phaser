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

        if (img == null) {
            return null;
        }

        var width = img.width;
        var height = img.height;
        var row = Math.round(width / frameWidth);
        var column = Math.round(height / frameHeight);
        var total = row * column;
        
        if (frameMax !== -1) {
            total = frameMax;
        }

        //  Zero or smaller than frame sizes?
        if (width == 0 || height == 0 || width < frameWidth || height < frameHeight || total === 0) {
            throw new Error("AnimationLoader.parseSpriteSheet: width/height zero or width/height < given frameWidth/frameHeight");
            return null;
        }

        //  Let's create some frames then
        var data = new Phaser.Animation.FrameData();
        var x = 0;
        var y = 0;

        for (var i = 0; i < total; i++) {

            data.addFrame(new Phaser.Animation.Frame(x, y, frameWidth, frameHeight, ''));

            x += frameWidth;

            if (x === width) {
                x = 0;
                y += frameHeight;
            }
        }

        return data;

    },

    /**
    * Parse frame data from json.
    * @param json {object} Json data you want to parse.
    * @return {FrameData} Generated FrameData object.
    */
    JSONData: function (game, json) {

        //  Malformed?
        if (!json['frames']) {
            console.log(json);
            throw new Error("Phaser.AnimationLoader.parseJSONData: Invalid Texture Atlas JSON given, missing 'frames' array");
        }

        //  Let's create some frames then
        var data = new Phaser.Animation.FrameData();
        
        //  By this stage frames is a fully parsed array
        var frames = json['frames'];
        var newFrame;
        
        for (var i = 0; i < frames.length; i++) {

            newFrame = data.addFrame(new Phaser.Animation.Frame(
            	frames[i].frame.x, 
            	frames[i].frame.y, 
            	frames[i].frame.w, 
            	frames[i].frame.h, 
            	frames[i].filename
			));

            newFrame.setTrim(
            	frames[i].trimmed, 
            	frames[i].sourceSize.w, 
            	frames[i].sourceSize.h, 
            	frames[i].spriteSourceSize.x, 
            	frames[i].spriteSourceSize.y, 
            	frames[i].spriteSourceSize.w, 
            	frames[i].spriteSourceSize.h
			);
        }

        return data;

    },

    /**
    * Parse frame data from an XML file.
    * @param xml {object} XML data you want to parse.
    * @return {FrameData} Generated FrameData object.
    */
    XMLData: function (game, xml, format) {

        //  Malformed?
        if (!xml.getElementsByTagName('TextureAtlas')) {
            throw new Error("Phaser.AnimationLoader.parseXMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");
        }

        //  Let's create some frames then
        var data = new Phaser.Animation.FrameData();
        var frames = xml.getElementsByTagName('SubTexture');
        var newFrame;
        
        for (var i = 0; i < frames.length; i++) {

            var frame = frames[i].attributes;

            newFrame = data.addFrame(new Phaser.Animation.Frame(
            	frame.x.nodeValue, 
            	frame.y.nodeValue, 
            	frame.width.nodeValue, 
            	frame.height.nodeValue, 
            	frame.name.nodeValue
            ));

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
            }
        }

        return data;

    }

};
