
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

	set({x, y}: Xy) {
		this.vector.set_(x, y)

		this.onSample.publish({code: `${this.channel}.x`, value: x})
		this.onSample.publish({code: `${this.channel}.y`, value: y})

		const {up, down, left, right} = splitVector(this.vector)
		this.onSample.publish({code: `${this.channel}.up`, value: up})
		this.onSample.publish({code: `${this.channel}.down`, value: down})
		this.onSample.publish({code: `${this.channel}.left`, value: left})
		this.onSample.publish({code: `${this.channel}.right`, value: right})

		return this
	}
}

