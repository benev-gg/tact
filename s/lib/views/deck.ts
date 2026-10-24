
import {html} from "lit"

import {lightView, shadowDuplex} from "@e280/sly"
import {Deck} from "../deck/deck.js"
import {Controller} from "../input/controller.js"

export const [DeckView, makeDeck] = shadowDuplex((deck: Deck) => {
	const {hub} = deck
	const controllers = hub.controllers
	const renderPort = (p: number, i: number) => PortView(deck, p, i)
	const renderController = (c: Controller, i: number) => ControllerView(deck, c, i)

	return html`
		<div class=deck>
			<div class=ports>
				${hub.portIds.map(renderPort)}
			</div>

			<div class=unassigned>
				<p>unassigned</p>
				${controllers.unassigned.map(renderController)}
			</div>
		</div>
	`
})

const PortView = lightView((deck: Deck, portId: number, index: number) => {
	const {hub} = deck
	const deletePort = () => hub.deletePort(portId)
	const renderController = (c: Controller, i: number) => ControllerView(deck, c, i)
	const controllers = hub.controllers.assigned.get(portId) ?? []

	return html`
		<div class=port>
			<p><strong>port ${index + 1}</strong></p>
			${controllers.map(renderController)}
			${hub.portIds.length > 1 ? html`
				<button @click=${deletePort}>delete</button>
			` : null}
		</div>
	`
})

const ControllerView = lightView((deck: Deck, controller: Controller, index: number) => {
	const currentProfileKey = deck.controllerProfiles.get(controller) ?? deck.primary.profile

	return html`
		<div class=controller>
			<p>controller ${index + 1}</p>
			<select>
				${Object.entries(deck.profiles).map(([key, profile]) => html`
					<option ?selected="${key === currentProfileKey}">
						${profile.label}
					</option>
				`)}
			</select>
		</div>
	`
})

