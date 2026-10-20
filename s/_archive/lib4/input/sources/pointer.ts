
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

	#listeners = {
		pointerdown: (event: PointerEvent) => {
			this.onSample.publish({code: mouseButton(event.button), value: 1})
		},

		pointerup: (event: PointerEvent) => {
			this.onSample.publish({code: mouseButton(event.button), value: 0})
		},

		pointermove: (event: PointerEvent) => {
			this.client.set_(event.clientX, event.clientY)

			const [right, left] = splitAxis(event.movementX)
			const [down, up] = splitAxis(event.movementY)

			if (left) this.onSample.publish({code: "pointer.move.left", value: left})
			if (right) this.onSample.publish({code: "pointer.move.right", value: right})
			if (up) this.onSample.publish({code: "pointer.move.up", value: up})
			if (down) this.onSample.publish({code: "pointer.move.down", value: down})
		},

		wheel: (event: WheelEvent) => {
			const [right, left] = splitAxis(event.deltaX)
			const [down, up] = splitAxis(event.deltaY)

			if (left) this.onSample.publish({code: "pointer.wheel.left", value: left})
			if (right) this.onSample.publish({code: "pointer.wheel.right", value: right})
			if (up) this.onSample.publish({code: "pointer.wheel.up", value: up})
			if (down) this.onSample.publish({code: "pointer.wheel.down", value: down})
		},
	}
}

