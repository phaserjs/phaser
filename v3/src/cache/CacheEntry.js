var CacheEntry = function (key, url, data)
{
    this.key = key;

    this.url = url;

    this.data = data;
};

CacheEntry.prototype.constructor = CacheEntry;

module.exports = CacheEntry;
