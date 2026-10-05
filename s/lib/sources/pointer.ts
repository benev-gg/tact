
import {Vec2} from "@benev/math"
import {disposer, ev, sub} from "@e280/stz"
import {Sample, Source} from "../types.js"
import {splitAxis} from "../utils/split-axis.js"
import {mouseButton} from "../utils/mouse-button.js"

export class PointerSource implements Source {
	dispose = disposer()
	onSample = sub<[Sample]>()
	client = new Vec2()

	constructor(target: EventTarget = window) {
		this.dispose.schedule(
			ev(target, this.#listeners)
		)
	}

	#publish(code: string, value: number) {
		const time = performance.now()
		this.onSample.publish([time, code, value])
	}

	#listeners = {
		pointerdown: (event: PointerEvent) => {
			this.#publish(mouseButton(event.button), 1)
		},

		pointerup: (event: PointerEvent) => {
			this.#publish(mouseButton(event.button), 0)
		},

		pointermove: (event: PointerEvent) => {
			this.client.set_(event.clientX, event.clientY)

			const [right, left] = splitAxis(event.movementX)
			const [down, up] = splitAxis(event.movementY)

			if (left) this.#publish("pointer.move.left", left)
			if (right) this.#publish("pointer.move.right", right)
			if (up) this.#publish("pointer.move.up", up)
			if (down) this.#publish("pointer.move.down", down)
		},

		wheel: (event: WheelEvent) => {
			const [right, left] = splitAxis(event.deltaX)
			const [down, up] = splitAxis(event.deltaY)

			if (left) this.#publish("pointer.wheel.left", left)
			if (right) this.#publish("pointer.wheel.right", right)
			if (up) this.#publish("pointer.wheel.up", up)
			if (down) this.#publish("pointer.wheel.down", down)
		},
	}
}

