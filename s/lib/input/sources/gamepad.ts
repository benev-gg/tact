
import {PlainSource} from "./plain.js"
import {Pad} from "../utils/pad/pad.js"

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
			this.onSample.publish({code, value})
		}
	}

	#pollButtons(gamepad: Gamepad) {
		let any = 0

		for (const [index, button] of gamepad.buttons.entries()) {
			const value = button.value
			this.#publish(`gamepad.${index + 1}`, value)
			any = Math.max(any, value)
		}

		this.#publish("gamepad.any", any >= 0.9 ? 1 : 0)
	}

	#pollAxes(gamepad: Gamepad) {
		for (const [index, value] of gamepad.axes.entries()) {
			this.#publish(`gamepad.axis.${index + 1}`, value)
		}
	}
}

