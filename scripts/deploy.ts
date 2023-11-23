import { ethers, network, run } from 'hardhat';
import { Minter, Child, Parent, RMRKCatalogImpl } from '../typechain-types';
import * as C from './constants';
import { IRMRKCatalog } from '../typechain-types/@rmrk-team/evm-contracts/contracts/implementations/RMRKCatalogImpl';

async function deployContracts(): Promise<{
  parent: Parent;
  backgrounds: Child;
  glasses: Child;
  hands: Child;
  hats: Child;
  shirts: Child;
  catalog: RMRKCatalogImpl;
  minter: Minter;
}> {
  const parentFactory = await ethers.getContractFactory('Parent');
  const parentArgs = [
    'CZBenance',
    'CZB',
    C.PARENT_COLLECTION_METADATA,
    C.MAX_SUPPLY,
    C.BENEFICIARY,
    C.ROYALTIES_BPS,
  ] as const;

  const parent: Parent = await parentFactory.deploy(...parentArgs);
  await parent.deployed();

  const childFactory = await ethers.getContractFactory('Child');
  const backgroundArgs = [
    'Background',
    'CZBCK',
    C.BACKGROUNDS_COLLECTION_METADATA,
    C.MAX_SUPPLY,
    C.BENEFICIARY,
    C.ROYALTIES_BPS,
  ] as const;
  const glassesArgs = [
    'Glasses',
    'CZGLS',
    C.GLASSES_COLLECTION_METADATA,
    C.MAX_SUPPLY,
    C.BENEFICIARY,
    C.ROYALTIES_BPS,
  ] as const;
  const handsArgs = [
    'Hands',
    'CZHND',
    C.HANDS_COLLECTION_METADATA,
    C.MAX_SUPPLY,
    C.BENEFICIARY,
    C.ROYALTIES_BPS,
  ] as const;
  const hatsArgs = [
    'Hats',
    'CZHAT',
    C.HATS_COLLECTION_METADATA,
    C.MAX_SUPPLY,
    C.BENEFICIARY,
    C.ROYALTIES_BPS,
  ] as const;
  const shirtsArgs = [
    'Shirts',
    'CZSHT',
    C.SHIRTS_COLLECTION_METADATA,
    C.MAX_SUPPLY,
    C.BENEFICIARY,
    C.ROYALTIES_BPS,
  ] as const;

  const backgrounds: Child = await childFactory.deploy(...backgroundArgs);
  await backgrounds.deployed();

  const glasses: Child = await childFactory.deploy(...glassesArgs);
  await glasses.deployed();

  const hands: Child = await childFactory.deploy(...handsArgs);
  await hands.deployed();

  const hats: Child = await childFactory.deploy(...hatsArgs);
  await hats.deployed();

  const shirts: Child = await childFactory.deploy(...shirtsArgs);
  await shirts.deployed();

  const catalogFactory = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalogArgs = [C.CATALOG_METADATA_URI, C.CATALOG_TYPE] as const;
  const catalog: RMRKCatalogImpl = await catalogFactory.deploy(...catalogArgs);

  const minterFactory = await ethers.getContractFactory('Minter');
  const minterArgs = [
    C.BENEFICIARY,
    parent.address,
    backgrounds.address,
    glasses.address,
    hands.address,
    hats.address,
    shirts.address,
    C.MINT_PRICE,
  ] as const;
  const minter: Minter = await minterFactory.deploy(...minterArgs);
  await minter.deployed();

  let tx = await minter.setTotalAssets(
    C.PARENT_TOTAL_ASSETS,
    C.BACKGROUNDS_TOTAL_ASSETS,
    C.GLASSES_TOTAL_ASSETS,
    C.HANDS_TOTAL_ASSETS,
    C.HATS_TOTAL_ASSETS,
    C.SHIRTS_TOTAL_ASSETS,
  );
  await tx.wait();

  if (network.name !== 'hardhat') {
    await run('verify:verify', {
      address: parent.address,
      constructorArguments: parentArgs,
    });
    await run('verify:verify', {
      address: backgrounds.address,
      constructorArguments: backgroundArgs,
    }); // Other items will be verified by this automatically
    await run('verify:verify', {
      address: minter.address,
      constructorArguments: minterArgs,
    });
    await run('verify:verify', {
      address: catalog.address,
      constructorArguments: catalogArgs,
    });
  }

  return {
    parent,
    backgrounds,
    glasses,
    hands,
    hats,
    shirts,
    minter,
    catalog,
  };
}

async function configureRelationships(
  parent: Parent,
  backgrounds: Child,
  glasses: Child,
  hands: Child,
  hats: Child,
  shirts: Child,
  minter: Minter,
) {
  let tx = await parent.manageContributor(minter.address, true);
  await tx.wait();
  tx = await backgrounds.manageContributor(minter.address, true);
  await tx.wait();
  tx = await glasses.manageContributor(minter.address, true);
  await tx.wait();
  tx = await hands.manageContributor(minter.address, true);
  await tx.wait();
  tx = await hats.manageContributor(minter.address, true);
  await tx.wait();
  tx = await shirts.manageContributor(minter.address, true);
  await tx.wait();
  console.log('Mintor added as contributor to all collections');

  tx = await parent.setAutoAcceptCollection(backgrounds.address, true);
  await tx.wait();
  tx = await parent.setAutoAcceptCollection(glasses.address, true);
  await tx.wait();
  tx = await parent.setAutoAcceptCollection(hands.address, true);
  await tx.wait();
  tx = await parent.setAutoAcceptCollection(hats.address, true);
  await tx.wait();
  tx = await parent.setAutoAcceptCollection(shirts.address, true);
  await tx.wait();
  console.log('All item collections set to auto accept on parent');

  tx = await backgrounds.setValidParentForEquippableGroup(
    C.BACKGROUNDS_SLOT_ID,
    parent.address,
    C.BACKGROUNDS_SLOT_ID,
  );
  await tx.wait();
  tx = await glasses.setValidParentForEquippableGroup(
    C.GLASSES_SLOT_ID,
    parent.address,
    C.GLASSES_SLOT_ID,
  );
  await tx.wait();
  tx = await hands.setValidParentForEquippableGroup(
    C.HANDS_SLOT_ID,
    parent.address,
    C.HANDS_SLOT_ID,
  );
  await tx.wait();
  tx = await hats.setValidParentForEquippableGroup(C.HATS_SLOT_ID, parent.address, C.HATS_SLOT_ID);
  await tx.wait();
  tx = await shirts.setValidParentForEquippableGroup(
    C.SHIRTS_SLOT_ID,
    parent.address,
    C.SHIRTS_SLOT_ID,
  );
  await tx.wait();
  console.log('All item collections configured slot to be equippable into parent');
}

async function addAssets(
  parent: Parent,
  backgrounds: Child,
  glasses: Child,
  hands: Child,
  hats: Child,
  shirts: Child,
  catalog: RMRKCatalogImpl,
) {
  // On parent this method is very different, see docstirng
  let tx = await parent.batchAddAssets(
    C.PARENT_ASSETS_BASE_URI,
    C.ASSETS_EXTENSION,
    C.PARENT_TOTAL_ASSETS,
    C.PARENT_EQUIPPABLE_GROUP_ID,
    catalog.address,
    [C.BACKGROUNDS_SLOT_ID, C.GLASSES_SLOT_ID, C.HANDS_SLOT_ID, C.HATS_SLOT_ID, C.SHIRTS_SLOT_ID],
  );
  await tx.wait();

  tx = await backgrounds.batchAddAssets(
    C.BACKGROUNDS_ASSETS_BASE_URI,
    C.ASSETS_EXTENSION,
    C.BACKGROUNDS_TOTAL_ASSETS,
    C.BACKGROUNDS_SLOT_ID,
  );
  await tx.wait();

  tx = await glasses.batchAddAssets(
    C.GLASSES_ASSETS_BASE_URI,
    C.ASSETS_EXTENSION,
    C.GLASSES_TOTAL_ASSETS,
    C.GLASSES_SLOT_ID,
  );
  await tx.wait();

  tx = await hands.batchAddAssets(
    C.HANDS_ASSETS_BASE_URI,
    C.ASSETS_EXTENSION,
    C.HANDS_TOTAL_ASSETS,
    C.HANDS_SLOT_ID,
  );
  await tx.wait();

  tx = await hats.batchAddAssets(
    C.HATS_ASSETS_BASE_URI,
    C.ASSETS_EXTENSION,
    C.HATS_TOTAL_ASSETS,
    C.HATS_SLOT_ID,
  );
  await tx.wait();

  tx = await shirts.batchAddAssets(
    C.SHIRTS_ASSETS_BASE_URI,
    C.ASSETS_EXTENSION,
    C.SHIRTS_TOTAL_ASSETS,
    C.SHIRTS_SLOT_ID,
  );
  await tx.wait();
}

async function configureCatalog(
  backgrounds: Child,
  glasses: Child,
  hands: Child,
  hats: Child,
  shirts: Child,
  catalog: RMRKCatalogImpl,
) {
  const parentParts: IRMRKCatalog.IntakeStructStruct[] = [];
  for (let i = 1; i <= C.PARENT_TOTAL_ASSETS; i++) {
    parentParts.push({
      partId: i,
      part: {
        itemType: C.PART_TYPE_FIXED,
        z: C.PARENT_Z_INDEX,
        equippable: [],
        metadataURI: `${C.PARENT_FIXED_METADATA}${i}.json`,
      },
    });
  }
  let tx = await catalog.addPartList(parentParts);

  tx = await catalog.addPartList([
    {
      partId: C.BACKGROUNDS_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.BACKGROUNDS_Z_INDEX,
        equippable: [backgrounds.address],
        metadataURI: C.BACKGROUNDS_SLOT_METADATA,
      },
    },
    {
      partId: C.GLASSES_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.GLASSES_Z_INDEX,
        equippable: [glasses.address],
        metadataURI: C.GLASSES_SLOT_METADATA,
      },
    },
    {
      partId: C.HANDS_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.HANDS_Z_INDEX,
        equippable: [hands.address],
        metadataURI: C.HANDS_SLOT_METADATA,
      },
    },
    {
      partId: C.HATS_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.HATS_Z_INDEX,
        equippable: [hats.address],
        metadataURI: C.HATS_SLOT_METADATA,
      },
    },
    {
      partId: C.SHIRTS_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.SHIRTS_Z_INDEX,
        equippable: [shirts.address],
        metadataURI: C.SHIRTS_SLOT_METADATA,
      },
    },
  ]);
  await tx.wait();
}

export { deployContracts, configureRelationships, addAssets, configureCatalog };
