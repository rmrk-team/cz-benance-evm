import { getRegistry } from './getRegistry';
import { deployContracts, configureRelationships, addAssets, configureCatalog } from './deploy';
import * as C from './constants';
import { ethers } from 'hardhat';

async function main() {
  console.log('Deploying CZ Collections contract');

  const { parent, backgrounds, glasses, hands, hats, shirts, minter, catalog } =
    await deployContracts();

  console.log(`Parent: ${parent.address}`);
  console.log(`Backgrounds: ${backgrounds.address}`);
  console.log(`Glasses: ${glasses.address}`);
  console.log(`Hands: ${hands.address}`);
  console.log(`Hats: ${hats.address}`);
  console.log(`Shirts: ${shirts.address}`);
  console.log(`Minter: ${minter.address}`);

  // Only do on testing, or if whitelisted for production
  const registry = await getRegistry();
  let tx = await registry.addExternalCollection(parent.address, C.PARENT_COLLECTION_METADATA);
  await tx.wait();
  tx = await registry.addExternalCollection(backgrounds.address, C.BACKGROUNDS_COLLECTION_METADATA);
  await tx.wait();
  tx = await registry.addExternalCollection(glasses.address, C.GLASSES_COLLECTION_METADATA);
  await tx.wait();
  tx = await registry.addExternalCollection(hands.address, C.HANDS_COLLECTION_METADATA);
  await tx.wait();
  tx = await registry.addExternalCollection(hats.address, C.HATS_COLLECTION_METADATA);
  await tx.wait();
  tx = await registry.addExternalCollection(shirts.address, C.SHIRTS_COLLECTION_METADATA);
  await tx.wait();
  console.log('Collections added to registry');

  await configureCatalog(backgrounds, glasses, hands, hats, shirts, catalog);
  console.log('Catalog configured');

  await configureRelationships(parent, backgrounds, glasses, hands, hats, shirts, minter);
  console.log('Relationships configured');

  await addAssets(parent, backgrounds, glasses, hands, hats, shirts, catalog);
  console.log('Assets added');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
