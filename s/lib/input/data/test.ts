
import {hex} from "@e280/stz"
import {expect, suite, test} from "@e280/science"

import {Parcel} from "./parcel/types.js"
import {encodeParcel} from "./parcel/encode.js"
import {decodeParcel} from "./parcel/decode.js"

export default suite({
	parcel: suite({
		"roundtrip": test(async() => {
			const dataA = hex.random(16)
			const dataB = hex.random(32)
			const parcels = [
				{portId: 0, intents: hex.toBytes(dataA).buffer},
				{portId: 1, intents: hex.toBytes(dataB).buffer},
			] as Parcel[]
			expect(decodeParcel(encodeParcel(parcels)))
				.deep(parcels)
		}),
	}),
})

