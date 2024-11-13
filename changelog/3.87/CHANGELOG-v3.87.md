# Version 3.87 - Aoi - in dev

## Updates


## Bug Fixes

* Fixed the calculation of the index in `GetBitmapTextSize` that would lead to incorrect indexes vs. the docs and previous releases (thanks @bagyoni)
* `Utils.String.RemoveAt` would incorrectly calculate the slice index if it was > 0. It will now remove the correctly specified character.

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@Jessime
@drakang4
