# ERC20-Exporter
### Lightweight explorer for ERC20 based Ethereum tokens

ERC20-Exporter is an explorer built with NodeJS, Express and Parity. It does not require an external database and retrieves all information on the fly from a backend Ethereum node.


A demo instance connected to the Golem Network Token is available at [gnt.etherchain.org](http://gnt.etherchain.org).

## Current Features
* Browse transactions and accounts
* Named accounts
* Event log browser
* Supports Transfer and Approval events
* Live Backend Node status display
* Support for all [Bootswatch](https://bootswatch.com/) skins
* Accounts enumeration
* Supports IPC and HTTP backend connections
* Responsive layout

Missing a feature? Please request it by creating a new [Issue](https://github.com/gobitfly/erc20-exporter/issues).

## Getting started

Supported OS: Ubuntu 16.04

Supported Ethereum backend nodes: Parity, Geth (untested)

1. Setup a nodejs & npm environment
2. Install the latest version of the Parity Ethereum client
3. Start parity using the following options: `parity --warp`
4. Clone this repository to your local machine: `git clone https://github.com/gobitfly/erc20-exporter`
5. Install all dependencies: `npm install`
6. Rename `config.js.example` into `config.js` and adjust the file to your local environment & token
7. Start the explorer: `npm start`
8. Browse to `http://localhost:3000`

Please note that for large tokens the initial data export can take up to 30 minutes. Once completed it is recommended to change the exportStartBlock parameter in the config file to a block number that is around 30.000 blocks behind the current tip of the chain and restart the exporter.