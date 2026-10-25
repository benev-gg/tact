
import {html} from "lit"
import {when} from "@e280/stz"
import {lightView} from "@e280/sly"

import trashCanSvg from "../../../icons/akar/trash-can.svg.js"

import {CardView} from "./card.js"
import {Context} from "../../deck/types.js"

export const PortView = lightView((context: Context, portId: number, index: number) => {
	const {hub} = context.deck
	const deletePort = () => hub.deletePort(portId)
	const controllers = hub.controllers.assigned.get(portId) ?? []

	return CardView({
		context,
		portId,
		controllers,
		class: "port",
		heading: html`
			<span>🟢 port ${index + 1}</span>
			${when(hub.portIds.length > 1, () => html`
				<button theme-button="naked angry" @click=${deletePort}>
					${trashCanSvg}
				</button>
			`)}
		`,
	})
})

