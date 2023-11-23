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
ASSETS_BASE_URI = 'ipfs://ABC/'


def generate_asset_metadata():
    for type in PART_TYPES:
        input_path = INPUT_BASE_PATH_ASSETS_METADATA.format(type=type)
        with open(input_path, 'r') as f:
            reader = csv.DictReader(f)
            input_assets = list(reader)
        
        for input_asset in input_assets:
            consecutive = input_asset['name']
            output_path = OUTPUT_BASE_PATH_ASSETS.format(type=type, consecutive=consecutive)

            mainImage = f'{ASSETS_BASE_URI}/{type}/assets/thumb/{consecutive}.png'
            metadata = {
                'name': input_asset['name'],
                'description': input_asset['description'],
                'externalUri': 'https://benance.mintaur.app',
                'external_url': 'https://benance.mintaur.app',
                'image': mainImage,
                'license': 'CC0',
            }
            if type == 'parent':
                metadata['mediaUri'] = f'{ASSETS_BASE_URI}/{type}/assets/equipped/{consecutive}.png'
                metadata['thumbnailUri'] = mainImage
                metadata['preferThumb'] = True
            else:
                metadata['mediaUri'] = mainImage
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
            'mediaUri': f'{ASSETS_BASE_URI}/{type}/collection.png',
            'thumbnailUri': f'{ASSETS_BASE_URI}/{type}/collection_thumb.png',
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

