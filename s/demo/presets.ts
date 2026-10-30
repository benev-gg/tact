
import {asBindings} from "../lib/input/types.js"
import {asPresets} from "../lib/ui/deck/types.js"

export const bindings = asBindings({
	looking: {
		horizontal: ["accumulate", "pointer.x"],
		vertical: ["accumulate", "pointer.y"],
	},
	moving: {
		forward: "KeyW",
		backward: "KeyS",
		leftward: "KeyA",
		rightward: "KeyD",
	},
	interactions: {
		use: "KeyE",
	},
})

export const presets = asPresets<typeof bindings>({
	standard: {label: "⌨️standard", bindings},
	gamer: {label: "🎮gamer", bindings: {
		looking: {
			horizontal: ["*", ["dt"], "gamepad.axis.3", 100],
			vertical: ["*", ["dt"], "gamepad.axis.4", 100],
		},
		moving: {
			forward: ["remap", 0, -1, 0, 1, "gamepad.axis.2"],
			backward: ["remap", 0, 1, 0, 1, "gamepad.axis.2"],
			leftward: ["remap", 0, -1, 0, 1, "gamepad.axis.1"],
			rightward: ["remap", 0, 1, 0, 1, "gamepad.axis.1"],
		},
		interactions: {
			use: "gamepad.1",
		},
	}},
	micro: {label: "🦠micro", bindings: {
		looking: {
			horizontal: ["*", ["dt"], ["+", "gamepad.1", ["-", "gamepad.4"]], 100],
			vertical: ["*", ["dt"], ["+", "gamepad.2", ["-", "gamepad.3"]], 100],
		},
		moving: {
			forward: ["remap", 0, -1, 0, 1, "gamepad.axis.2"],
			backward: ["remap", 0, 1, 0, 1, "gamepad.axis.2"],
			leftward: ["remap", 0, -1, 0, 1, "gamepad.axis.1"],
			rightward: ["remap", 0, 1, 0, 1, "gamepad.axis.1"],
		},
		interactions: {
			use: ["*", "gamepad.5", "gamepad.6"],
		},
	}},
})

