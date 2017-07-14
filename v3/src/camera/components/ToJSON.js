/*
    camera: {
        x: int
        y: int
        width: int
        height: int
        zoom: float
        rotation: float
        roundPixels: bool
        scrollX: float
        scrollY: float
        backgroundColor: string
        bounds: {
            x: int
            y: int
            width: int
            height: int
        }
    }
*/
var ToJSON = function ()
{
    var output = {
        name: this.name,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        zoom: this.zoom,
        rotation: this.rotation,
        roundPixels: this.roundPixels,
        scrollX: this.scrollX,
        scrollY: this.scrollY,
        backgroundColor: this.backgroundColor.rgba
    };

    if (this.useBounds)
    {
        output['bounds'] = {
            x: this._bounds.x,
            y: this._bounds.y,
            width: this._bounds.width,
            height: this._bounds.height
        };
    }

    return output;
};

module.exports = ToJSON;
