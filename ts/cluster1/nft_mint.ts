import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "/Users/TheGh0xt/.config/solana/id.json";
import base58 from "bs58";
// import { create } from "domain";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

const myPhantomWallet = publicKey("xyZPn5pyX8KmSg5uAcJtmPtHprzpo6PhYHQmHQV42W6");

const metadataUri =
  "https://gateway.irys.xyz/FNmCAGrgQERAUbmPFEeUBu4CQEWif3PSS5L2snj1d8fE";

(async () => {
  let tx = createNft(umi, {
    mint,
    name: "The Gh0xt NFT",
    uri: metadataUri,

    sellerFeeBasisPoints: percentAmount(100, 2),
    updateAuthority: myKeypairSigner,
    tokenOwner: myPhantomWallet,
  });

  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`,
  );

  console.log("Mint Address: ", mint.publicKey);
})();
