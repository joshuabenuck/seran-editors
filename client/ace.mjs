export class Ace extends HTMLElement {
    connectedCallback() {
        if (this.inited) return
        this.inited = true
        let pre = document.createElement("div")
        pre.setAttribute("id", "editor")
        pre.textContent = "console.log('testing')"
        this.appendChild(pre)

        let script = document.createElement("script")
        script.setAttribute("type", "text/javascript")
        script.onload = async (e) => {
            ace.config.set('basePath', '/')
            let editor = ace.edit(pre, {
                theme: "ace/theme/twilight",
                mode: "ace/mode/javascript",
                keyboardHandler: "ace/keyboard/vim",
                maxLines: 30
            })
            editor.focus()
        }
        script.setAttribute("src", "/ace.js")
        this.appendChild(script)
    }
}
registerPlugin("ace", Ace)