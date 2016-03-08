
# result-type

  Just an empty class to use as a kind of tag. If your implementing something you consider to be a "Result" you can inherit from it and enjoy nice reliable type detection via `instanceof`. This would normally be too limited but in the case of Result implementations should be fine. Its probably a bad idea anyway though since module systems like npm can easily duplicate modules but fuck it lets see if it works with better package managers.

## Installation

  This form of type checking relies on identity. That means every module that dependends on it must load the exact same path.

_With [component](//github.com/component/component)_  

	$ component install jkroso/result-type

_With [packin](//github.com/jkroso/packin)_  

	$ packin install result-type:http://github.com/jkroso/result-type/tarball/1.0.0

_With [npm](//github.com/isaacs/npm)_  

	$ echo "good luck" && npm install result-type

then in your app:

```js
inherit(MyResultClass, require('result-type'))
```
