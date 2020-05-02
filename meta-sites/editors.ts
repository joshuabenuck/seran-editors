import * as wiki from "seran/wiki.ts"
import { join } from "std/path/posix.ts";
import { exists, writeFileStr } from "std/fs/mod.ts";

export let plugins = [ "/ace.mjs", "/cm.mjs" ]

export let handler = new wiki.Handler()

handler.route("^/cm/", (req) => {
  wiki.serveResource(req, import.meta.url, `/client/${req.url}`)
  return true
})

handler.route("^/ace/", (req) => {
  wiki.serveResource(req, import.meta.url, `/client/${req.url}`)
  return true
})

handler.route("^/load", async (req, _system) => {
  let path = join(req.site.root, "ace.js")
  if (!await exists(path)) {
    let contents = "console.log('hi!')"
    wiki.serveContents(req, "text", contents, contents.length)
    return true
  }
  wiki.serveFile(req, "text", path)
  return true
})

handler.route("^/save", async (req, _system) => {
  let buffer = new Uint8Array(req.contentLength)
  await req.body.read(buffer)
  let contents = new TextDecoder().decode(buffer)
  let path = join(req.site.root, "ace.js")
  await writeFileStr(path, contents)
  wiki.serveJson(req, {status: "success", contents})
  return true
})

// TODO: Improve wiki.page to accept strings for items as handler.page does.
handler.items("Run", async (req) => {
  let path = join(req.site.root, "ace.js")
  try {
    let module = await import(path + `?time=${new Date().getTime()}`)
    if (!module.serve) {
      return ["error: no serve function in ace.js"]
    }
    let items = module.serve(req)
    return items
  } catch (e) {
    // wiki.serveJson(req, {status: "error", result: e})
    return ["error: " + e]
  }
})

handler.page(wiki.welcomePage("[[SeranWiki]]", "[[Editors]]"))
handler.items("Editors", [
  "[[CM]]",
  "[[Ace]]"
])
handler.page(wiki.page("CM", [ wiki.item("cm", {}) ]))
handler.items("Ace", [
  wiki.item("ace", {}),
  "[[Run]]"
])
handler.plugins(import.meta.url, "client")

/**
 * Complete an edit, show a diff on the page / other git workflow stuff
 * Shell script with deno
 * Lots of small editors in a wiki where the wiki describes the code
 * 
 */