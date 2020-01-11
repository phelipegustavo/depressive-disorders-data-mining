import os
import json
import requests
import re

from .Config import *

class Country:

    def __init__(self, publication):
        self.publication = publication
        self.countries = {}
        self.filename = os.path.dirname(__file__) + '/../Cache/countries.json'

    def fromCache(self):
        try:
            with open(self.filename) as json_file:
                data = json.load(json_file)
                return data
        except Exception as e:
            print('Country.fromCache', str(e))
            return False

    def toCache(self, data):
        try: 
            with open(self.filename, 'w') as outfile:
                json.dump(data, outfile, indent=4)
        except Exception as e:
            print('Country.toCache', str(e))
            return False

    def fromApi(self):
        try:
            url = f'{API}/countries'
            res = requests.get(url)
            data = res.json()['countries']
            self.toCache(data)
            return data
        except Exception as e:
            print('Country.fromApi', str(e))
            return False

    def getCountries(self, cache=True):
        data = self.fromCache()
        if(cache and bool(data)):
            self.countries = data
        else:
            self.countries = self.fromApi()
        return self.countries
    
    def getId(self, country):
        try:
            self.getCountries()
            for c in self.countries:
                reg = re.compile(c['regex'], re.MULTILINE | re.IGNORECASE)
                match = reg.match(country)
                if (match):
                    return c['_id']
            return None
        except Exception as e:
            print('Country.getId', str(e))
            return None

    def findCountry(self):
        try:
            # Get country of first afiliation
           country = self.publication['affiliations'][0]['country']
        except:
            # Tag Country not found
            country = ''
        print(f'COUNTRY {country}')
        return self.getId(country.replace('.', ''))