
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

			if (event.movementX) this.onSample.publish({code: "pointer.x", value: event.movementX})
			if (event.movementY) this.onSample.publish({code: "pointer.y", value: event.movementY})

			if (left) this.onSample.publish({code: "pointer.x.pos", value: left})
			if (right) this.onSample.publish({code: "pointer.x.neg", value: right})
			if (up) this.onSample.publish({code: "pointer.y.pos", value: up})
			if (down) this.onSample.publish({code: "pointer.y.neg", value: down})
		},

		wheel: (event: WheelEvent) => {
			const [right, left] = splitAxis(event.deltaX)
			const [down, up] = splitAxis(event.deltaY)

			if (event.deltaX) this.onSample.publish({code: "pointer.wheel.x", value: event.deltaX})
			if (left) this.onSample.publish({code: "pointer.wheel.x.pos", value: left})
			if (right) this.onSample.publish({code: "pointer.wheel.x.neg", value: right})

			if (event.deltaY) this.onSample.publish({code: "pointer.wheel.y", value: event.deltaY})
			if (up) this.onSample.publish({code: "pointer.wheel.y.pos", value: up})
			if (down) this.onSample.publish({code: "pointer.wheel.y.neg", value: down})
		},
	}
}

