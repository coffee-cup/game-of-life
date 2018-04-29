# Game of Life Wasm

Implementation of the [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) in WebAssembly.

Based on [this tutorial](https://rust-lang-nursery.github.io/rust-wasm/game-of-life/introduction.html).

## Setup

Ensure you have [Rust](https://www.rust-lang.org/en-US/install.html). Then install the webassembly dependencies.

```
rustup update
rustup install nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
cargo +nightly install wasm-bindgen-cli
```

Install NPM dependencies

```
yarn install
```

Build the wasm files

```
yarn run build-debug
```

Start the development server

```
yarn run serve
```

Go to [localhost:8080](http://localhost:8080)

Build for production

```
yarn run build
```
