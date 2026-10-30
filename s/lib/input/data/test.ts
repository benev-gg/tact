
import {hex} from "@e280/stz"
import {expect, suite, test} from "@e280/science"

import {Parcel} from "./parcel/types.js"
import {encodeParcels} from "./parcel/encode.js"
import {decodeParcels} from "./parcel/decode.js"

export default suite({
	parcel: suite({
		"roundtrip": test(async() => {
			const dataA = hex.random(16)
			const dataB = hex.random(32)
			const parcels = [
				{playerId: 0, intents: hex.toBytes(dataA).buffer},
				{playerId: 1, intents: hex.toBytes(dataB).buffer},
			] as Parcel[]
			expect(decodeParcels(encodeParcels(parcels)))
				.deep(parcels)
		}),
	}),
})

