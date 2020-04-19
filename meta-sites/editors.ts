import * as wiki from "seran/wiki.ts"
import { join } from "std/path/posix.ts";

export let plugins = [ "/ace.mjs", "/cm.mjs" ]

export let handler = new wiki.Handler()

handler.route("^/cm/", (req) => {
  wiki.serveResource(req, import.meta.url, `/client/${req.url}`)
})

handler.route("^/ace/", (req) => {
  wiki.serveResource(req, import.meta.url, `/client/${req.url}`)
})

handler.page(wiki.welcomePage("[[SeranWiki]]", "[[Editors]]"))
handler.page(wiki.page("Editors", [
  wiki.paragraph("[[CM]]"),
  wiki.paragraph("[[Ace]]")
]))
handler.page(wiki.page("CM", [ wiki.item("cm", {}) ]))
handler.page(wiki.page("Ace", [ wiki.item("ace", {}) ]))
handler.plugins(import.meta.url, "client")