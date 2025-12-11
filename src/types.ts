export type TextInterp = number | string | TextFmt

export type TextFmt = { b: boolean; i: boolean; text: string }

export interface Runner {
    (text: TemplateStringsArray, ...interps: string[]): Promise<void>
    choose<T>(choices: Record<string, Script<T>>, forced?: string): Promise<T>
}

export type Script<T> = (runner: Runner) => T | Promise<T>
