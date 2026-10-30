
# 🎮 @benev/tact
> *from keypress to couch co-op.*

**tact is a user-input toolkit for web games.**

🌐 👉 ***https://tact.benev.gg/*** 👈 *try now*  

🖱 keyboards, mice, gamepads.  
🧩 expressive bindings json dsl.  
🎨 bindings are user-customizable.  
🫂 multiplayer and splitscreen capable.  
🧬 binary for efficient workers and networking.  
🎸 ready-to-rock drop-in user-interface.  

![](https://i.imgur.com/dCAlD14.png)

![](https://i.imgur.com/IBW5Kkd.png)



<br/>

## 🎮 let's play.

- 🍏 **install tact.**
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
    - 💡 *bindings is a tiny json dsl. see [expression.ts](./s/lib/input/expression.ts).*
- 🍏 **let's have two presets available to the user. one for gamepads.**
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
- 🍏 **now we can setup tact and register the html elements.**
    ```ts
    import {setupTact} from "@benev/tact"

    const tact = await setupTact({presets, maxPlayers: 4})
    tact.mouseKeyboard()
    tact.gamepads("gamepad")
    tact.registerElements()
    ```
- 🍏 **simply put the `<tact-deck>` in your html page.**
    ```html
    <tact-deck></tact-deck>
    ```
    - 💡 *you also have each panel, `<tact-controllers>` and `<tact-customize>`.*
- 🍏 **color the whole ui with css.**
    ```html
    <style>
      html {
        --tact-prime: aqua;
        --tact-bg: black;
      }
    </style>
    ```



<br/>

## 🎮 encoding, decoding, and your game logic.

- 🍏 **make a collector.**
    ```ts
    import {Collector} from "@benev/tact"

    const collector = new Collector(bindings)
    ```
- 🍏 **now it's time for the real action!**
    ```ts
    setInterval(() => {
      const buffer = tact.deck.hub.encodeAll()
      for (const {playerId, inputs} of collector.decodeAll(buffer)) {

        // your game logic can read these handy input values.
        inputs.jump.value // values are numbers 0  to 1.
        inputs.jump.was // previous value (to detect up/down).
        inputs.jump.sum // sum of values reported since last frame.

        inputs.forward.value
        inputs.look.value
      }
    }, 16.67)
    ```
    💡 *you could stream the buffers across the network to a remote collector.*



<br/>

## 🎮 get down to brass tacks.

- 🍏 **use the core facilities directly,** without the ui or multiplayer.  
    ```ts
    import {Controller, InputDecoder, KeyboardSource, PointerSource, Sources} from "@benev/tact"

    const controller = new Controller({
      bindings,
      source: new Sources(new KeyboardSource(), new PointerSource()),
    })

    const decoder = new InputDecoder(bindings)

    // call this in your gameloop:
    const inputs = decoder.decode(controller.encode())
    ```



<br/><br/>

---

👼 *https://benev.gg/*

