
# 🎮 @benev/tact
> *from keypress to couch co-op*

```ts
npm install @benev/tact
```

tact is a toolkit for handling user input on the web.  
customizable keybindings, multiple-gamepad couch co-op, ready-made configurator ui, efficient networking, mobile virtual thumbsticks.  



<br/>

## 🎮 tact basics

```ts
import {
  Devices, KeyboardDevice, PointerDevice,
  makeIntentsResolver, makeActionsResolver,
} from "@benev/tact"
```

1. **setup your game's keybindings**
    ```ts
    const bindings = {
      running: {forward: "KeyW", jump: ["and", "ShiftLeft", "Space"]},
      gunning: {shoot: ["or", "pointer.button.left", "gamepad.trigger.right"]},
    }
    ```
1. **create your devices (which provide raw input samples)**
    ```ts
    const devices = new Devices(
      new KeyboardDevice(),
      new PointerDevice(),
    )
    ```
1. **make your resolvers**
    ```ts
    const resolveIntents = makeIntentsResolver(bindings)
    const resolveActions = makeActionsResolver(bindings)
    ```
1. **run your resolvers, read your actions**
    ```ts
    import {cycle} from "@e280/stz"

    cycle(function myGameTick() {

      // 🧙‍♂️ samples get resolved into compact intent tuples, good for networking.
      const intents = resolveIntents(Date.now(), devices.samples())

      // 🧙‍♂️ actions are your ergonomic accessors for values.
      const actions = resolveActions(intents)

      // 🧙‍♂️ okay, now check your actions.
      actions.running.forward.value // 1.0
      actions.running.forward.pressed // true
    })
    ```

### 🧙‍♂️ wizardly tips

1. **for networking, you should encode intents as Uint8Array for better efficiency down the wire.**
    ```ts
    import {encodeIntents, decodeIntents} from "@benev/tact"

    const intents = [[1, 0.7853981633974483]]

    console.log(JSON.stringify(intents).length)
      // 22 — yikes

    const bytes = encodeIntents(intents)

    console.log(bytes.length)
      // 6 — noice

    const intents = decodeIntents(bytes)
    ```
1. **you can normalize bindings**
    ```ts
    import {normalizeBindings} from "@benev/tact"

    const bindings = normalizeBindings(appBindings, susBindings)
    ```
    this clones your app bindings and cherry-picks any compatible user bindings. useful when loading from localStorage, so changes to your schema don’t break things.



<br/><br/>

👼 *https://benev.gg/*

