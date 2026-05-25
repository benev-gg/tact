
import {html} from "lit"
import {cycle, nap} from "@e280/stz"
import {RMap, RSet} from "@e280/strata"
import {shadowElement, useCss, useMount, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import {onPad} from "../../device/pad/on-pad.js"
import {GamepadDevice} from "../../device/gamepad.js"

export const GamepadApp = shadowElement(() => {
	useCss(styleCss)

	const connected = useOnce(() => new RSet<{
		device: GamepadDevice
		samples: RMap<string, number>
	}>())

	useMount(() => onPad(pad => {
		const device = new GamepadDevice(pad)
		const connectee = {device, samples: new RMap<string, number>()}
		connected.add(connectee)
		return () => connected.delete(connectee)
	}))

	useMount(() => cycle(async() => {
		for (const conn of connected) {
			for (const [code, value] of conn.device.samples())
				conn.samples.set(code, value)
		}
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
			${connected.size > 0 ? [...connected].map(({samples, device: {gamepad}}) => html`
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

