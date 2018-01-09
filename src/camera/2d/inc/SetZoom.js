var SetZoom = function (value)
{
    if (value === undefined) { value = 1; }

    this.zoom = value;

    return this;
};

module.exports = SetZoom;
