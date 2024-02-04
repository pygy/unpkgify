export {importSearcher, templateSearcher}

import {atomic, either, flags, maybe, namedCapture, notAhead, notBehind, sequence, suffix, } from "compose-regexp"
import {ignore, ignore2, string, comment, zeroPlus} from "./ignore.js"

import * as foo from "./ignore.js"

const hex = /[0-9A-Fa-f]/

const _ = zeroPlus(either(/\s/, comment))

const escape = sequence('\\u', either(
	suffix([4], hex),
	['{', suffix([1,6], hex),'}']
))

const bound = notAhead(either(/\p{ID_Continue}/u, escape))

const identifier = atomic(sequence(
	either(/\p{ID_Start}/u, escape),
	zeroPlus(either(/\p{ID_Continue}/u, escape))
))

const importSepcifier = either(
	[identifier, _, 'as', bound, _, identifier],
	identifier
)

const nsImport = sequence('*',_, 'as', bound, _, identifier)

const namedImport = sequence(
	'{', _,
	maybe(
		importSepcifier,
		zeroPlus(_, ',', _, importSepcifier)),
		maybe(_, ','),
		_,
	'}'
)

const importClause = either(
	namedImport,
	nsImport,
	[identifier, maybe(_, ',', _, either(namedImport, nsImport))]
)
const bound2 = notBehind(either(/\p{ID_Continue}/u, escape))

const staticImport = sequence(bound2, 'import', bound, _, either (
	string,
	[importClause, _, 'from', _, namedCapture('staticModuleSpecifier', string)],
))


const dynamicImport = sequence(bound2, 'import', _, '(', _, namedCapture('dynamicModuleSpecifier', string), _, ')')

const importMatcher = either (
	staticImport,
	dynamicImport

)
const importSearcher = flags.add('gd', either(staticImport, dynamicImport, ignore))
const templateSearcher = flags.add('gd', either(dynamicImport, ignore2))
