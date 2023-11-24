import { ethers } from 'ethers';

export const BASE_METADATA_URI = 'ipfs://QmeNBYKSUosduL9dd9AULpZ282FSew6Ti7ifsXyefFyXsS';
export const PARENT_COLLECTION_METADATA = `${BASE_METADATA_URI}/parent/metadata.json`;
export const BACKGROUNDS_COLLECTION_METADATA = `${BASE_METADATA_URI}/backgrounds/metadata.json`;
export const GLASSES_COLLECTION_METADATA = `${BASE_METADATA_URI}/glasses/metadata.json`;
export const HANDS_COLLECTION_METADATA = `${BASE_METADATA_URI}/hands/metadata.json`;
export const HATS_COLLECTION_METADATA = `${BASE_METADATA_URI}/hats/metadata.json`;
export const SHIRTS_COLLECTION_METADATA = `${BASE_METADATA_URI}/shirts/metadata.json`;

export const PARENT_ASSETS_BASE_URI = `${BASE_METADATA_URI}/parent/assets/`;
export const BACKGROUNDS_ASSETS_BASE_URI = `${BASE_METADATA_URI}/backgrounds/assets/`;
export const GLASSES_ASSETS_BASE_URI = `${BASE_METADATA_URI}/glasses/assets/`;
export const HANDS_ASSETS_BASE_URI = `${BASE_METADATA_URI}/hands/assets/`;
export const HATS_ASSETS_BASE_URI = `${BASE_METADATA_URI}/hats/assets/`;
export const SHIRTS_ASSETS_BASE_URI = `${BASE_METADATA_URI}/shirts/assets/`;

export const ASSETS_EXTENSION = '.json';

export const CATALOG_METADATA_URI = `${BASE_METADATA_URI}/catalog/metadata.json`;
export const CATALOG_TYPE = 'image/png';

export const PARENT_ASSETS_ODDS = [12, 10, 10, 20, 10, 8, 12, 18];
export const BACKGROUNDS_ASSETS_ODDS = [10, 10, 18, 5, 10, 3, 12, 20, 12];
export const GLASSES_ASSETS_ODDS = [25, 25, 5, 30, 15];
export const HANDS_ASSETS_ODDS = [5, 10, 25, 15, 2, 8, 12, 15, 8];
export const HATS_ASSETS_ODDS = [15, 16, 18, 1, 20, 5, 25];
export const SHIRTS_ASSETS_ODDS = [28, 10, 8, 5, 6, 5, 8, 15, 15];
export const FRAMES_ASSETS_ODDS = [1, 20, 36, 20, 15, 8];

export const PARENT_TOTAL_ASSETS = PARENT_ASSETS_ODDS.length;
export const BACKGROUNDS_TOTAL_ASSETS = BACKGROUNDS_ASSETS_ODDS.length;
export const GLASSES_TOTAL_ASSETS = GLASSES_ASSETS_ODDS.length;
export const HANDS_TOTAL_ASSETS = HANDS_ASSETS_ODDS.length;
export const HATS_TOTAL_ASSETS = HATS_ASSETS_ODDS.length;
export const SHIRTS_TOTAL_ASSETS = SHIRTS_ASSETS_ODDS.length;
export const FRAMES_TOTAL_ASSETS = FRAMES_ASSETS_ODDS.length;

export const PARENT_EQUIPPABLE_GROUP_ID = 1; // Only useful if we decide to make parents equippable into something

// For children, we use the same slot id as equippable group id
export const BACKGROUNDS_SLOT_ID = 1001;
export const GLASSES_SLOT_ID = 1002;
export const HANDS_SLOT_ID = 1003;
export const HATS_SLOT_ID = 1004;
export const SHIRTS_SLOT_ID = 1005;
export const FRAMES_SLOT_ID = 1006;

export const PARENT_FIXED_METADATA = `${BASE_METADATA_URI}/catalog/parent/`;
export const BACKGROUNDS_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/backgrounds.json`;
export const GLASSES_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/glasses.json`;
export const HANDS_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/hands.json`;
export const HATS_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/hats.json`;
export const SHIRTS_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/shirts.json`;
export const FRAMES_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/frames.json`;

export const BACKGROUNDS_Z_INDEX = 0;
export const BODY_Z_INDEX = 2;
export const SHIRTS_Z_INDEX = 4;
export const HATS_Z_INDEX = 6;
export const GLASSES_Z_INDEX = 8;
export const HANDS_Z_INDEX = 10;
export const FRAMES_Z_INDEX = 12;

export const MAX_SUPPLY = 10000;
export const BENEFICIARY = '0x25864456507954bE6020eA12d0Bde3617901935b'; // Multisig
export const ROYALTIES_BPS = 1000; // 10%
export const MINT_PRICE = ethers.utils.parseEther('0.1'); // In BNB, about $23 at time

// PART TYPES (Defined by standard)
export const PART_TYPE_SLOT = 1;
export const PART_TYPE_FIXED = 2;
