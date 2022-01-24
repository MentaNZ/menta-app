import os
import sys
import requests
import json
from menta_client import MentaClient


class Asset():
    def __init__(self, path, filename, client):
        self.path = path
        self.filename = filename
        self.deck = filename.split('.')[0]
        self.client = client

    def __str__(self):
        return """
        Name: {}            
        Path: {}\n
    """.format(self.filename, self.path)

    def fetch(self):
        self.cards = self.client.get_deck(self.deck)
        self.last_changed = self.client.get_log(self.deck)

        data = {
            "last_changed": self.last_changed,
            "cards": self.cards
        }

        with open(self.path, 'w+') as file:
            json.dump(data, file)


working_dir = os.path.dirname(os.path.abspath(__file__))
asset_dir = "/".join(working_dir.split('/')[:-1] + ['assets', 'flashcards'])
assets = []
client = MentaClient("http://localhost:5000/api/v1")

for file in os.listdir(asset_dir):
    assets.append(Asset(os.path.join(asset_dir, file), file, client))

for asset in assets:
    asset.fetch()
