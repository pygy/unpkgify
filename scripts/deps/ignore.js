export {ignore, ignore2, string, comment, zeroPlus}

import {atomic, either, namedCapture, notAhead, suffix} from "compose-regexp"

const zeroPlus = suffix('*')

const comment = either(
  ['//', /.*/u, /[\n\r]/],
  ['/*', atomic(zeroPlus(notAhead('*/'), /[^]/u)), '*/']
)

const string = either(
  ['"', zeroPlus(either(['\\', /./u], /[^"]/)) ,'"'],
  ["'", zeroPlus(either(['\\', /./u], /[^']/)) ,"'"]
)

const rawTemplateContent = zeroPlus(either(
  ['\\', /[^]/u],
  [notAhead(either('`', '${')), /[^]/u]
))
//*
const templateContent = atomic(rawTemplateContent)

const templateBit = either(
  ['`', templateContent, '`'],
  ['`', templateContent, '${', namedCapture('openTemplate')],
)

const templateBit2 = either(
  ['`', templateContent, '`'],
  ['`', templateContent, '${', namedCapture('openTemplate', '')],
  ['}', templateContent, '${'],
  ['}', templateContent, '`',  namedCapture('closeTemplate', '')]
)


const ignore = either(
  comment,
  string,
  templateBit
)
const ignore2 = either(
  comment,
  string,
  templateBit2
)