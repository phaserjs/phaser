var Multi1;
(function (Multi1) {
    function main() {
        return "hello multi1";
    }
    Multi1.main = main;
})(Multi1 || (Multi1 = {}));
Multi1.main();
