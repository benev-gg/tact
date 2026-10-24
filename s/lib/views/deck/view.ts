
import {html} from "lit"
import {given, when} from "@e280/stz"
import {lightView, shadowDuplex, useCss} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import {Deck} from "../../deck/types.js"
import {Controller} from "../../input/controller.js"

export const [DeckView, makeDeck] = shadowDuplex((options: {deck: Deck, maxPorts: number}) => {
	useCss(themeCss, styleCss)

	const {deck, maxPorts} = options
	const {hub} = deck
	const controllers = hub.controllers
	const renderPort = (p: number, i: number) => PortView(deck, p, i)
	const renderController = (c: Controller, i: number) => ControllerView(deck, c, i)
	const clickCreatePort = () => deck.hub.createPort()

	return html`
		<div class=deck>
			<div class=ports>
				${hub.portIds.map(renderPort)}

				<div class="card unassigned">
					<h3>unassigned</h3>
					<div class=inset>
						${controllers.unassigned.map(renderController)}
						<div class=dropzone></div>
					</div>
				</div>
			</div>

			${when(hub.portIds.length < maxPorts, () => html`
				<button @click="${clickCreatePort}">new port</button>
			`)}
		</div>
	`
})

const PortView = lightView((deck: Deck, portId: number, index: number) => {
	const {hub} = deck
	const deletePort = () => hub.deletePort(portId)
	const renderController = (c: Controller, i: number) => ControllerView(deck, c, i)
	const controllers = hub.controllers.assigned.get(portId) ?? []

	return html`
		<div class="port card">
			<h3>
				<span>port ${index + 1}</span>
				${when(hub.portIds.length > 1, () => html`
					<button @click=${deletePort}>delete</button>
				`)}
			</h3>
			<div class=inset>
				${controllers.map(renderController)}
				<div class=dropzone></div>
			</div>
		</div>
	`
})

const ControllerView = lightView((deck: Deck, controller: Controller, index: number) => {
	const currentProfileKey = deck.profiles.query(controller)

	return html`
		<div class=controller>
			<div class=griptape></div>
			<div class=content>
				<h4>controller ${index + 1}</h4>
				${given(controller.handle, handle => html`
					<p>${handle}</p>
				`)}
				<select>
					${Array.from(deck.profiles.all()).map(([key, profile]) => html`
						<option ?selected="${key === currentProfileKey}">
							${profile.label}
						</option>
					`)}
				</select>
			</div>
		</div>
	`
})

