
import {Sample} from "../types.js"
import {Clock} from "../utils/clock.js"

export class EvaluationContext {
	dt = 0
	clock = new Clock()

	recentSamples: Sample[] = []
	latestValues = new Map<string, number>()
	previousValues = new Map<string, number>()

	accumulated = new Map<object, number>()
	holding = new WeakMap<object, {start: number}>()
	tapping = new WeakMap<object, {events: number[]}>()
}

