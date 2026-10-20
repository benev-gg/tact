
import {ev} from "@e280/stz"
import {PlainSource} from "./plain.js"

export class KeyboardSource extends PlainSource {
	#down = new Set<string>()

	constructor(target: EventTarget = window) {
		super()
		this.dispose.schedule(ev(target, this.#targetListeners))
		this.dispose.schedule(ev(window, this.#windowListeners))
	}

	#targetListeners = {
		keydown: (event: KeyboardEvent) => {
			if (event.repeat) return

			if (this.#down.size === 0)
				this.onSample.publish({code: "keyboard.any", value: 1})

			this.onSample.publish({code: event.code, value: 1})
			this.#down.add(event.code)
		},

		keyup: (event: KeyboardEvent) => {
			this.onSample.publish({code: event.code, value: 0})
			this.#down.delete(event.code)

			if (this.#down.size === 0)
				this.onSample.publish({code: "keyboard.any", value: 0})
		},
	}

	#windowListeners = {
		blur: () => {
			for (const code of this.#down)
				this.onSample.publish({code: code, value: 0})

			if (this.#down.size)
				this.onSample.publish({code: "keyboard.any", value: 0})

			this.#down.clear()
		},
	}
}

