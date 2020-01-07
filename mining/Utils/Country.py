import os
import json
import requests

from .Config import *

class Country:

    def __init__(self, publication):
        self.publication = publication
        self.countries = {}
        self.filename = os.path.dirname(__file__) + '/chache/countries.json'

    def fromCache(self):
        try:
            with open(self.filename) as json_file:
                data = json.load(json_file)
                return data
        except:
            return False

    def toCache(self, data):
        try: 
            with open(self.filename, 'w') as outfile:
                json.dump(data, outfile, indent=4)
        except:
            return False

    def fromApi(self):
        try:
            url = f'{API}/countries/list'
            res = requests.get(url)
            data = res.json()['countries']
            self.toCache(data)
            return data
        except:
            return False


    def getCountries(self, cache=True):
        data = self.fromCache()
        if(cache and data):
            self.countries = data
        else:
            self.countries = self.fromApi()
        return self.countries