// ES6 Math.trunc - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
if (!Math.trunc) {
    Math.trunc = function trunc(x) {
        return x < 0 ? Math.ceil(x) : Math.floor(x);
    };
}
