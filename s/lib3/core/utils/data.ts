
const endian = false
const sizeHash = 4
const sizeId = 2
const sizeValue = 4
const sizeIntention = sizeId + sizeValue

export type Intent = {id: number, value: number}

export function encodeData(hash: number, intents: Intent[]) {
	const byteCount = sizeHash + (intents.length * sizeIntention)
	const buffer = new ArrayBuffer(byteCount)
	const dv = new DataView(buffer)
	let cursor = 0

	dv.setUint32(cursor, hash, endian)
	cursor += sizeHash

	for (const intention of intents) {
		dv.setUint16(cursor, intention.id, endian)
		cursor += sizeId

		dv.setFloat32(cursor, intention.value, endian)
		cursor += sizeValue
	}

	return buffer
}

export function decodeData(buffer: ArrayBuffer) {
	const intents: Intent[] = []
	const dv = new DataView(buffer)
	let cursor = 0

	const hash = dv.getUint32(cursor, endian)
	cursor += sizeHash

	while (cursor < buffer.byteLength) {
		const id = dv.getUint16(cursor, endian)
		cursor += sizeId

		const value = dv.getFloat32(cursor, endian)
		cursor += sizeValue

		intents.push({id, value})
	}

	return {hash, intents}
}

