/**
* A polyfill for Array.isArray
*/
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
//# sourceMappingURL=Array.isArray.js.map