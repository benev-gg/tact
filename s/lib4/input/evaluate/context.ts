
import {Clock} from "./utils/clock.js"
import {RootExpression, Sample} from "../types.js"

export class EvaluationContext {
	// phase: "samples" | "holdy" | "dt" = "samples"
	dt = 0
	clock = new Clock()
	currentSample: Sample | undefined
	sampleValues = new Map<string, number>()
	holding = new WeakMap<object, {start: number}>()
	tapping = new WeakMap<object, {previous: number, events: number[]}>()
	holdyRoots = new Set<RootExpression>()
	dtRoots = new Set<RootExpression>()
}

