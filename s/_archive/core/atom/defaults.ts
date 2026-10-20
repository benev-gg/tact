
import {Code, CodeSettings, CodeState} from "./types.js"

export const defaultHoldTime = 250

export function defaultCodeState([,,settings]: Code, now: number): CodeState {
	return {
		lastValue: 0,
		holdStart: now,
		settings: defaultifyCodeSettings(settings),
	}
}

function defaultCodeSettings(): CodeSettings {
	return {
		scale: 1,
		invert: false,
		clamp: null,
		range: null,
		bottom: null,
		top: null,
		timing: ["direct"],
	}
}

function defaultifyCodeSettings(partial: Partial<CodeSettings> = {}): CodeSettings {
	return {
		...defaultCodeSettings(),
		...partial,
	}
}

