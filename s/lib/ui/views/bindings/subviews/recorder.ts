
import {html} from "lit"
import {disposer} from "@e280/stz"
import {Content, lightView, useSignal, useUnmount} from "@e280/sly"

import keyCapSvg from "../../../icons/akar/key-cap.svg.js"
import backspaceSvg from "../../../icons/akar/backspace.svg.js"

import crossSvg from "../../../icons/akar/cross.svg.js"
import {Expression} from "../../../../input/expression.js"
import {captureKeyChord} from "../parts/capture-key-chord.js"
import {captureGamepadChord} from "../parts/capture-gamepad-chord.js"
import {capturePointerChord} from "../parts/capture-pointer-chord.js"

export const RecorderView = lightView((update: (e: Expression) => void, reset: () => void, content: Content) => {
	const $recording = useSignal<null | (() => void)>(null)

	const removeRecording = () => $recording(null)

	const startRecording = () => {
		const {dispose, schedule} = disposer()
		schedule(removeRecording)
		schedule(captureKeyChord(update, dispose))
		schedule(captureGamepadChord(update, dispose))
		schedule(capturePointerChord(update, dispose))
		$recording(dispose)
	}

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
				class=record
				theme-button=naked
				title="record a keypress"
				@click=${toggleRecording}>
				${$recording()
					? crossSvg
					: keyCapSvg}
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

