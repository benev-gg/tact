
import {Expression} from "../types.js"
import {Clock} from "./utils/clock.js"

export class EvaluationContext {
	sampleValues = new Map<string, number>()
	clock = new Clock()
	holding = new WeakMap<object, {start: number}>()
	tapping = new WeakMap<object, {previous: number, events: number[]}>()
	holdyRoots = new Set<Expression>()
}

