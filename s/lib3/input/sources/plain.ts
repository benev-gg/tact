
import {sub} from "@e280/stz"
import {Sample, Source} from "../types.js"

export class PlainSource implements Source {
	onSample = sub<[sample: Sample]>()
	dispose = () => {}
}

