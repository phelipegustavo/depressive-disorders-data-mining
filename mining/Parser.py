import json
from utils import *
import pprint
import xmltodict
import os
import xml.etree as ET


class Parser:

    def __init__(self, path):
        self.path = os.path.dirname(__file__) + path
        self.dict = {}


    def openFile(self):
        handle = open(self.path, 'r')
        self.content = handle.read()
        self.tree = read_xml(self.path, False)
        handle.close()
    
    def toJson(self):
        return json.dumps(self.dict)
        
    def parse(self):
        self.openFile()

        # Title
        tree_title = self.tree.find('.//title-group/article-title')
        title = get_iter_tex(tree_title)
        self.dict['title'] = title

        # Abstract
        try:
            abstracts = list()
            abstract_tree = self.tree.findall('.//abstract')
            for a in abstract_tree:
                for t in a.itertext():
                    text = t.replace('\n', ' ').replace('\t', ' ').strip()
                    abstracts.append(text)
            abstract = ' '.join(abstracts)
        except:
            abstract = ''
        self.dict['abstract'] = abstract

        # Journal
        journal = {}
        journal['title'] = get_text(self.tree, './/journal-title')
        journal['nlmTa'] = get_text(self.tree, './/journal-meta/journal-id/[@journal-id-type="nlm-ta"]')
        journal['isoAbbrev'] = get_text(self.tree, './/journal-meta/journal-id/[@journal-id-type="iso-abbrev"]')
        journal['issn'] = get_atrib_dic(self.tree, './/journal-meta/issn', 'pub-type')
        journal['publisher'] = get_iter_tex_dic(self.tree, './/journal-meta/publisher/publisher-name')
        self.dict['journal'] = journal

        self.dict['pmid'] = get_text(self.tree, './/article-meta/article-id/[@pub-id-type="pmid"]')
        self.dict['pmc'] = get_text(self.tree, './/article-meta/article-id/[@pub-id-type="pmc"]')
        self.dict['doi'] = get_text(self.tree, './/article-meta/article-id/[@pub-id-type="doi"]')
        self.dict['publisherId'] = get_text(self.tree, './/article-meta/article-id/[@pub-id-type="publisher-id"]')
        
        # pubDate
        tree = self.tree.findall('.//article-meta/pub-date')
        pubDate = []
        if tree is not None:
            for e in tree:
                date = {} 
                date['pubType'] = e.attrib['pub-type'] 
                for d in e:
                    if(d.tag in ['year', 'month', 'day']):
                        date[d.tag]= d.text
                pubDate.append(date)
        self.dict['pubDate'] = pubDate

        # keywords
        self.dict['keywords'] = get_text_array(self.tree, './/article-meta/*/kwd')
        
        # elocationId
        self.dict['elocationId'] = get_text(self.tree, './/journal-meta/elocationId')


        # contributors
        tree = self.tree.findall('.//contrib-group/contrib/[@contrib-type]')
        contributors = []
        if tree is not None:
            for e in tree:
                if (e.text is not None):
                    contrib = {}
                    contrib['type'] = e.attrib['contrib-type']
                    contrib['name'] = get_text(e, './/name/*', ', ')
                    contributors.append(contrib)
        self.dict['contributors'] = contributors

        # affiliations
        tree = self.tree.findall('.//aff')
        affiliations = []
        if tree is not None:
            for e in tree:
                aff = {'id': 'aff', 'name': '', 'country': ''}

                try: 
                    aff['id'] = e.attrib['id']
                except:
                    pass

                aff['name'] = get_text(e, './/institution')
                aff['address'] = get_text(e, './/addr-line')
                aff['country'] = get_text(e, './/country')
                
                try:
                    if not aff['name']:
                        aff['name'] = aff['address']
                    
                    if not aff['name']:
                        aff['name'] = [t for t in e.itertext()][-1]
                except:
                    pass

                try:
                    if not aff['country']:
                        if aff['address']:
                            aff['country'] = aff['address'].split(',')[-1].lstrip()
                        elif aff['name']:
                            aff['country'] = aff['name'].split(',')[-1].lstrip()
                except:
                    pass

                affiliations.append(aff)
        self.dict['affiliations'] = affiliations

        try:
            self.dict['country'] = self.dict['affiliations'][0]['country']
        except:
            self.dict['country'] = ''
        
        self.dict['country'] = self.dict['country'].replace('.', '')

        # categories
        self.dict['categories'] = get_text_array(self.tree, './/article-meta/article-categories/*/subj-group/subject')
        
        return self