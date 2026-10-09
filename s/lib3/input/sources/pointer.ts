
import {ev} from "@e280/stz"
import {Vec2} from "@benev/math"
import {PlainSource} from "./plain.js"
import {splitAxis} from "../utils/split-axis.js"
import {mouseButton} from "../utils/mouse-button.js"

export class PointerSource extends PlainSource {
	client = new Vec2()

	constructor(target: EventTarget = window) {
		super()
		this.dispose.schedule(
			ev(target, this.#listeners)
		)
	}

	#publishSticky(code: string, value: number) {
		this.onSample.publish({code, value, mode: "sticky"})
	}

	#publishPulse(code: string, value: number) {
		this.onSample.publish({code, value, mode: "pulse"})
	}

	#listeners = {
		pointerdown: (event: PointerEvent) => {
			this.#publishSticky(mouseButton(event.button), 1)
		},

		pointerup: (event: PointerEvent) => {
			this.#publishSticky(mouseButton(event.button), 0)
		},

		pointermove: (event: PointerEvent) => {
			this.client.set_(event.clientX, event.clientY)

			const [right, left] = splitAxis(event.movementX)
			const [down, up] = splitAxis(event.movementY)

			if (left) this.#publishPulse("pointer.move.left", left)
			if (right) this.#publishPulse("pointer.move.right", right)
			if (up) this.#publishPulse("pointer.move.up", up)
			if (down) this.#publishPulse("pointer.move.down", down)
		},

		wheel: (event: WheelEvent) => {
			const [right, left] = splitAxis(event.deltaX)
			const [down, up] = splitAxis(event.deltaY)

			if (left) this.#publishPulse("pointer.wheel.left", left)
			if (right) this.#publishPulse("pointer.wheel.right", right)
			if (up) this.#publishPulse("pointer.wheel.up", up)
			if (down) this.#publishPulse("pointer.wheel.down", down)
		},
	}
}

