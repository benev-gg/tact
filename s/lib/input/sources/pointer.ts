
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

		pointermove: ({clientX, clientY, movementX, movementY}: PointerEvent) => {
			this.client.set_(clientX, clientY)

			const [xPos, xNeg] = splitAxis(movementX)
			const [yPos, yNeg] = splitAxis(movementY)

			if (movementX) this.onSample.publish({code: "pointer.x", value: movementX})
			if (xPos) this.onSample.publish({code: "pointer.x.pos", value: xPos})
			if (xNeg) this.onSample.publish({code: "pointer.x.neg", value: xNeg})

			if (movementY) this.onSample.publish({code: "pointer.y", value: movementY})
			if (yPos) this.onSample.publish({code: "pointer.y.pos", value: yPos})
			if (yNeg) this.onSample.publish({code: "pointer.y.neg", value: yNeg})
		},

		wheel: ({deltaX, deltaY}: WheelEvent) => {
			const [xPos, xNeg] = splitAxis(deltaX)
			const [yPos, yNeg] = splitAxis(deltaY)

			if (deltaX) this.onSample.publish({code: "pointer.wheel.x", value: deltaX})
			if (xPos) this.onSample.publish({code: "pointer.wheel.x.pos", value: xPos})
			if (xNeg) this.onSample.publish({code: "pointer.wheel.x.neg", value: xNeg})

			if (deltaY) this.onSample.publish({code: "pointer.wheel.y", value: deltaY})
			if (yPos) this.onSample.publish({code: "pointer.wheel.y.pos", value: yPos})
			if (yNeg) this.onSample.publish({code: "pointer.wheel.y.neg", value: yNeg})
		},
	}
}

