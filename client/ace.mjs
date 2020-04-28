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
            let VimAPI = ace.require("ace/keyboard/vim")
            ace.config.set('basePath', '/ace')
            this.editor = ace.edit(pre, {
                mode: "ace/mode/javascript",
                keyboardHandler: "ace/keyboard/vim",
                maxLines: 30
            })
            this.editor.commands.addCommand({
                name: 'save',
                bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
                exec: async (editor) => {
                    let results = await fetch("/save", {
                        method: "POST",
                        body: editor.getValue()
                    })
                    console.log(await results.json())
                },
                readOnly: true // false if this command should not apply in readOnly mode
            })
            this.editor.focus()
            console.log("vim", VimAPI)
        }
        script.setAttribute("src", "/ace/ace.js")
        this.appendChild(script)
    }
}
registerPlugin("ace", Ace)