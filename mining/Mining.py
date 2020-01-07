import json
import subprocess
import requests
import urllib.request
import math
import time 
import os

from Utils.Config import *
from Utils import File
from Parser import Parser

class Mining:

	def __init__(self, term, db='pmc'):
		self.db = db
		self.term = term
		self.path = ''
		self.pagination = {
			'page': 0,
			'total': 0,
			'current': 0,
			'count': 0,
			'retstart': 0,
			'retmax': 5000,
		}

	def start(self):
		self.search()
		self.paginate()
		print('STARTING....')
		for page in range(1, self.pagination['total']):
			idlist = self.search()
			if(idlist):
				self.fetchIds(idlist) 
			self.nextPage()

	def fetchIds(self, ids):
		for id in ids:
			self.fetch(id)

	def fetch(self, id, retries=0):
		try:
			self.path = File.createPath(self.db + '/XML/' + self.term)
			url = ENTREZ + '/eutils/efetch.fcgi?rettype=fasta&retmode=xml&db=' + self.db + '&id=' + id
			filename = self.path + '/' + id + '.xml'
			if(not os.path.exists(filename)):
				subprocess.call([
					'curl',
					'-X',
					'GET',
					'-o', filename,
					url
				])
			self.saveItem(id)
		except:
			if(retries < 5):
				print('\t FETCH AGAIN: (', retries, ') ', id)
				time.sleep(100)
				return self.fetch(id, retries+1)
			

	def search(self, retries=0):
		try:
			params = {
				'retmode': 'json',
				'db': self.db,
				'term': self.term,
				'retmax': self.pagination['retmax'],
				'retstart': self.pagination['retstart'],
			}
			res = requests.get(ENTREZ + '/eutils/esearch.fcgi' , params=params)
			result = res.json()['esearchresult']
			if('idlist' in result.keys()):
				idlist = result['idlist']    
			self.pagination['count'] = int(result['count'])
			return idlist
		except:
			if(retries < 5):
				print('\t SEARCH AGAIN: (', retries, ') ', self.pagination['page'])
				time.sleep(100)
				return self.search(retries+1)
			
	def paginate(self):
		self.pagination['page'] = 1
		self.pagination['total'] = math.ceil(self.pagination['count']/self.pagination['retmax'])

	def nextPage(self):
		self.pagination['page'] += 1
		self.pagination['retstart'] += self.pagination['retmax']
		print('NEXT PAGE >>', self.pagination['page'])

	def saveItem(self, id, retries=0):	
		try:
			data = {
				'term': self.term,
				'id': id
			}
			headers = {
				'Content-type': 'application/json',
				'Accept': 'application/json'
			}

			try:
				parser = Parser('/../' + self.db + '/xml/depressive/' + id + '.xml')
				parser.parse()
			except:
				os.remove(self.path + '/' + id + '.xml')
				return
				
			requests.post(url = API + '/publications', data = json.dumps({'publication': parser.dict}), headers = headers) 

			File.cls()
			total = self.pagination['current']/self.pagination['count'] * 100
			print('\t<<< MINING >>>')
			print('\tTOTAL:', self.pagination['count'])
			print('\tDONE:', self.pagination['current'])
			print('\tPAGE:', self.pagination['page'])
			print('\tPMC:', id)
			print('\tPROGRESS:', round(total, 3), '%')
			self.pagination['current'] += 1
		except:
			if(retries < 5):
				print('\t SAVE AGAIN: (', retries+1, ') ', id)
				time.sleep(100)
				self.saveItem(id, retries+1)
			return