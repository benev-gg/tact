
# 🎮 @benev/tact
> *from keypress to couch co-op.*

### tact is a user-input toolkit for web games.

🌐 👉 ***https://tact.benev.gg/*** 👈 *try now*  
🖱 keyboards, mice, gamepads.  
🔥 powerful enough for multiplayer games, simple enough for any app.  
🎸 users can customize keybinds with the ready-to-rock ui.  
🧬 expressive bindings json dsl.  
📡 binary streaming for multiplayer and multithreading.  
✍️ handcrafted by a human being.  

user input isn't as simple as you'd think.  
after many design iterations, tact has evolved into an elegant system that handles hard problems for you like customizability, multiplayer, and multithreading. i'm trying to give you the *"it just works"* experience.

with tact, i care very much that -- all input types are boiled down to simple numbers that are all treated the same -- that mouse movement precision and accuracy is holy and must not drop any pixels of movement despite encoders/decoders sampling at differing rates -- that gamepad support and local multiplayer is a great experience -- that inputs are streamed in compact binary format, ready to be sent across networks or to web workers -- that the bindings language is infinitely capable and expressive so you can remap values from funky gamepads and make ridiculously complex hotkey combinations.



![](https://i.imgur.com/dCAlD14.png)

![](https://i.imgur.com/IBW5Kkd.png)



<br/>

## 🎮 let's play.
> *here's the fully-featured, batteries-included, ready-for-anything web game starter pack.*

- 🍏 **install tact into your typescript project.**
    ```sh
    npm install @benev/tact@next
    ```
- 🍏 **establish your app's standard bindings.**
    ```ts
    import {asBindings} from "@benev/tact"

    const bindings = asBindings({
      jump: "Space",
      forward: "KeyW",
      look: ["accumulate", "pointer.x"],
    })
    ```
- 🍏 **let's have two presets available to the user, with one for gamepads.**
    ```ts
    import {asPresets} from "@benev/tact"

    const presets = asPresets<typeof bindings>({
      standard: {label: "⌨️standard", bindings},
      gamepad: {label: "🎮gamer", bindings: {
        jump: "gamepad.1",
        forward: ["remap", 0, -1, 0, 1, "gamepad.axis.2"],
        look: ["*", ["dt"], "gamepad.axis.3", 100],
      }},
    })
    ```
- ⚙️ **setup tact.**
    ```ts
    import {setupTact} from "@benev/tact"

    const tact = await setupTact({presets, maxPlayers: 4})
    tact.mouseKeyboard()
    tact.gamepads("gamepad")
    tact.registerElements()
    ```
    - 💡 *you can set `{maxPlayers: 1}` for a single player game.*
    - 💡 *you can pass `{namespace: "my-game"}` if you need to run multiple games on one website.*
    - 💡 *you can namespace the elements like `customElements.define("tact-deck-my-game", tact.elements.TactDeck)`.*
- 🍏 **encoding, decoding, and your game logic.**
    ```ts
    import {Collector} from "@benev/tact"

    const collector = new Collector(bindings)

    setInterval(() => {
      const buffer = tact.encodeAll()
      for (const {playerId, inputs} of collector.decodeAll(buffer)) {

        // your game logic can read these handy input values.
        inputs.jump.value // button-like values are numbers 0 to 1.
        inputs.jump.was // previous value (to detect up/down).
        inputs.jump.sum // sum of values reported since last frame.

        inputs.forward.value
        inputs.look.value
      }
    }, 16.67)
    ```
    - 💡 *you could stream the buffers across the network to a remote collector, maybe with [renraku](https://github.com/e280/renraku).*
    - 💡 *you could have the tact deck on the clientside, and the collector on the serverside (or a web worker!).*
- 🍏 **put the `<tact-deck>` element in your html page.**
    ```html
    <tact-deck></tact-deck>
    ```
    - 💡 *or just use the sub-panels directly, `<tact-controllers>` and `<tact-customize>`.*
    - 💡 *you can customize the colors with css.*
        ```html
        <style>
          html {
            --tact-prime: aqua;
          }
        </style>
        ```
- 🎉 **you're done! your users can manage controllers and customize bindings!**



<br/>

## 🎮 get down to brass tacks.
> *for simpler apps, you can use tact's composable parts more directly.*

- ⚙️ **pov: your app isn't a game, no multiplayer, no gamepads.**  
    ```ts
    import {setupTact, InputDecoder} from "@benev/tact"

    const tact = await setupTact({presets, maxPlayers: 1})
    const controller = tact.mouseKeyboard()
    const decoder = new InputDecoder(bindings)
    tact.registerElements()

    setInterval(() => {
      const inputs = decoder.decode(controller.encode())

      // 🧙‍♂️ handle your inputs.
      inputs.jump.value

    }, 16.67)
    ```
    - 💡 *then the only ui you need is the `<tact-customize>` panel (also available as a sly view `CustomizeView`).*
- ⚙️ **pov: your app doesn't even want any ui, or persistence.**  
    ```ts
    import {Controller, InputDecoder, KeyboardSource, PointerSource, Sources} from "@benev/tact"

    const source = new Sources(new KeyboardSource(), new PointerSource())
    const controller = new Controller({bindings, source})
    const decoder = new InputDecoder(bindings)

    setInterval(() => {
      const inputs = decoder.decode(controller.encode())

      // 🧙‍♂️ handle your inputs.
      inputs.jump.value

    }, 16.67)
    ```



<br/>

## 🎮 bindings wizardry.
> *bindings can basically do anything.*

- 🧙‍♂️ **the bindings dsl is literally a little json programming language.**  
    see [expression.ts](./s/lib/input/expression.ts) to get an idea of what's possible.
- 🧙‍♂️ **arbitrary nesting is valid.**
    ```ts
    asBindings("KeyW")

    inputs.value // 1
    ```
    ```ts
    asBindings({
      actions: {
        special: {
          castMagicSpell: ["*", ["mod", "shift", "alt"], "KeyR"],
        }
      }
    })

    inputs.actions.special.castMagicSpell.value // 1
    ```
- 🧙‍♂️ **you can differentiate taps versus holds on the same key.**
    ```ts
    asBindings({

      // tapping E yoinks a weapon into your inventory.
      grab: ["taps", 1, 250, "KeyE"],

      // holding E equips the weapon as your primary.
      equip: ["hold", 250, "KeyE"],
    })
    ```
- 🧙‍♂️ **you can "accumulate" mouse inputs accurately,** to avoid losses in sampling frequency mismatches.
    ```ts
    asBindings({
      lookX: ["accumulate", "pointer.x"],
    })

    inputs.lookX.sum // use sum instead of value, to ensure you don't lose any pointer movement.
    ```
- 🧙‍♂️ **gamepads thumbstick inputs are best done with some math.**
    ```ts
    asBindings({
      forward: ["*",

        // user-customizable sensitivity, equivalent with pointer-pixels-per-second.
        1234,

        // delta time factor, to ensure sensitivity is framerate-independent.
        ["dt"],

        // remapping the ranges because gamepads are naughty and often have jiggly deadzones.
        ["remap", -0.1, -0.9, 0, 1, "gamepad.axis.1"],
      ],
    })
    ```



<br/><br/>

---

👼 *https://benev.gg/*

