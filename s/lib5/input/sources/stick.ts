
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
		this.onSample.publish({code: `${this.channel}.up`, value: up})
		this.onSample.publish({code: `${this.channel}.down`, value: down})
		this.onSample.publish({code: `${this.channel}.left`, value: left})
		this.onSample.publish({code: `${this.channel}.right`, value: right})
		return this
	}
}

