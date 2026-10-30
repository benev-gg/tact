
import {Parcel} from "./types.js"
import {endian} from "../endian.js"

export function encodeParcel(parcels: Parcel[]): ArrayBuffer {
	const sizeHeader = 8
	const size = parcels.reduce(
		(total, {intents}) => total + sizeHeader + intents.byteLength,
		0,
	)

	const buffer = new ArrayBuffer(size)
	const view = new DataView(buffer)
	const bytes = new Uint8Array(buffer)
	let cursor = 0

	for (const {portId, intents} of parcels) {
		view.setUint32(cursor, portId, endian)
		cursor += 4

		view.setUint32(cursor, intents.byteLength, endian)
		cursor += 4

		bytes.set(new Uint8Array(intents), cursor)
		cursor += intents.byteLength
	}

	return buffer
}

