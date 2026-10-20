
export type Atom = string | (
	| Code
	| And
	| Or
	| Not
	| Cond
	| Mods
)

export type Code = ["code", string, settings?: Partial<CodeSettings>]
export type And = ["and", ...Atom[]]
export type Or = ["or", ...Atom[]]
export type Not = ["not", Atom]
export type Cond = ["cond", Atom, guard: Atom]
export type Mods = ["mods", Atom, modifiers: Partial<Modifiers>]

export type CodeSettings = {
	scale: number
	invert: boolean
	clamp: null | [number, number]
	range: null | [number, number]
	bottom: null | number
	top: null | number
	timing: (
		| ["direct"]
		| ["tap", holdTime?: number]
		| ["hold", holdTime?: number]
	)
}

export type CodeState = {
	settings: CodeSettings
	lastValue: number
	holdStart: number
}

export type Modifiers = {
	ctrl: boolean
	alt: boolean
	shift: boolean
	meta: boolean
}

