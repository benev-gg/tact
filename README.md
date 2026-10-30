
# 🎮 @benev/tact
> *from keypress to couch co-op.*

**tact is a user-input toolkit for web games.**  
i made tact because i want to make indie web game development easier. user input seems like it should be easy, but doing it well is actually really complex. especially when you start thinking of multiplayer and multithreading. my goal with tact is to tame the complexity and give people something elegant and flexible that "just works".

🌐 👉 ***https://tact.benev.gg/*** 👈 *try now*  

🖱 keyboards, mice, gamepads.  
🧩 expressive bindings json dsl.  
🎨 bindings are user-customizable.  
🫂 multiplayer and splitscreen capable.  
🧬 binary for efficient workers and networking.  
🎸 ready-to-rock drop-in user-interface.  
✍️ handcrafted by a human being.  



![](https://i.imgur.com/dCAlD14.png)

![](https://i.imgur.com/IBW5Kkd.png)



<br/>

## 🎮 let's play.

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
- 🍏 **setup tact.**
    ```ts
    import {setupTact} from "@benev/tact"

    const tact = await setupTact({presets, maxPlayers: 4})
    tact.mouseKeyboard()
    tact.gamepads("gamepad")
    tact.registerElements()
    ```
    - 💡 *you can set `maxPlayers` to 1 for single player.*
- 🍏 **encoding, decoding, and your game logic.**
    ```ts
    setInterval(() => {
      const buffer = tact.deck.hub.encodeAll()
      for (const {playerId, inputs} of tact.collector.decodeAll(buffer)) {

        // your game logic can read these handy input values.
        inputs.jump.value // values are numbers 0  to 1.
        inputs.jump.was // previous value (to detect up/down).
        inputs.jump.sum // sum of values reported since last frame.

        inputs.forward.value
        inputs.look.value
      }
    }, 16.67)
    ```
    - 💡 *maybe imagine streaming the buffers across the network to a remote collector.*
    - 💡 *maybe imagine the tact deck on the clientside, and the collector on the serverside (or a web worker!).*
- 🍏 **put the `<tact-deck>` element in your html page.**
    ```html
    <tact-deck></tact-deck>
    ```
    - 💡 *you also have each panel, `<tact-controllers>` and `<tact-customize>`.*
    - 💡 *you can customize the colors with css.*
        ```html
        <style>
          html {
            --tact-prime: aqua;
            --tact-bg: black;
          }
        </style>
        ```
- 🎉 **you're done! your users can manage controllers and customize bindings!**



<br/>

## 🎮 get down to brass tacks.
> *tact is flexible and composable for alternative use-cases.*

- 🍏 **pov: your app isn't a game, no multiplayer, no gamepads.**  
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
- 🍏 **pov: your app doesn't even want any ui, or persistence.**  
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



<br/><br/>

---

👼 *https://benev.gg/*

