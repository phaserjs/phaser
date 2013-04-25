var Single2;
(function (Single2) {
    function main() {
        return "hello single2";
    }
    Single2.main = main;
})(Single2 || (Single2 = {}));
Single2.main();
var Single1;
(function (Single1) {
    function main() {
        return "hello single1";
    }
    Single1.main = main;
})(Single1 || (Single1 = {}));
Single1.main();
