
import {Sample} from "../../types.js"

export class EvaluationContext {
	sample!: Sample
	since = 0
	last: number | undefined

	held = new WeakMap<object, {start: number}>()
	tapped = new WeakMap<object, {previous: number, events: number[]}>()
	accumulations = new Map<object, {value: number}>()

	start() {
		this.accumulations.clear()
	}

	update(sample: Sample) {
		this.since = sample.time - (this.last ?? sample.time)
		this.last = sample.time
	}
}

