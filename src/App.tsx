import { createSignal, onCleanup, type JSX } from "solid-js"
import { render } from "solid-js/web"
import script from "./script/atlantic"

const instant = !!globalThis.location?.href.includes("instant")

function Border(props: { viewBox: string; class: string; focused?: boolean; disabled?: boolean }) {
    return (
        <svg
            viewBox={props.viewBox}
            class={
                props.class +
                (props.focused
                    ? props.disabled
                        ? " text-blue-200 fill-blue-200"
                        : " text-blue-700 fill-blue-700"
                    : "")
            }
            preserveAspectRatio="none"
        >
            <path
                d={"M 1 0 h 8 v 1 h 1 v 8 h -1 v 1 h -8 v -1 h -1 v -8 h 1 v -1 z"}
                stroke-width={0.5}
                class={
                    props.focused
                        ? props.disabled
                            ? "fill-blue-50"
                            : "fill-blue-200"
                        : "fill-none"
                }
                stroke="currentcolor"
            />
            <path
                d={
                    "M 8.75 0.25 h 1 v 1 Z M 9.75 1.25 h 1 v 8.5 h -1 v 1 h -8.5 v -1 h -1 v -1 h 1 v 1 h 7.5 v -1 h 1 v -7.5"
                }
                fill="currentcolor"
            />
        </svg>
    )
}

function Button(props: {
    label: JSX.Element
    children: JSX.Element
    focused?: boolean
    disabled?: boolean
}) {
    return (
        <div
            class="flex gap-4"
            classList={{
                "text-neutral-400": props.disabled,
            }}
        >
            <div class="size-10 min-w-10 flex items-center justify-center relative pl-0.5">
                <Border
                    viewBox="0 0 10 10"
                    class={
                        "absolute top-0 left-0 size-full overflow-visible" +
                        (props.disabled ? " text-neutral-300" : "")
                    }
                    focused={props.focused}
                    disabled={props.disabled}
                />
                <span
                    class="relative"
                    classList={{
                        "text-blue-900": props.focused && !props.disabled,
                        "text-blue-300": props.focused && props.disabled,
                    }}
                >
                    {props.label}
                </span>
            </div>
            <div class="text-left">{props.children}</div>
        </div>
    )
}

function Box(props: { children: JSX.Element }) {
    return (
        <div class="rounded-3xl p-4 min-h-24 relative">
            <Border viewBox="-0.5 -0.5 2 2" class="absolute -top-0.5 -left-0.5 size-2" />
            <Border viewBox="-0.5 8.5 2 2" class="absolute -bottom-0.5 -left-0.5 size-2" />
            <Border viewBox="8.5 -0.5 2 2" class="absolute -top-0.5 -right-0.5 size-2" />
            <Border viewBox="8.5 8.5 2 2" class="absolute -bottom-0.5 -right-0.5 size-2" />

            <Border
                viewBox="1.5 -0.5 7 2"
                class="absolute -top-0.5 left-1.5 -right-1.5 h-2 w-[calc(100%_-_0.75rem)]"
            />
            <Border
                viewBox="-0.5 1.5 2 7"
                class="absolute -left-0.5 top-1.5 -bottom-1.5 h-[calc(100%_-_0.75rem)] w-2"
            />
            <Border
                viewBox="8.5 1.5 2 7"
                class="absolute -right-0.5 top-1.5 -bottom-1.5 h-[calc(100%_-_0.75rem)] w-2"
            />
            <Border
                viewBox="1.5 8.5 7 2"
                class="absolute -bottom-0.5 left-1.5 -right-1.5 h-2 w-[calc(100%_-_0.75rem)]"
            />

            <span class="whitespace-pre-line">{props.children}</span>
        </div>
    )
}

function ButtonGrid(props: { children: JSX.Element }) {
    return <div class="grid grid-cols-2 px-4 gap-x-4 gap-y-4 text-sm">{props.children}</div>
}

function App() {
    const [el, ctx] = createRunner(
        "mx-auto max-w-2xl w-full py-8 flex flex-col gap-8",
        ["q", "w", "a", "s", "z", "x"],
        "Shift",
    )

    script(ctx)

    return <div class="mx-8 flex">{el}</div>
}

function DrawText(props: {
    class?: string
    children: string
    speed?: "stop" | "fast" | undefined
    onDone(): void
}) {
    const [index, setIndex] = createSignal(0)
    let mark = Date.now()

    const intervalId = setInterval(() => {
        const now = Date.now()

        const nextChar = props.children[index()]

        if (instant) {
            setIndex(props.children.length)
            clearInterval(intervalId)
            props.onDone()
        }

        const diff =
            (props.speed == "stop" ? Infinity : props.speed == "fast" ? 10 : 30) *
            (nextChar == "\n" ? 20 : 1)

        if (now - mark > diff) {
            mark = mark + diff
            if (setIndex((i) => i + 1) == props.children.length) {
                clearInterval(intervalId)
                props.onDone()
            }
        }
    })

    return (
        <span class={props.class}>
            <span>{props.children.slice(0, index())}</span>
            <span class="invisible">{props.children.slice(index())}</span>
        </span>
    )
}

function createRunner(className: string, keys: string[], fastKey: string): [JSX.Element, Ctx] {
    const unrenders: (() => void)[] = []
    let el!: HTMLDivElement
    const ret = <div class={className} ref={el} />
    onCleanup(() => unrenders.forEach((x) => x()))
    const [fast, setFast] = createSignal(false)

    addEventListener("keydown", (x) => {
        if (x.key == fastKey) {
            setFast(true)
        }
    })
    addEventListener("keyup", (x) => {
        if (x.key == fastKey) {
            setFast(false)
        }
    })

    const ctx: Ctx = {
        type(text, ...interps) {
            return new Promise((resolve) => {
                const value = String.raw({ raw: text }, interps)
                unrenders.push(
                    render(
                        () => (
                            <Box>
                                <DrawText
                                    onDone={() => (instant ? resolve() : setTimeout(resolve, 1000))}
                                    speed={fast() ? "fast" : undefined}
                                >
                                    {value}
                                </DrawText>
                            </Box>
                        ),
                        el,
                    ),
                )
                scrollTo(0, document.body.scrollHeight)
            })
        },
        choose<T>(choices: Record<string, T>) {
            const [selected, setSelected] = createSignal<number>()
            const [disabled, setDisabled] = createSignal(false)
            const entries = Object.entries(choices)

            return Object.assign(
                new Promise<T>((resolve) => {
                    unrenders.push(
                        render(() => {
                            addEventListener("keyup", function listener(event: KeyboardEvent) {
                                if (event.ctrlKey || event.metaKey || event.altKey) return

                                const key = event.key
                                const keyIndex = keys.indexOf(key)
                                if (keyIndex == -1) return

                                const entry = entries[keyIndex]
                                if (!entry) return

                                removeEventListener("keyup", listener)
                                setDisabled(true)
                                setSelected(keyIndex)
                                this.setTimeout(resolve, 1000, entry[1])
                            })

                            return (
                                <ButtonGrid>
                                    {entries.map(([label], index) => (
                                        <Button
                                            label={keys[index]?.toUpperCase()}
                                            disabled={disabled() && selected() != index}
                                            focused={selected() == index}
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </ButtonGrid>
                            )
                        }, el),
                    )
                    scrollTo(0, document.body.scrollHeight)
                }),
                {
                    async sim(i: number): Promise<T> {
                        const val = entries[i][1]
                        setSelected(i)
                        setDisabled(true)
                        return val
                    },
                },
            )
        },
        switch(scripts) {
            const choice = ctx.choose(scripts)
            return Object.assign(
                choice.then((script) => script(ctx)),
                {
                    async sim(i: number): Promise<any> {
                        const script = await choice.sim(i)
                        return await script(ctx)
                    },
                },
            )
        },
    }

    return [ret, ctx]
}

export interface Ctx {
    type(text: readonly string[], ...interps: readonly (string | number)[]): Promise<void>

    choose<T>(choices: Record<string, T>): Promise<T> & {
        sim(i: number): Promise<T>
    }

    switch<T>(scripts: Record<string, Script<T>>): Promise<T> & {
        sim(i: number): Promise<T>
    }
}

export type Script<T> = (ctx: Ctx) => T | PromiseLike<T>

export default App

export type TextArgs = readonly [readonly string[], ...(string | number)[]]
