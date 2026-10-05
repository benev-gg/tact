
import {sub} from "@e280/stz"
import {Pad} from "../utils/pad/pad.js"
import {Sample, Source} from "../types.js"
import {splitAxis} from "../utils/split-axis.js"

export class GamepadSource implements Source {
	onSample = sub<[Sample]>()
	#values = new Map<string, number>()

	constructor(public pad: Pad) {}

	get gamepad() {
		return this.pad.gamepad
	}

	poll() {
		const time = performance.now()
		const gamepad = this.gamepad

		this.#pollButtons(time, gamepad)
		this.#pollAxes(time, gamepad)
	}

	#publish(time: number, code: string, value: number) {
		const previous = this.#values.get(code) ?? 0

		if (value !== previous) {
			this.#values.set(code, value)
			this.onSample.publish([time, code, value])
		}
	}

	#pollButtons(time: number, gamepad: Gamepad) {
		let any = 0

		for (const [index, button] of gamepad.buttons.entries()) {
			const value = button.value
			const i = index + 1

			this.#publish(time, `gamepad.button.${i}`, value)

			any = Math.max(any, value)
		}

		this.#publish(time, "gamepad.button.any", any)
	}

	#pollAxes(time: number, gamepad: Gamepad) {
		for (const [index, value] of gamepad.axes.entries()) {
			const i = index + 1
			const [neg, pos] = splitAxis(value)

			this.#publish(time, `gamepad.axis.${i}`, value)
			this.#publish(time, `gamepad.axis.${i}.neg`, neg)
			this.#publish(time, `gamepad.axis.${i}.pos`, pos)
		}
	}
}

