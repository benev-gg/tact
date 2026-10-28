
import {disposer, ev} from "@e280/stz"
import {Expression} from "../../../../input/expression.js"
import {mouseButton} from "../../../../input/utils/mouse-button.js"

export function capturePointerChord(
		update: (code: Expression) => void,
		onDone: () => void,
	) {

	const {dispose, schedule} = disposer()
	schedule(onDone)

	const held = new Set<string>()
	const seen = new Set<string>()

	const isControl = (event: MouseEvent) =>
		event.composedPath().some(target =>
			target instanceof Element &&
			target.matches("button.record")
		)

	schedule(ev(window, {
		blur: () => dispose(),

		mousedown: (event: MouseEvent) => {
			if (isControl(event)) return
			event.preventDefault()

			const code = mouseButton(event.button)
			held.add(code)
			seen.add(code)
		},

		auxclick: (event: MouseEvent) => {
			event.preventDefault()
		},

		mouseup: (event: MouseEvent) => {
			const code = mouseButton(event.button)
			if (!held.delete(code)) return
			event.preventDefault()

			if (held.size === 0) {
				if (seen.size === 1) update([...seen][0]!)
				else if (seen.size > 1) update(["*", ...seen])
				dispose()
			}
		},

		contextmenu: (event: MouseEvent) => {
			event.preventDefault()
		},
	}))

	return dispose
}
