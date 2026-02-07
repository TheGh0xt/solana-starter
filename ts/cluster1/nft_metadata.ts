import wallet from "/Users/TheGh0xt/.config/solana/id.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    const image = await readFile("./../images/gh0xtNFT.png");

    const genericFile = createGenericFile(image, "./../images/gh0xtNFT.png", {
      tags: [{ name: "Content-Type", value: "image/png" }],
    });

    const [imageUri] = await umi.uploader.upload([genericFile]);
    console.log("Your image URI: ", imageUri);

    const metadata = {
      name: "The Gh0xt NFT",
      symbol: "TGN",
      description: "The Gh0xt NFT",
      image: imageUri,
      attributes: [{ trait_type: "Creator", value: "The Gh0xt" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: imageUri,
          },
        ],
      },
      creators: [],
    };

    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your metadata URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
