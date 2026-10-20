
import {disposer, ev} from "@e280/stz"
import {SamplerDevice} from "./sampler.js"

export class KeyboardDevice extends SamplerDevice {
	dispose = disposer()

	constructor(target: EventTarget = window) {
		super()
		this.dispose.schedule(ev(target, this.#targetListeners))
		this.dispose.schedule(ev(window, this.#windowListeners))
	}

	#targetListeners = {
		keydown: (event: KeyboardEvent) => {
			if (event.repeat) return null
			this.setSample(event.code, 1)
			this.setSample("keyboard.any", 1)
		},
		keyup: (event: KeyboardEvent) => {
			if (event.repeat) return null
			this.setSample(event.code, 0)
			this.setSample("keyboard.any", 0)
		},
	}

	#windowListeners = {
		blur: () => {
			this.zero()
		},
	}
}

