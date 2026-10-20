
import {Vec2, Xy} from "@benev/math"
import {Sample} from "../types.js"
import {PlainSource} from "./plain.js"
import {splitAxis} from "../utils/split-axis.js"

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

		const [xPos, xNeg] = splitAxis(x)
		this.onSample.publish({code: `${this.channel}.x.pos`, value: xPos})
		this.onSample.publish({code: `${this.channel}.x.neg`, value: xNeg})

		const [yPos, yNeg] = splitAxis(y)
		this.onSample.publish({code: `${this.channel}.y.pos`, value: yPos})
		this.onSample.publish({code: `${this.channel}.y.neg`, value: yNeg})

		return this
	}
}

