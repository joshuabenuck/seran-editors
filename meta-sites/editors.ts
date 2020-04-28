import * as wiki from "seran/wiki.ts"
import { join } from "std/path/posix.ts";

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

handler.route("^/save", async (req, _system) => {
  let buffer = new Uint8Array(req.contentLength)
  await req.body.read(buffer)
  let contents = new TextDecoder().decode(buffer)
  wiki.serveJson(req, {status: "success", contents: {
    props: Object.keys(req),
    body: req._body,
    method: req.method
  }})
  return true
})

// TODO: Improve wiki.page to accept strings for items as handler.page does.
handler.items("Run", [
  "Success"
])

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