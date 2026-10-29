
import {html} from "lit"
import {Content, lightView} from "@e280/sly"
import {Context, DroppyPort} from "../../deck/types.js"

export const DropcardView = lightView((o: {
		class: string
		themeCard?: string
		context: Context
		portId: DroppyPort["portId"]
		content: Content
	}) => {

	const {dnd} = o.context
	const dropzone = dnd.dropzone(() => ({portId: o.portId}))

	return html`
		<div class="${o.class}"
			theme-card="${o.themeCard ?? ""}"
			data-drop-candidate
			?data-dropping="${dnd.hovering?.portId === o.portId}"
			@dragenter="${dropzone.dragenter}"
			@dragleave="${dropzone.dragleave}"
			@dragover="${dropzone.dragover}"
			@drop="${dropzone.drop}">

			${o.content}
		</div>
	`
})

