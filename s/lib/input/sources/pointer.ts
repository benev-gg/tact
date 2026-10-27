
import {ev} from "@e280/stz"
import {Vec2} from "@benev/math"
import {PlainSource} from "./plain.js"
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

		pointermove: ({clientX, clientY, movementX, movementY}: PointerEvent) => {
			this.client.set_(clientX, clientY)
			if (movementX) this.onSample.publish({code: "pointer.x", value: movementX})
			if (movementY) this.onSample.publish({code: "pointer.y", value: movementY})
		},

		wheel: ({deltaX, deltaY}: WheelEvent) => {
			if (deltaX) this.onSample.publish({code: "pointer.wheel.x", value: deltaX})
			if (deltaY) this.onSample.publish({code: "pointer.wheel.y", value: deltaY})
		},
	}
}

