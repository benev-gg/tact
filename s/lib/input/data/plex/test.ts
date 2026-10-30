
import {hex} from "@e280/stz"
import {expect, suite, test} from "@e280/science"

import {Plex} from "./types.js"
import {encodePlex} from "./encode.js"
import {decodePlex} from "./decode.js"

export default suite({
	"roundtrip": test(async() => {
		const dataA = hex.random(16)
		const dataB = hex.random(32)
		const plex = [
			[0, hex.toBytes(dataA).buffer],
			[1, hex.toBytes(dataB).buffer],
		] as Plex[]
		expect(decodePlex(encodePlex(plex)))
			.deep(plex)
	}),
})

