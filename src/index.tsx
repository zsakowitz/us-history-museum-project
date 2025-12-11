/* @refresh reload */
import { render } from "solid-js/web"
import App from "./App"
import "./index.css"
import src from "./script/atlantic.ts?raw"

const root = document.getElementById("root")

function highlight() {
    const output: [string, boolean | "comment"][] = []
    let mode: "`" | '"' | "/" | "//" | "$" | "${" | "}" | '${"' | undefined

    for (const char of src) {
        if (char == "/") {
            if (mode == "/") {
                mode = "//"
                output.pop()
                output.push(["//", "comment"])
                continue
            }

            if (mode == null) {
                mode = "/"
                output.push(["/", false])
                continue
            }
        } else if (char == "$") {
            if (mode == "`") {
                mode = "$"
            }
        } else if (char == "{") {
            if (mode == "$") {
                mode = "${"
            }
        } else if (char == "}" && mode == "${") {
            mode = "}"
        }

        if (mode == "/" || (mode == "//" && char == "\n")) {
            mode = undefined
        }

        if (char == '"') {
            if (mode == '"') {
                mode = undefined
                output.push([char, false])
                continue
            }

            if (mode == null) {
                mode = '"'
                output.push([char, false])
                continue
            }

            if (mode == "${") {
                mode = '${"'
                output.push([char, false])
                continue
            }

            if (mode == '${"') {
                mode = "${"
                output.push([char, false])
                continue
            }
        }

        if (char == "`") {
            if (mode == "`") {
                mode = undefined
                output.push([char, false])
                continue
            }

            if (mode == null) {
                mode = "`"
                output.push([char, false])
                continue
            }
        }

        output.push([
            char,
            mode == "//" ? "comment" : mode == "$" || mode == "${" || mode == "}" ? false : !!mode,
        ])

        if (mode == "}") {
            mode = "`"
        }
    }

    for (let index = 1; index < output.length; index++) {
        if (output[index - 1]![1] == output[index]![1]) {
            output[index - 1]![0] += output[index]![0]
            output.splice(index, 1)
            index--
        }
    }

    return output
}

function Source() {
    return (
        <div class="max-w-3xl mx-auto px-8 py-8">
            <h1 class="text-center text-xl">Source Code</h1>
            <p class="text-sm text-center text-balance">
                Programming boilerplate is grayed out.
                <br />
                All actual content is in black text.
                <br />
                Some black text is actually programming boilerplate.
                <br />
                Blue text contains commentary which may help to understand the program.
            </p>
            <pre class="whitespace-pre-wrap pt-8">
                {highlight().map(([part, include]) => (
                    <span
                        class={
                            include == "comment"
                                ? "text-blue-500 opacity-70 select-none"
                                : include
                                  ? "font-sans"
                                  : "opacity-20 select-none"
                        }
                    >
                        {part}
                    </span>
                ))}
            </pre>
        </div>
    )
}

render(() => (location.search.includes("source") ? <Source /> : <App />), root!)
