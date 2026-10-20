
import {Vec2} from "@benev/math"
import {derived, signal} from "@e280/strata"
import {Device, Sample} from "../core/types.js"
import {splitVector} from "../utils/split-axis.js"

export class StickDevice implements Device {
	$vector = signal(Vec2.zero())
	$breakdown = derived(() => splitVector(this.$vector()))

	constructor(public channel = "stick") {}

	samples() {
		const {channel} = this
		const {up, down, left, right} = this.$breakdown()
		return [
			[`${channel}.up`, up],
			[`${channel}.down`, down],
			[`${channel}.left`, left],
			[`${channel}.right`, right],
		] as Sample[]
	}
}

