import o from 'ospec'
import {unpkgify} from '../index.js'

o('works with static imports', ()=>{
	o(unpkgify(`import foo from "foo"`))
		.equals(`import foo from "https://unpkg.com/foo?module"`)
	o(unpkgify(`import * as foo from "foo"`))
		.equals(`import * as foo from "https://unpkg.com/foo?module"`)
	o(unpkgify(`import {foo, bar as baz} from "foo"`))
		.equals(`import {foo, bar as baz} from "https://unpkg.com/foo?module"`)
	o(unpkgify(`import foo, * as fooo from "foo"`))
		.equals(`import foo, * as fooo from "https://unpkg.com/foo?module"`)
	o(unpkgify(`import foo, {fooo, bar as baz} from "foo"`))
		.equals(`import foo, {fooo, bar as baz} from "https://unpkg.com/foo?module"`)
})

o('works with dynamic imports', ()=>{
	o(unpkgify(`import("foo")`)).equals(`import("https://unpkg.com/foo?module")`)
})

o('tolerates multi-line comments', ()=>{
	o(unpkgify(`/*a*/import/*a*/foo/*a
	*/from/*a*/"foo"`))
		.equals(`/*a*/import/*a*/foo/*a
	*/from/*a*/"https://unpkg.com/foo?module"`)
	o(unpkgify(`/*a*/import/*a*/*/*a*/as/*a*/foo/*a*/from/*a*/"foo"`))
		.equals(`/*a*/import/*a*/*/*a*/as/*a*/foo/*a*/from/*a*/"https://unpkg.com/foo?module"`)
	o(unpkgify(`/*a*/import/*a*/{/*a*/foo/*a*/,/*a*/bar/*a*/as/*a*/baz/*a*/}/*a*/from/*a*/"foo"/*a*/`))
		.equals(`/*a*/import/*a*/{/*a*/foo/*a*/,/*a*/bar/*a*/as/*a*/baz/*a*/}/*a*/from/*a*/"https://unpkg.com/foo?module"/*a*/`)
	o(unpkgify(`/*a*/import/*a*/foo/*a*/,/*a*/*/*a*/as/*a*/fooo/*a*/from/*a*/"foo"`))
		.equals(`/*a*/import/*a*/foo/*a*/,/*a*/*/*a*/as/*a*/fooo/*a*/from/*a*/"https://unpkg.com/foo?module"`)
	o(unpkgify(`/*a*/import/*a*/foo/*a*/,/*a*/{fooo/*a*/,/*a*/bar/*a*/as/*a*/baz/*a*/}/*a*/from/*a*/"foo"`))
		.equals(`/*a*/import/*a*/foo/*a*/,/*a*/{fooo/*a*/,/*a*/bar/*a*/as/*a*/baz/*a*/}/*a*/from/*a*/"https://unpkg.com/foo?module"`)

	o(unpkgify(`/*a*/import/*a*/(/*a*/"foo"/*a*/)/*a*/`)).equals(`/*a*/import/*a*/(/*a*/"https://unpkg.com/foo?module"/*a*/)/*a*/`)
})

o('tolerates single-line comments', ()=>{
	o(unpkgify(
`import//a
foo//a
//a
from //a
"foo"//a`))
		.equals(
`import//a
foo//a
//a
from //a
"https://unpkg.com/foo?module"//a`)
	o(unpkgify(
`//a
import//a
//bb
(//c
//d d d
"foo" //e
//f
)//g
`)).equals(`//a
import//a
//bb
(//c
//d d d
"https://unpkg.com/foo?module" //e
//f
)//g
`)
})

o('ignores template strings and comments', ()=>{
	const src = `
	// import foo from "foo" import("foo")
	/* import foo from "foo" import("foo")*/
	const tpl1 = \`import foo from "foo" import("foo")\`
	const tpl2 = \`import foo from "foo" import("foo")\${import foo from "foo"}import foo from "foo" import("foo")\${a}import foo from "foo" import("foo")\`
	`
	o(unpkgify(src)).equals(src)
})

o('dynamic imports work when interpolated in template strings', ()=>{
	o(unpkgify(
		`const tpl = \`\${import("foo")}\${import("foo")}\`;import("foo")`
	)).equals(
		`const tpl = \`\${import("https://unpkg.com/foo?module")}\${import("https://unpkg.com/foo?module")}\`;import("https://unpkg.com/foo?module")`
	)
})

o("ignores fully qualified https urls", ()=>{
	const src = `import {wont, be, changed} from "https://fully.qualified.url/some-file"`
	o(unpkgify(src)).equals(src)
	const src2 = `import("https://fully.qualified.url/some-file"}`
	o(unpkgify(src2)).equals(src2)
})