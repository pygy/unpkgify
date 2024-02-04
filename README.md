# unpkgify

## usage

```JS
import {unpkgify} from "unpkgify"

console.log(unpkgify(`
import {foo, ffoo as feefoo} from "foo"
import * as bar /*annoying comment*/ from "bar"

ignoreStrings(\`import * as x from "leftAlone"\`)
`))
```

prints

```JS
import {foo, ffoo as feefoo} from "https://unpkg.com/foo?module"
import * as bar /*annoying comment*/  from "https://unpkg.com/bar?module"

ignoreStrings(`import * as x from "leftAlone"`)

```

## Limitations:

This uses a degenerate parser which doesn't understant regexps, but is otherwise robust (provided valid JS is passed in).

So `const r = /import * as star from "star"/` will be turned into `const r = /import * as star from "https://unpkg.com/star?module"/`. Provided that RegExps of that form are very unlikely to happen in real code (unlike `/import \* as star .../` which is not affected), this is deemed an acceptable tradeof.
