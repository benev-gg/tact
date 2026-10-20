
import {html} from "lit"
import {cycle, nap} from "@e280/stz"
import {RMap, RSet} from "@e280/strata"
import {shadowElement, useCss, useMount, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"

import {onPad} from "../../lib/input/utils/pad/on-pad.js"
import {GamepadSource} from "../../lib/input/sources/gamepad.js"

export const GamepadApp = shadowElement(() => {
	useCss(styleCss)

	const connected = useOnce(() => new RSet<{
		source: GamepadSource
		samples: RMap<string, number>
	}>())

	useMount(() => onPad(pad => {
		const source = new GamepadSource(pad)
		const connectee = {source, samples: new RMap<string, number>()}
		const stop = source.onSample(sample => connectee.samples.set(sample.code, sample.value))
		connected.add(connectee)
		return () => {
			stop()
			connected.delete(connectee)
		}
	}))

	useMount(() => cycle(async() => {
		for (const conn of connected)
			conn.source.poll()
		await nap(1000 / 60)
	}))

	const renderSample = ([code, value]: [string, number]) => html`
		<li style="${`--percent: ${value * 100}%;`}">
			<span>${code}</span>
			<span>${value.toFixed(3)}</span>
		</li>
	`

	return html`
		<div class=plate>
			${connected.size > 0 ? [...connected].map(({samples, source: {gamepad}}) => html`
				<div class=device>
					<h2>🎮 ${gamepad.id}</h2>
					<div class=stats>
						<span>index ${gamepad.index}</span>
						<span>connected ${gamepad.connected ? "yes" : "no"}</span>
						<span>mapping ${gamepad.mapping}</span>
						<span>vibrationActuator ${gamepad.vibrationActuator ? "yes" : "no"}</span>
					</div>
					<ul>
						${[...samples].filter(([code]) => code.startsWith("gamepad.button")).map(renderSample)}
					</ul>
					<ul>
						${[...samples].filter(([code]) => code.startsWith("gamepad.axis")).map(renderSample)}
					</ul>
				</div>
			`) : html`
				<h2>no gamepads detected :(</h2>
			`}
		</div>
	`
})

