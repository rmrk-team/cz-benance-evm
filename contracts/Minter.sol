// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {Ownable} from "@rmrk-team/evm-contracts/contracts/RMRK/access/Ownable.sol";
import {IERC6220} from "@rmrk-team/evm-contracts/contracts/RMRK/equippable/IERC6220.sol";
import {IMintableWithAsset} from "./IMintableWithAsset.sol";

error FailedToSend();
error IncorrectValueSent();

contract Minter is Ownable, IERC721Receiver {
    event PackMinted(
        address indexed to,
        uint256 indexed packId,
        uint64 parentAssetId,
        uint64 backgroundAssetId,
        uint64 glassesAssetId,
        uint64 handsAssetId,
        uint64 hatAssetId,
        uint64 shirtAssetId
    );

    IMintableWithAsset private _parent;
    IMintableWithAsset private _backgrounds;
    IMintableWithAsset private _glasses;
    IMintableWithAsset private _hands;
    IMintableWithAsset private _hats;
    IMintableWithAsset private _shirts;

    uint256 private _parentTotalAssets;
    uint256 private _backgroundsTotalAssets;
    uint256 private _glassesTotalAssets;
    uint256 private _handsTotalAssets;
    uint256 private _hatsTotalAssets;
    uint256 private _shirtsTotalAssets;

    uint64 private constant BACKGROUNDS_SLOT_ID = 1001;
    uint64 private constant GLASSES_SLOT_ID = 1002;
    uint64 private constant HANDS_SLOT_ID = 1003;
    uint64 private constant HATS_SLOT_ID = 1004;
    uint64 private constant SHIRTS_SLOT_ID = 1005;

    uint256 private _packsMinted;
    uint256 private _mintPrice;
    address private _beneficiary;

    constructor(
        address beneficiary,
        address parent,
        address backgrounds,
        address glasses,
        address hands,
        address hats,
        address shirts,
        uint256 mintPrice
    ) {
        _beneficiary = beneficiary;
        _parent = IMintableWithAsset(parent);
        _backgrounds = IMintableWithAsset(backgrounds);
        _glasses = IMintableWithAsset(glasses);
        _hands = IMintableWithAsset(hands);
        _hats = IMintableWithAsset(hats);
        _shirts = IMintableWithAsset(shirts);
        _mintPrice = mintPrice;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function getBeneficiary() external view returns (address) {
        return _beneficiary;
    }

    function getAddresses()
        external
        view
        returns (
            address parent,
            address backgrounds,
            address glasses,
            address hands,
            address hats,
            address shirts
        )
    {
        parent = address(_parent);
        backgrounds = address(_backgrounds);
        glasses = address(_glasses);
        hands = address(_hands);
        hats = address(_hats);
        shirts = address(_shirts);
    }

    function getTotalAssets()
        external
        view
        returns (
            uint256 parent,
            uint256 backgrounds,
            uint256 glasses,
            uint256 hands,
            uint256 hats,
            uint256 shirts
        )
    {
        parent = _parentTotalAssets;
        backgrounds = _backgroundsTotalAssets;
        glasses = _glassesTotalAssets;
        hands = _handsTotalAssets;
        hats = _hatsTotalAssets;
        shirts = _shirtsTotalAssets;
    }

    function getPacksMinted() public view returns (uint256) {
        return _packsMinted;
    }

    function getMintPrice() public view returns (uint256) {
        return _mintPrice;
    }

    function setBeneficiary(address beneficiary) external onlyOwner {
        _beneficiary = beneficiary;
    }

    function setTotalAssets(
        uint256 parent,
        uint256 backgrounds,
        uint256 glasses,
        uint256 hands,
        uint256 hats,
        uint256 shirts
    ) external onlyOwnerOrContributor {
        _parentTotalAssets = parent;
        _backgroundsTotalAssets = backgrounds;
        _glassesTotalAssets = glasses;
        _handsTotalAssets = hands;
        _hatsTotalAssets = hats;
        _shirtsTotalAssets = shirts;
    }

    function mintPacks(address to, uint256 numPacks) external payable {
        _chargeFee(numPacks);
        for (uint256 i = 0; i < numPacks; i++) {
            _mintParentAndChildren(to);
        }
    }

    function _mintParentAndChildren(address to) private {
        (
            uint64 parentAssetId,
            uint64 backgroundAssetId,
            uint64 glassesAssetId,
            uint64 handsAssetId,
            uint64 hatAssetId,
            uint64 shirtAssetId
        ) = _getAssetIds();
        unchecked {
            ++_packsMinted;
        }

        uint256 parentId = _parent.mint(address(this), parentAssetId);
        _backgrounds.nestMint(address(_parent), parentId, backgroundAssetId);
        _glasses.nestMint(address(_parent), parentId, glassesAssetId);
        _hands.nestMint(address(_parent), parentId, handsAssetId);
        _hats.nestMint(address(_parent), parentId, hatAssetId);
        _shirts.nestMint(address(_parent), parentId, shirtAssetId);

        IERC6220.IntakeEquip memory equipInfo = IERC6220.IntakeEquip({
            tokenId: parentId,
            childIndex: 0,
            assetId: parentAssetId,
            slotPartId: BACKGROUNDS_SLOT_ID,
            childAssetId: backgroundAssetId
        });
        _parent.equip(equipInfo);

        equipInfo.childIndex = 1;
        equipInfo.slotPartId = GLASSES_SLOT_ID;
        equipInfo.childAssetId = glassesAssetId;
        _parent.equip(equipInfo);

        equipInfo.childIndex = 2;
        equipInfo.slotPartId = HANDS_SLOT_ID;
        equipInfo.childAssetId = handsAssetId;
        _parent.equip(equipInfo);

        equipInfo.childIndex = 3;
        equipInfo.slotPartId = HATS_SLOT_ID;
        equipInfo.childAssetId = hatAssetId;
        _parent.equip(equipInfo);

        equipInfo.childIndex = 4;
        equipInfo.slotPartId = SHIRTS_SLOT_ID;
        equipInfo.childAssetId = shirtAssetId;
        _parent.equip(equipInfo);

        _parent.transferFrom(address(this), to, parentId);

        emit PackMinted(
            to,
            _packsMinted,
            parentAssetId,
            backgroundAssetId,
            glassesAssetId,
            handsAssetId,
            hatAssetId,
            shirtAssetId
        );
    }

    function _getAssetIds()
        private
        view
        returns (
            uint64 parentAssetId,
            uint64 backgroundAssetId,
            uint64 glassesAssetId,
            uint64 handsAssetId,
            uint64 hatAssetId,
            uint64 shirtAssetId
        )
    {
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.difficulty, msg.sender)
            )
        );
        parentAssetId = uint64((seed % _parentTotalAssets) + 1);
        seed >> 8;
        backgroundAssetId = uint64((seed % _backgroundsTotalAssets) + 1);
        seed >> 8;
        glassesAssetId = uint64((seed % _glassesTotalAssets) + 1);
        seed >> 8;
        handsAssetId = uint64((seed % _handsTotalAssets) + 1);
        seed >> 8;
        hatAssetId = uint64((seed % _hatsTotalAssets) + 1);
        seed >> 8;
        shirtAssetId = uint64((seed % _shirtsTotalAssets) + 1);
    }

    function _chargeFee(uint256 numPacks) private {
        if (msg.value != _mintPrice * numPacks) {
            revert IncorrectValueSent();
        }
        (bool success, ) = _beneficiary.call{value: msg.value}("");
        if (!success) revert FailedToSend();
    }
}
