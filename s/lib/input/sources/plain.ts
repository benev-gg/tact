
import {disposer, subby} from "@e280/stz"
import {Sample, Source} from "../types.js"

export class PlainSource implements Source {
	onSample = subby<[sample: Sample]>()
	dispose = disposer()
}

