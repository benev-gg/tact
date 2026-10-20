
import {ev} from "@e280/stz"
import {Pad} from "./pad.js"
import {evergreen} from "../../utils/evergreen.js"

/** listen for gamepads coming and going */
export function onPad(fn: (pad: Pad) => () => void) {
	const known = new Map<number, {pad: Pad, dispose: () => void}>()

	function refresh() {
		addNew()
		deleteOld()
	}

	function addNew() {
		for (const gamepad of navigator.getGamepads()) {
			if (gamepad?.connected && !known.has(gamepad.index)) {
				const get = () => navigator.getGamepads()[gamepad.index]
				const pad = new Pad(evergreen(gamepad, get))
				const dispose = fn(pad)
				known.set(gamepad.index, {pad, dispose})
			}
		}
	}

	function deleteOld() {
		for (const [index, {pad, dispose}] of known) {
			const gamepad = navigator.getGamepads()[pad.gamepad.index]
			if (!gamepad?.connected) {
				dispose()
				known.delete(index)
			}
		}
	}

	refresh()

	const unlisten = ev(window, {
		gamepadconnected: refresh,
		gamepaddisconnected: refresh,
	})

	return () => {
		unlisten()
		for (const {dispose} of known.values())
			dispose()
		known.clear()
	}
}

