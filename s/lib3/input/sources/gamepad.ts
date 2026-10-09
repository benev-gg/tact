
import {PlainSource} from "./plain.js"
import {Pad} from "../utils/pad/pad.js"
import {splitAxis} from "../utils/split-axis.js"

export class GamepadSource extends PlainSource {
	#values = new Map<string, number>()

	constructor(public pad: Pad) {
		super()
	}

	get gamepad() {
		return this.pad.gamepad
	}

	poll() {
		const gamepad = this.gamepad
		this.#pollButtons(gamepad)
		this.#pollAxes(gamepad)
	}

	#publish(code: string, value: number) {
		const previous = this.#values.get(code) ?? 0

		if (value !== previous) {
			this.#values.set(code, value)
			this.onSample.publish({code, value, mode: "sticky"})
		}
	}

	#pollButtons(gamepad: Gamepad) {
		let any = 0

		for (const [index, button] of gamepad.buttons.entries()) {
			const value = button.value
			const i = index + 1

			this.#publish(`gamepad.button.${i}`, value)

			any = Math.max(any, value)
		}

		this.#publish("gamepad.button.any", any)
	}

	#pollAxes(gamepad: Gamepad) {
		for (const [index, value] of gamepad.axes.entries()) {
			const i = index + 1
			const [neg, pos] = splitAxis(value)

			this.#publish(`gamepad.axis.${i}`, value)
			this.#publish(`gamepad.axis.${i}.neg`, neg)
			this.#publish(`gamepad.axis.${i}.pos`, pos)
		}
	}
}

