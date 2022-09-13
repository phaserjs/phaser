(function(){

    var root = this;

    class BannerTextPlugin extends Phaser.Plugins.ScenePlugin {

        constructor (scene, pluginManager)
        {
            super(scene, pluginManager);

            this.font;
            this.width;
            this.height;
            this.comments;

            this.texture;
            this.frame;
        }

        config (key)
        {
            // https://github.com/Marak/asciimo/issues/3
            this.font = this.systems.cache.text.get(key).split('\n');

            //         flf2a$ 6 5 20 15 3 0 143 229    NOTE: The first five characters in
            //           |  | | | |  |  | |  |   |     the entire file must be "flf2a".
            //          /  /  | | |  |  | |  |   \
            // Signature  /  /  | |  |  | |   \   Codetag_Count
            //   Hardblank  /  /  |  |  |  \   Full_Layout*
            //        Height  /   |  |   \  Print_Direction
            //        Baseline   /    \   Comment_Lines
            //         Max_Length      Old_Layout*

            //  flf2a$ 6 4 6 -1 4
            let data = this.font[0].split(' ');

            this.height = parseInt(data[1]);
            this.width = parseInt(data[2]);
            this.comments = parseInt(data[5]) + 2;
        }

        createText (text, x, y, texture, frame)
        {
            this.texture = texture;
            this.frame = frame;

            let testFrame = this.systems.textures.getFrame(texture, frame);

            this.spacingX = testFrame.width;
            this.spacingY = testFrame.height;

            let out = [];

            for (let i = 0; i < text.length; i++)
            {
                let letter = text.charCodeAt(i);

                let offset = this.comments + ((letter - 32) * this.height);

                out.push(this.getCharacter(x, y, offset));

                x += (this.width * this.spacingX);
            }

            return out;
        }

        getCharacter (dx, dy, offset)
        {
            let sx = dx;
            let sy = dy;
            let out = [];

            for (let y = offset; y < offset + this.height; y++)
            {
                sx = dx;

                for (let x = 0; x < this.width; x++)
                {
                    sx += this.spacingX;

                    if (this.font[y][x] === '#')
                    {
                        out.push(this.systems.add.image(sx, sy, this.texture, this.frame));
                    }
                }

                sy += this.spacingY;
            }

            return out;
        }
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = BannerTextPlugin;
        }
        exports.BannerTextPlugin = BannerTextPlugin;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('BannerTextPlugin', (function() { return root.BannerTextPlugin = BannerTextPlugin; })() );
    } else {
        root.BannerTextPlugin = BannerTextPlugin;
    }

    return BannerTextPlugin;
}).call(this);
