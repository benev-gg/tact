
import {html} from "lit"
import {Content} from "@e280/sly"
import {Labels} from "../../../deck/types.js"
import {Bindings} from "../../../../input/types.js"
import {RecorderView} from "../subviews/recorder.js"
import {ExpressionView} from "../subviews/expression.js"
import {isExpression} from "../../../../input/investigate/is-expression.js"

export function renderBindings(
		isReadonly: boolean,
		bindings: Bindings,
		original: Bindings,
		labels: Labels | undefined,
		update: (b: Bindings) => void,
		path: string[],
	): Content {

	if (isExpression(bindings))
		return ExpressionView(isReadonly, bindings, update)

	return Object.entries(bindings).map(([key, child]) => (
		isExpression(child)
			? renderExpression(isReadonly, bindings, original as any, labels, update, [...path, key])
			: renderGroup(isReadonly, bindings, original as any, labels, update, [...path, key])
	))
}

function renderGroup(
		isReadonly: boolean,
		bindings: Record<string, Bindings>,
		original: Record<string, Bindings>,
		labels: Labels | undefined,
		update: (b: Bindings) => void,
		path: string[],
	) {

	const key = path.at(-1)!
	const label = (labels && labels[path.join(".")]) ?? key

	return html`
		<details class=group open>
			<summary>${label}</summary>
			<div class=children>
				${renderBindings(
					isReadonly,
					bindings[key],
					original[key],
					labels,
					fresh => update({...bindings, [key]: fresh}),
					path,
				)}
			</div>
		</details>
	`
}

function renderExpression(
		isReadonly: boolean,
		bindings: Record<string, Bindings>,
		original: Record<string, Bindings>,
		labels: Labels | undefined,
		update: (b: Bindings) => void,
		path: string[],
	) {

	const key = path.at(-1)!
	const label = (labels && labels[path.join(".")]) ?? key
	const update2 = (fresh: Bindings) => update({...bindings, [key]: fresh})
	const reset = () => update2(original[key])

	return html`
		<div class=expression>
			<strong>${label}</strong>
			${RecorderView(isReadonly, update2, reset, renderBindings(
				isReadonly,
				bindings[key],
				original[key],
				labels,
				update2,
				path,
			))}
		</div>
	`
}

