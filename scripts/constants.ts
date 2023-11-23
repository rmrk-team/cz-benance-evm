import { ethers } from 'ethers';

export const BASE_URI = ''; // TODO
export const PARENT_COLLECTION_METADATA = `${BASE_URI}/parent/metadata.json`;
export const BACKGROUNDS_COLLECTION_METADATA = `${BASE_URI}/backgrounds/metadata.json`;
export const GLASSES_COLLECTION_METADATA = `${BASE_URI}/glasses/metadata.json`;
export const HANDS_COLLECTION_METADATA = `${BASE_URI}/hands/metadata.json`;
export const HATS_COLLECTION_METADATA = `${BASE_URI}/hats/metadata.json`;
export const SHIRTS_COLLECTION_METADATA = `${BASE_URI}/shirts/metadata.json`;

export const PARENT_ASSETS_BASE_URI = `${BASE_URI}/parent/assets/`;
export const BACKGROUNDS_ASSETS_BASE_URI = `${BASE_URI}/backgrounds/assets/`;
export const GLASSES_ASSETS_BASE_URI = `${BASE_URI}/glasses/assets/`;
export const HANDS_ASSETS_BASE_URI = `${BASE_URI}/hands/assets/`;
export const HATS_ASSETS_BASE_URI = `${BASE_URI}/hats/assets/`;
export const SHIRTS_ASSETS_BASE_URI = `${BASE_URI}/shirts/assets/`;

export const ASSETS_EXTENSION = '.json';

export const CATALOG_METADATA_URI = `${BASE_URI}/catalog/metadata.json`;
export const CATALOG_TYPE = 'image/png';

// TODO - Update these values
export const PARENT_TOTAL_ASSETS = 10;
export const BACKGROUNDS_TOTAL_ASSETS = 10;
export const GLASSES_TOTAL_ASSETS = 10;
export const HANDS_TOTAL_ASSETS = 10;
export const HATS_TOTAL_ASSETS = 10;
export const SHIRTS_TOTAL_ASSETS = 10;

export const PARENT_EQUIPPABLE_GROUP_ID = 1; // Only useful if we decide to make parents equippable into something

// For children, we use the same slot id as equippable group id
export const BACKGROUNDS_SLOT_ID = 1001;
export const GLASSES_SLOT_ID = 1002;
export const HANDS_SLOT_ID = 1003;
export const HATS_SLOT_ID = 1004;
export const SHIRTS_SLOT_ID = 1005;

export const PARENT_FIXED_METADATA = `${BASE_URI}/catalog/parent/`;
export const BACKGROUNDS_SLOT_METADATA = `${BASE_URI}/catalog/background.json`;
export const GLASSES_SLOT_METADATA = `${BASE_URI}/catalog/glasses.json`;
export const HANDS_SLOT_METADATA = `${BASE_URI}/catalog/hands.json`;
export const HATS_SLOT_METADATA = `${BASE_URI}/catalog/hats.json`;
export const SHIRTS_SLOT_METADATA = `${BASE_URI}/catalog/shirts.json`;

export const BACKGROUNDS_Z_INDEX = 0;
export const PARENT_Z_INDEX = 2;
export const SHIRTS_Z_INDEX = 4;
export const GLASSES_Z_INDEX = 6;
export const HANDS_Z_INDEX = 8;
export const HATS_Z_INDEX = 10;

export const MAX_SUPPLY = 10000;
export const BENEFICIARY = '0x25864456507954bE6020eA12d0Bde3617901935b'; // Multisig
export const ROYALTIES_BPS = 500; // 5%
export const MINT_PRICE = ethers.utils.parseEther('0.1'); // In BNB, about $23 at time

// PART TYPES (Defined by standard)
export const PART_TYPE_SLOT = 1;
export const PART_TYPE_FIXED = 2;
