
import {ev} from "@e280/stz"
import {Vec2} from "@benev/math"
import {PlainSource} from "./plain.js"
import {mouseButton} from "../utils/mouse-button.js"

export const allowDuringPointerLock = () => document.pointerLockElement !== null

export class PointerSource extends PlainSource {
	allow = () => true
	client = new Vec2()

	constructor(target: EventTarget = window) {
		super()
		this.dispose.schedule(
			ev(target, this.#listeners)
		)
	}

	#listeners = {
		pointerdown: (event: PointerEvent) => {
			if (!this.allow()) return
			this.onSample.publish({code: mouseButton(event.button), value: 1})
		},

		pointerup: (event: PointerEvent) => {
			if (!this.allow()) return
			this.onSample.publish({code: mouseButton(event.button), value: 0})
		},

		pointermove: ({clientX, clientY, movementX, movementY}: PointerEvent) => {
			if (!this.allow()) return
			this.client.set_(clientX, clientY)
			if (movementX) this.onSample.publish({code: "pointer.x", value: movementX})
			if (movementY) this.onSample.publish({code: "pointer.y", value: movementY})
		},

		wheel: ({deltaX, deltaY}: WheelEvent) => {
			if (!this.allow()) return
			if (deltaX) this.onSample.publish({code: "pointer.wheel.x", value: deltaX})
			if (deltaY) this.onSample.publish({code: "pointer.wheel.y", value: deltaY})
		},
	}
}

