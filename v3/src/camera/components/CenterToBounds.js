var CenterToBounds = function ()
{
    this.scrollX = (this._bounds.width * 0.5) - (this.width * 0.5);
    this.scrollY = (this._bounds.height * 0.5) - (this.height * 0.5);
    
    return this;
};

module.exports = CenterToBounds;
