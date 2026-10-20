
import {Vec2, Xy} from "@benev/math"
import {Sample} from "../types.js"
import {PlainSource} from "./plain.js"
import {splitVector} from "../utils/split-axis.js"

export class StickSource extends PlainSource {
	samples: Sample[] = []
	vector = Vec2.zero()

	constructor(public channel = "stick") {
		super()
	}

	set(vector: Xy) {
		this.vector.set_(vector.x, vector.y)
		const {up, down, left, right} = splitVector(this.vector)
		this.#publish(`${this.channel}.up`, up)
		this.#publish(`${this.channel}.down`, down)
		this.#publish(`${this.channel}.left`, left)
		this.#publish(`${this.channel}.right`, right)
		return this
	}

	#publish(code: string, value: number) {
		this.onSample.publish({code, value, mode: "sticky"})
	}
}

