export {unpkgify}

import {importSearcher, templateSearcher} from "./searchers.js"

function unpkgify(src) {
  const indices = []
  importSearcher.lastIndex = 0
  let templateDepth = 0, result
  while (result = importSearcher.exec(src)) {
    const {groups: {openTemplate}, indices: {groups: {staticModuleSpecifier, dynamicModuleSpecifier}}} = result
    if (openTemplate != null) {
      templateDepth++
      templateSearcher.lastIndex = importSearcher.lastIndex
      while (result = templateSearcher.exec(src)) {
        const {groups: {openTemplate, closeTemplate}, indices: {groups: {dynamicModuleSpecifier}}} = result
        if (openTemplate != null) templateDepth++
        else if (closeTemplate != null) templateDepth--
        else if (dynamicModuleSpecifier != null) indices.push(dynamicModuleSpecifier)
        if (templateDepth === 0) break
      }
      if (templateDepth !== 0) throw new SyntaxError("couldn't parse input")
      importSearcher.lastIndex = templateSearcher.lastIndex
    } else if (staticModuleSpecifier != null) {
        indices.push(staticModuleSpecifier)
    } else if (dynamicModuleSpecifier != null) {
        indices.push(dynamicModuleSpecifier)
    }
  }
  indices.reverse().forEach(([start, end]) => {
    const moduleSpecifier = JSON.parse(src.substring(start, end))
    if (!/^https?:\/\//.test(moduleSpecifier)) {
      src = src.slice(0, start) + JSON.stringify(`https://unpkg.com/${moduleSpecifier}?module`) + src.slice(end) 
    }   
  })
  return src
}
