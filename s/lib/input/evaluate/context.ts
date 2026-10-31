
import {Sample} from "../types.js"
import {Clock} from "../utils/clock.js"

export class EvaluationContext {
	dt = 0
	clock = new Clock()

	recentSamples: Sample[] = []
	latestValues = new Map<string, number>()
	previousValues = new Map<string, number>()

	holding = new Map<object, {start: number}>()
	tapping = new Map<object, {
		wasDown: boolean
		startedAt: number | null
		count: number
	}>()
}

