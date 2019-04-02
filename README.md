# workshopping
make a workshop page

https://serapath.github.io/workshopping

## `workshop.json` Specification (by example)
```
{
  "title": "Buy Bitcoins",
  "icon": "./icon.svg",
  "chat": "https://gitter.im/ethereum/play/~embed",
  "lessons": [{
    "title": "Set up Bitcoin Wallet (Electrum)",
    "lesson": "https://www.youtube.com/embed/DEH0eoppbyc",
    "tool": "",
    "info": "/demo/docs/set-up-bitcoin-wallet.md"
  },{
    "title": "Buy Bitcoin on Coinbase",
    "lesson": "https://www.youtube.com/embed/FPVr59ThnHE",
    "tool": "https://codepen.io/pBun/pen/sHCzt",
    "info": "docs/buy-bitcoin-on-coinbase.md"
  },{
    "title": "Move Bitcoin from Coinbase to Electrum",
    "lesson": "https://www.youtube.com/embed/9fvDp43rShA",
    "tool": "",
    "info": "./docs/move-bitcoin-from-coinbase-to-electrum.md"
  },{
    "title": "Backup Electrum Wallet",
    "lesson": "https://www.youtube.com/embed/Po7Vtl9xOD0",
    "tool": "https://asdf.com/",
    "info": "./docs/backup-electrum-wallet.md"
  },{
    "title": "Recover Electrum Wallet from a Seed",
    "lesson": "https://www.youtube.com/embed/y8Id3adVX78",
    "tool": "",
    "info": "./docs/recover-electrum-wallet-from-a-seed.md"
  }],
  "needs": [
    "ninabreznik.com/learnRemix/workshop-remix?share=17%",
    "vitalik.com/ethereum/workshop-ethereum?share=9%"
  ],
  "unlocks": [
    "karl.com/run-bitcoin-business/workshop-crypto-economics?request=1%"
  ]
}
```

## `workshop.json` extension proposal
```
{  
  "contribute": {
    "source": "./README.md#contribute",
    "maintainer": "0x12345...6789@ropsten.ethereum.net",
    "share": "13%",
    "conributors": [
      "0x52345...6789@main.ethereum.net?share=4%",
      "0x43456...7890@main.ethereum.net?share=13%",
      "0x34567...8901@main.ethereum.net?share=52%"
    ],
    "dependencies": {
      "workshop": "package.json#dependencies.workshop@1.0.0?share=5%"
    }
  },
  "needs": [
    "ninabreznik.com/learnRemix/workshop-remix?share=17%",
    "vitalik.com/ethereum/workshop-ethereum?share=9%"
  ],
  "unlocks": [
    "karl.com/run-bitcoin-business/workshop-crypto-economics?request=1%"
  ]
}
```
