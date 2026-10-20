
import {Expression} from "../types.js"
import {Clock} from "./utils/clock.js"

export class EvaluationContext {
	phase: "samples" | "holdy" | "dt" = "samples"
	clock = new Clock()
	dt = 0
	sampleValues = new Map<string, number>()
	holding = new WeakMap<object, {start: number}>()
	tapping = new WeakMap<object, {previous: number, events: number[]}>()
	holdyRoots = new Set<Expression>()
	dtRoots = new Set<Expression>()
}

