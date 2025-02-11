# Version 3.88.1 - Minami - 12th February 2025

## Bug Fixes

* Fixed `ReferenceError: GetFastValueOp is not defined` in NumberTweenBuilder (thanks Flow)
* Reverted incorrect change made to `SafeRange` array util function.
* Fixed `Array.Utils.GetFirst` so it correctly handles a negative start index. Fixes Container.getByName returning null and various other similar methods. Fix #7040 (thanks @XWILKINX)
