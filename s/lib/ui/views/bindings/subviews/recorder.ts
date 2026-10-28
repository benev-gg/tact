
import {html} from "lit"
import {Content, lightView, useSignal, useUnmount} from "@e280/sly"

import keyCapSvg from "../../../icons/akar/key-cap.svg.js"
import {Expression} from "../../../../input/expression.js"
import {captureKeyChord} from "../parts/capture-key-chord.js"
import backspaceSvg from "../../../icons/akar/backspace.svg.js"

export const RecorderView = lightView((update: (e: Expression) => void, reset: () => void, content: Content) => {
	const $recording = useSignal<null | (() => void)>(null)

	const removeRecording = () => $recording(null)
	const startRecording = () => $recording(captureKeyChord(update, removeRecording))
	const haltRecording = () => {
		$recording()?.()
		removeRecording()
	}

	function toggleRecording() {
		if ($recording()) haltRecording()
		else startRecording()
	}

	function haltAndReset() {
		haltRecording()
		reset()
	}

	useUnmount(haltRecording)

	return html`
		<div class=recorder ?data-recording="${!!$recording()}">
			${content}

			<button
				theme-button=naked
				title="record a keypress"
				@click=${toggleRecording}>
				${keyCapSvg}
			</button>

			<button
				theme-button=naked
				title="reset to default"
				@click=${haltAndReset}>
				${backspaceSvg}
			</button>
		</div>
	`
})

