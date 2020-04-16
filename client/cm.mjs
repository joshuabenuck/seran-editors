export class CM extends HTMLElement {
    async load(url) {
        let script = document.createElement("script")
        script.setAttribute("type", "text/javascript")
        script.setAttribute("src", url)
        // PromiseUtil.promisify
        let promise = new Promise((res, rej) => {
            script.onload = () => {
                res()
            }
        })
        this.shadowRoot.appendChild(script)
        return promise
    }

    async resources(list) {
        let ret = Promise.resolve()
        for(let script of list) {
            ret = await this.load(script)
        }
        return ret
    }

    connectedCallback() {
        if (this.inited) return
        this.inited = true
        let shadow = this.attachShadow({ mode: "open" })
        let css = `
            :host {
                display: block;
                border: 1px solid lightgray;
            }
        `
        let style = document.createElement("style")
        style.innerHTML = css
        shadow.appendChild(style)

        let link = document.createElement("link")
        link.setAttribute("rel", "stylesheet")
        link.setAttribute("href", "/cm/lib/codemirror.css")
        shadow.appendChild(link)

        this.resources([
            "/cm/lib/codemirror.js",
            "/cm/mode/javascript/javascript.js",
            "/cm/keymap/vim.js"
        ]).then(() => {
            let cm = new CodeMirror(shadow, {
                value: "console.log('testing')",
                keyMap: "vim"
            })
        })
    }
}
registerPlugin("cm", CM)
