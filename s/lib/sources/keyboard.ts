
import {disposer, ev, sub} from "@e280/stz"
import {Sample, Source} from "../types.js"

export class KeyboardSource implements Source {
	dispose = disposer()
	onSample = sub<[Sample]>()
	#down = new Set<string>()

	constructor(target: EventTarget = window) {
		this.dispose.schedule(ev(target, this.#targetListeners))
		this.dispose.schedule(ev(window, this.#windowListeners))
	}

	#publish(code: string, value: number) {
		const time = performance.now()
		this.onSample.publish([time, code, value])
	}

	#targetListeners = {
		keydown: (event: KeyboardEvent) => {
			if (event.repeat) return

			if (this.#down.size === 0)
				this.#publish("keyboard.any", 1)

			this.#publish(event.code, 1)
			this.#down.add(event.code)
		},

		keyup: (event: KeyboardEvent) => {
			this.#publish(event.code, 0)
			this.#down.delete(event.code)

			if (this.#down.size === 0)
				this.#publish("keyboard.any", 0)
		},
	}

	#windowListeners = {
		blur: () => {
			for (const code of this.#down)
				this.#publish(code, 0)

			if (this.#down.size)
				this.#publish("keyboard.any", 0)

			this.#down.clear()
		},
	}
}

