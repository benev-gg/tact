
import {IdbMagazine, idbOpen, Kv} from "@e280/kv"

export async function setupKv({namespace = "kv"}: {namespace?: string} = {}) {
	const idb = await idbOpen("tact", namespace)
	const magazine = new IdbMagazine(idb)
	return new Kv(magazine)
}

