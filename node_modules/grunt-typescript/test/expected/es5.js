var ES5;
(function (ES5) {
    var Test = (function () {
        function Test() { }
        Object.defineProperty(Test.prototype, "greeting", {
            get: function () {
                return "Hello!";
            },
            enumerable: true,
            configurable: true
        });
        return Test;
    })();
    ES5.Test = Test;    
})(ES5 || (ES5 = {}));
var test = new ES5.Test();
console.log(test.greeting);
