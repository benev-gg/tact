
import {Pad} from "./pad/pad.js"
import {SamplerDevice} from "./sampler.js"
import {splitAxis} from "../utils/split-axis.js"

export class GamepadDevice extends SamplerDevice {
	constructor(public pad: Pad) {
		super()
	}

	get gamepad() {
		return this.pad.gamepad
	}

	*samples() {
		this.#pollButtons(this.pad.gamepad)
		this.#pollSticks(this.pad.gamepad)
		yield* super.samples()
	}

	#pollButtons(gamepad: Gamepad) {
		let anyButtonValue = 0
		for (const [index, button] of gamepad.buttons.entries()) {
			const i = index + 1
			const value = button.value
			anyButtonValue = Math.max(anyButtonValue, value)
			this.setSample(`gamepad.button.${i}`, value)
		}
		this.setSample("gamepad.button.any", anyButtonValue)
	}

	#pollSticks(gamepad: Gamepad) {
		for (const [index, axis] of gamepad.axes.entries()) {
			const i = index + 1
			this.setSample(`gamepad.axis.${i}`, axis)
			const [neg, pos] = splitAxis(axis)
			this.setSample(`gamepad.axis.${i}.neg`, neg)
			this.setSample(`gamepad.axis.${i}.pos`, pos)
		}
	}
}

