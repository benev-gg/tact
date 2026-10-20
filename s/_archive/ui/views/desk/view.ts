
import {html} from "lit"
import {clamp} from "@benev/math"
import {Content, shadow, useCss, useName} from "@e280/sly"

import styleCss from "./style.css.js"
import {Deck} from "../../../deck/deck.js"
import {Port} from "../../../deck/port.js"
import {Controller} from "../../../deck/controller.js"

export type DeskOptions = {
	getControllerLabel?: (controller: Controller) => Content | undefined
}

export const DeskView = shadow((deck: Deck, options: DeskOptions = {}) => {
	useName("desk")
	useCss(styleCss)

	function shimmy(controller: Controller, offset: number) {
		const ports = deck.ports
		const info = deck.queryController(controller)
		const portIndex = ports.indexOf(info.port!)
		const newIndex = clamp(portIndex + offset, 0, ports.length - 1)
		const newPort = ports.at(newIndex)
		if (newPort)
			newPort.plug(controller)
	}

	function PortView(port: Port, portIndex: number) {
		return html`
			<div class=port>
				<header>
					<span>P${portIndex + 1}</span>
					<div class=buttons>
						<button @click=${() => deck.deletePort(port)}>🚫</button>
					</div>
				</header>
				<div class=controllerlist>
					${port.controllers.map(ControllerView)}
				</div>
			</div>
		`
	}

	function UnassignedView(controllers: Controller[]) {
		return html`
			<div class=port>
				<header>
					<span>unassigned</span>
				</header>
				<div class=controllerlist>
					${controllers.map(ControllerView)}
				</div>
			</div>
		`
	}


	function ControllerView(controller: Controller) {
		const {port, profileKey} = deck.queryController(controller)

		async function onChange(event: Event) {
			const element = event.currentTarget as HTMLSelectElement
			const profileKey = element.value
			await deck.assignControllerProfile(controller, profileKey)
		}

		function plugIn(controller: Controller) {
			const p1 = deck.ports.at(0) ?? deck.createPort()
			p1.plug(controller)
		}

		return html`
			<div class=controller>
				<span>${options.getControllerLabel?.(controller) ?? controller.handle}</span>

				<div class=buttons>
					<div>
						${port
							? html`
								<button @click=${() => shimmy(controller, -1)} ?disabled=${deck.ports.indexOf(port) === 0}>👈</button>
								<button @click=${() => port.unplug(controller)}>⏏️</button>
								<button @click=${() => shimmy(controller, 1)} ?disabled=${deck.ports.indexOf(port) === (deck.ports.length - 1)}>👉</button>
							`
							: html`
								<button @click=${() => plugIn(controller)}>🔌</button>
							`}
					</div>
					<select @change=${onChange}>
						${deck.profiles.all.map(([pk, profile]) => html`
							<option
								.value=${pk}
								.selected=${pk === profileKey}>
								${profile.label}
							</option>
						`)}
					</select>
				</div>
			</div>
		`
	}

	const {unassignedControllers} = deck

	return html`
		<div class=deck>
			<div>
				${deck.ports.map(PortView)}
				<div>
					<button @click=${() => deck.createPort()}>✨add port</button>
				</div>
			</div>

			<div>
				${unassignedControllers.length > 0
					? UnassignedView(unassignedControllers)
					: null}
			</div>
		</div>
	`
})

