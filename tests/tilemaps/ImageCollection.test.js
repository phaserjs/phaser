var ImageCollection = require('../../src/tilemaps/ImageCollection');

describe('ImageCollection', function ()
{
    describe('Constructor', function ()
    {
        it('should create an ImageCollection with required parameters', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            expect(collection.name).toBe('tiles');
            expect(collection.firstgid).toBe(1);
        });

        it('should default imageWidth and imageHeight to 32 when not provided', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            expect(collection.imageWidth).toBe(32);
            expect(collection.imageHeight).toBe(32);
        });

        it('should default margin and spacing to 0 when not provided', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            expect(collection.imageMargin).toBe(0);
            expect(collection.imageSpacing).toBe(0);
        });

        it('should default properties to empty object when not provided', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            expect(collection.properties).toEqual({});
        });

        it('should initialise images as empty array', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            expect(collection.images).toEqual([]);
        });

        it('should initialise total to 0', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            expect(collection.total).toBe(0);
        });

        it('should set custom width and height', function ()
        {
            var collection = new ImageCollection('tiles', 1, 64, 128);
            expect(collection.imageWidth).toBe(64);
            expect(collection.imageHeight).toBe(128);
        });

        it('should set custom margin and spacing', function ()
        {
            var collection = new ImageCollection('tiles', 1, 32, 32, 4, 2);
            expect(collection.imageMargin).toBe(4);
            expect(collection.imageSpacing).toBe(2);
        });

        it('should set custom properties', function ()
        {
            var props = { foo: 'bar', count: 42 };
            var collection = new ImageCollection('tiles', 1, 32, 32, 0, 0, props);
            expect(collection.properties).toBe(props);
        });

        it('should fall back to 32 when width is zero', function ()
        {
            var collection = new ImageCollection('tiles', 1, 0, 0);
            expect(collection.imageWidth).toBe(32);
            expect(collection.imageHeight).toBe(32);
        });

        it('should fall back to 32 when width or height is negative', function ()
        {
            var collection = new ImageCollection('tiles', 1, -10, -5);
            expect(collection.imageWidth).toBe(32);
            expect(collection.imageHeight).toBe(32);
        });

        it('should floor float values for firstgid via bitwise OR', function ()
        {
            var collection = new ImageCollection('tiles', 3.9);
            expect(collection.firstgid).toBe(3);
        });

        it('should floor float values for width and height', function ()
        {
            var collection = new ImageCollection('tiles', 1, 48.7, 64.9);
            expect(collection.imageWidth).toBe(48);
            expect(collection.imageHeight).toBe(64);
        });
    });

    describe('containsImageIndex', function ()
    {
        it('should return false when collection is empty', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            expect(collection.containsImageIndex(1)).toBe(false);
        });

        it('should return true for the firstgid after adding images', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            collection.addImage(1, 'img1', 32, 32);
            expect(collection.containsImageIndex(1)).toBe(true);
        });

        it('should return true for an index within the range', function ()
        {
            var collection = new ImageCollection('tiles', 10);
            collection.addImage(10, 'img1', 32, 32);
            collection.addImage(11, 'img2', 32, 32);
            collection.addImage(12, 'img3', 32, 32);
            expect(collection.containsImageIndex(11)).toBe(true);
            expect(collection.containsImageIndex(12)).toBe(true);
        });

        it('should return false for an index below firstgid', function ()
        {
            var collection = new ImageCollection('tiles', 5);
            collection.addImage(5, 'img1', 32, 32);
            expect(collection.containsImageIndex(4)).toBe(false);
        });

        it('should return false for an index equal to firstgid + total', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            collection.addImage(1, 'img1', 32, 32);
            collection.addImage(2, 'img2', 32, 32);
            // total is 2, so valid range is [1, 2]; index 3 is out of range
            expect(collection.containsImageIndex(3)).toBe(false);
        });

        it('should return false for an index above the range', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            collection.addImage(1, 'img1', 32, 32);
            expect(collection.containsImageIndex(100)).toBe(false);
        });

        it('should return false for a negative index', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            collection.addImage(1, 'img1', 32, 32);
            expect(collection.containsImageIndex(-1)).toBe(false);
        });
    });

    describe('addImage', function ()
    {
        it('should add an image and increase total by 1', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            collection.addImage(1, 'myImage', 32, 32);
            expect(collection.total).toBe(1);
        });

        it('should store the correct image data', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            collection.addImage(7, 'myImage', 64, 48);
            expect(collection.images[0]).toEqual({ gid: 7, image: 'myImage', width: 64, height: 48 });
        });

        it('should append multiple images in order', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            collection.addImage(1, 'imgA', 32, 32);
            collection.addImage(2, 'imgB', 32, 32);
            collection.addImage(3, 'imgC', 32, 32);
            expect(collection.total).toBe(3);
            expect(collection.images.length).toBe(3);
            expect(collection.images[0].image).toBe('imgA');
            expect(collection.images[1].image).toBe('imgB');
            expect(collection.images[2].image).toBe('imgC');
        });

        it('should return the ImageCollection instance for chaining', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            var result = collection.addImage(1, 'myImage', 32, 32);
            expect(result).toBe(collection);
        });

        it('should support method chaining across multiple addImage calls', function ()
        {
            var collection = new ImageCollection('tiles', 1);
            collection.addImage(1, 'imgA', 32, 32).addImage(2, 'imgB', 64, 64);
            expect(collection.total).toBe(2);
            expect(collection.images[1].gid).toBe(2);
        });

        it('should store gid, image key, width, and height correctly', function ()
        {
            var collection = new ImageCollection('tiles', 100);
            collection.addImage(100, 'hero', 128, 256);
            var img = collection.images[0];
            expect(img.gid).toBe(100);
            expect(img.image).toBe('hero');
            expect(img.width).toBe(128);
            expect(img.height).toBe(256);
        });
    });
});
