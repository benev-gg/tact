
import {html} from "lit"
import {ev} from "@e280/stz"
import {lightView, useSignal} from "@e280/sly"

import keyCapSvg from "../../../icons/akar/key-cap.svg.js"

import {Expression} from "../../../../input/expression.js"

function captureNextKey(update: (code: Expression) => void, onDone: () => void) {
	const stop = ev(window, {
		keydown: (event: KeyboardEvent) => {
			event.preventDefault()
			update(event.code)
			halt()
		},
	})
	const halt = () => {
		stop()
		onDone()
	}
	return halt
}

export const StringView = lightView((expression: string, update: (e: Expression) => void) => {
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
		<div class=string ?data-recording="${!!$recording()}">
			<input type=text .value="${expression}" @change="${(event: Event) => {
				const input = event.currentTarget as HTMLInputElement
				const value = input.value
				update(value)
			}}"/>

			<button theme-button @click=${toggleRecording}>
				${keyCapSvg}
			</button>
		</div>
	`
})

