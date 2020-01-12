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
    
    def getId(self, country, field="regex"):
        try:
            self.getCountries()
            # Find by regex
            for c in self.countries:
                reg = re.compile(c[field], re.MULTILINE | re.IGNORECASE)
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
            countryName = self.publication['affiliations'][0]['country']
            countryId = self.getId(countryName.replace('.', '').replace(' ', '').replace(';', ''))
        except:
            # Tag Country not found
            countryName = ''

        if(not countryName):
            # Report cannot find country on publication
            self.reportNotFound('COUNTRY NOT FOUND')

        elif(not countryId):
            # Search on Nominatim API
            country = self.findNominatim(countryName)
            if(country):
                countryId = self.getId(country['country_code'], field="code")

        return countryId

    def findNominatim(self, countryName):
        params = {
            'q': countryName,
            'format': 'jsonv2',
            'addressdetails': 1,
        }
        headers = {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }

        req = requests.get('https://nominatim.openstreetmap.org/search', params=params, headers=headers)
        res = req.json()

        try:
            found = res[0]
        except:
            self.reportNotFound(f'NOMINATIN CANOT FOUND {countryName} >> RESPONSE :: {json.dumps(res)}')
            return False

        return found['address']

    def reportNotFound(self, countryName):
        data = {
            'type': 'country',
            'message': countryName, 
            'data': self.publication
        }
        headers = {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }

        req = requests.post(url = f'{API}/logs', data = json.dumps(data), headers = headers) 

        return req