#!/usr/bin/env python3

import csv
import json

INPUT_BASE_PATH_ASSETS_METADATA = './preprocess/input/{type}.csv'
INPUT_BASE_PATH_COLLECTION_METADATA = './preprocess/input/collection_metadata.csv'
PART_TYPES = ['parent', 'backgrounds', 'glasses', 'hands', 'hats', 'shirts']
SLOTS = PART_TYPES[1:]
OUTPUT_BASE_PATH_ASSETS = './metadata/{type}/assets/{consecutive}.json'
OUTPUT_BASE_PATH_COLLECTION_METADATA = './metadata/{type}/metadata.json'
OUTPUT_BASE_PATH_CATALOG_SLOTS = './metadata/catalog/{type}.json'
OUTPUT_CATALOG_METADATA = './metadata/catalog/metadata.json'
ASSETS_BASE_URI = {
    'parent': 'ipfs://Qma995FLL4TiM9p2Hz3vLjdKpafjqdSe7ojsuEUeQxq9Rg/',
    'backgrounds': 'ipfs://QmapE7tBo4Gj1GNDsLP93xAVRSrBvUhujHtahVEkjqYhGC/',
    'glasses': 'ipfs://QmRwoLtEsDCkeh31wKCar94c1zBb69apVpQANxcLxKQRJU/',
    'hands': 'ipfs://QmQXkgFEPunGTWtmKKKD9gznQSferHMZiR2dmddfUM4Ku8/',
    'hats': 'ipfs://QmRtmLjGffiRZAAuFgLfznMCAzaVDtcvkMKadmmwKaiiaW/',
    'shirts': 'ipfs://QmSwRjAXYABYDQsGyHcAyupuG5AukkCfiQVVX9XATbmkCw/',
}


def generate_asset_metadata():
    for type in PART_TYPES:
        input_path = INPUT_BASE_PATH_ASSETS_METADATA.format(type=type)
        with open(input_path, 'r') as f:
            reader = csv.DictReader(f)
            input_assets = list(reader)
        
        for input_asset in input_assets:
            consecutive = input_asset['consecutive']
            output_path = OUTPUT_BASE_PATH_ASSETS.format(type=type, consecutive=consecutive)

            mainImage = f'{ASSETS_BASE_URI[type]}thumb/{consecutive}.png'
            equippedImage = f'{ASSETS_BASE_URI[type]}equipped/{consecutive}.png'
            metadata = {
                'name': input_asset['name'],
                'description': input_asset['description'],
                'externalUri': 'https://benance.mintaur.app',
                'external_url': 'https://benance.mintaur.app',
                'image': mainImage,
                'thumbnailUri': mainImage,
                'license': 'CC0',
            }
            if type not in ['parent']:
                metadata['mediaUri'] = equippedImage
                metadata['preferThumb'] = True
            with open(output_path, 'w') as f:
                json.dump(metadata, f, indent=4)

def generate_collection_metadatas():
    input_path = INPUT_BASE_PATH_COLLECTION_METADATA
    with open(input_path, 'r') as f:
        reader = csv.DictReader(f)
        input_data = list(reader)
    
    for input_datum in input_data:
        type = input_datum['type']
        if type not in PART_TYPES:
            print(f'Unexpected type while generating collection metadata: {type}')
            continue
        metadata = {
            'name': input_datum['name'],
            'description': input_datum['description'],
            'externalUri': 'https://benance.mintaur.app',
            'external_url': 'https://benance.mintaur.app',
            'image': f'{ASSETS_BASE_URI[type]}collection_thumb.gif',
            'thumbnailUri': f'{ASSETS_BASE_URI[type]}collection_thumb.gif',
        }
        output_path = OUTPUT_BASE_PATH_COLLECTION_METADATA.format(type=type)
        with open(output_path, 'w') as f:
            json.dump(metadata, f, indent=4)

def generate_catalog_metadata():
    metadata = {
        'name': 'CZBenance Catalog',
        'description': 'CZBenance Catalog',
        'externalUri': 'https://benance.mintaur.app',
    }
    output_path = OUTPUT_CATALOG_METADATA
    with open(output_path, 'w') as f:
        json.dump(metadata, f, indent=4)
    
    for slot in SLOTS:
        metadata = {
            'name': slot.capitalize(),
        }
        output_path = OUTPUT_BASE_PATH_CATALOG_SLOTS.format(type=slot)
        with open(output_path, 'w') as f:
            json.dump(metadata, f, indent=4)
    

if __name__ == '__main__':
    generate_asset_metadata()
    generate_collection_metadatas()
    generate_catalog_metadata()

