# rust-wasm-template

Template for starting [Webassembly](http://webassembly.org/) projects.

_Heavily influenced by [rust-native-wasm-loader](https://github.com/yamafaktory/rust-wasm-webpack)._

## Setup

Ensure you have [Rust](https://www.rust-lang.org/en-US/install.html). Then install the webassembly dependencies.

```
rustup default nightly
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
cargo install --force --git https://github.com/alexcrichton/wasm-gc
```

Install NPM dependencies

```
yarn install
```

Start the development server

```
yarn run dev
```

Go to [localhost:8080](http://localhost:8080)

Build for production

```
yarn run build
```
