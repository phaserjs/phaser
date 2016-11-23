/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Parses the XML and extracts the frame data from it.
*
* @class Phaser.TextureParser.StarlingXML
* @static
* @param {Phaser.Texture} texture - The parent Texture.
* @param {object} xml - The XML data from the Texture Atlas. Must be in Starling XML format.
* @return {Phaser.FrameData} A FrameData object containing the parsed frames.
*/
Phaser.TextureParser.StarlingXML = function (texture, xml)
{
    //  Malformed?
    if (!xml.getElementsByTagName('TextureAtlas'))
    {
        // console.warn("Phaser.AnimationParser.XMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");
        return;
    }

    //  Let's create some frames then
    var data = new Phaser.FrameData();
    var frames = xml.getElementsByTagName('SubTexture');
    var newFrame;

    var name;
    var frame;
    var x;
    var y;
    var width;
    var height;
    var frameX;
    var frameY;
    var frameWidth;
    var frameHeight;

    for (var i = 0; i < frames.length; i++)
    {
        frame = frames[i].attributes;

        name = frame.name.value;
        x = parseInt(frame.x.value, 10);
        y = parseInt(frame.y.value, 10);
        width = parseInt(frame.width.value, 10);
        height = parseInt(frame.height.value, 10);

        frameX = null;
        frameY = null;

        if (frame.frameX)
        {
            frameX = Math.abs(parseInt(frame.frameX.value, 10));
            frameY = Math.abs(parseInt(frame.frameY.value, 10));
            frameWidth = parseInt(frame.frameWidth.value, 10);
            frameHeight = parseInt(frame.frameHeight.value, 10);
        }

        newFrame = data.addFrame(new Phaser.Frame(i, x, y, width, height, name));

        //  Trimmed?
        if (frameX !== null || frameY !== null)
        {
            newFrame.setTrim(true, width, height, frameX, frameY, frameWidth, frameHeight);
        }
    }

    return data;

};
