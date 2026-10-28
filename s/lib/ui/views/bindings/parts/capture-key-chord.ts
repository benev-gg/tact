
import {ev} from "@e280/stz"
import {Expression} from "../../../../input/expression.js"

function mod(code: string) {
	if (code === "ShiftLeft" || code === "ShiftRight") return "shift"
	if (code === "ControlLeft" || code === "ControlRight") return "ctrl"
	if (code === "MetaLeft" || code === "MetaRight") return "meta"
	if (code === "AltLeft" || code === "AltRight") return "alt"
	return undefined
}

export function captureKeyChord(update: (code: Expression) => void, onDone: () => void) {
	const held = new Set<string>()
	const seen = new Set<string>()

	const stop = ev(window, {
		blur: () => halt(),
		keydown: (event: KeyboardEvent) => {
			event.preventDefault()
			held.add(event.code)
			seen.add(event.code)
		},
		keyup: (event: KeyboardEvent) => {
			event.preventDefault()
			held.delete(event.code)
			if (held.size === 0) {
				const codes = new Set<string>()
				const mods = new Set<string>()

				for (const code of seen) {
					const m = mod(code)
					if (m) mods.add(m)
					else codes.add(code)
				}

				if (seen.size === 0)
					void 0
				else if (codes.size === 0)
					update(["*", ...seen])
				else if (mods.size > 0)
					update(["*", ["mod", ...mods as any], ...codes])
				else if (seen.size > 1)
					update(["*", ...seen])
				else
					update([...seen][0]!)

				halt()
			}
		},
	})

	const halt = () => {
		stop()
		onDone()
	}

	return halt
}

