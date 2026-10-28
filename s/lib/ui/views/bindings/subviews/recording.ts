
import {html} from "lit"
import {ev} from "@e280/stz"
import {Content, lightView, useSignal} from "@e280/sly"

import keyCapSvg from "../../../icons/akar/key-cap.svg.js"
import {Expression} from "../../../../input/expression.js"

const mod = (code: string) => {
	if (code === "ShiftLeft" || code === "ShiftRight") return "shift"
	if (code === "ControlLeft" || code === "ControlRight") return "ctrl"
	if (code === "MetaLeft" || code === "MetaRight") return "meta"
	if (code === "AltLeft" || code === "AltRight") return "alt"
	return undefined
}

function captureNextKey(update: (code: Expression) => void, onDone: () => void) {
	const held = new Set<string>()
	const seen = new Set<string>()

	const stop = ev(window, {
		keydown: (event: KeyboardEvent) => {
			event.preventDefault()
			held.add(event.code)
			seen.add(event.code)
		},
		keyup: (event: KeyboardEvent) => {
			event.preventDefault()
			held.delete(event.code)
			if (held.size === 0) {
				const codes = new Set<string>()
				const mods = new Set<string>()

				for (const code of seen) {
					const m = mod(code)
					if (m) mods.add(m)
					else codes.add(code)
				}

				if (codes.size === 0)
					update(["*", ...seen])
				else if (mods.size > 0)
					update(["*", ["mod", ...mods as any], ...codes])
				else if (seen.size > 1)
					update(["*", ...seen])
				else
					update([...seen][0]!)

				halt()
			}
		},
		blur: () => {
			halt()
		},
	})
	const halt = () => {
		stop()
		onDone()
	}
	return halt
}

export const RecordingView = lightView((update: (e: Expression) => void, content: Content) => {
	const $recording = useSignal<null | (() => void)>(null)

	const stopRecording = () => $recording(null)
	const startRecording = () => $recording(captureNextKey(update, stopRecording))

	function toggleRecording() {
		if ($recording()) {
			$recording()?.()
			stopRecording()
		}
		else startRecording()
	}

	return html`
		<div class=recordable ?data-recording="${!!$recording()}">
			${content}

			<button theme-button @click=${toggleRecording}>
				${keyCapSvg}
			</button>
		</div>
	`
})

