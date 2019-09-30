from Mining import Mining
from Parser import Parser
import os
from utils import *

mining = Mining('depressive', 'pmc')
mining.start()

'''
pmc = '/../pmc/xml/depressive/'
path = os.path.dirname(__file__) + pmc
parser = Parser(pmc + '6731049.xml')
print(parser.parse())

'''

'''

err = 0
ok = 0
for root, directories, files in os.walk(path):
    for file in files:
        if '.xml' in file:
            cls()
            print('PMC', file)
            parser = Parser(pmc + file)     
            json = parser.parse().toJson()
            if not parser.dict['affiliations']:
                err += 1
                print('err', err)
                log(json)
            else:
                ok += 1
                print('ok', ok)
        
print('FIM OK:', ok, 'err:', err)
'''
