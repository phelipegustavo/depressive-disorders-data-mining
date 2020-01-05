import json
import Utils.Parser as utils
import pprint
import xmltodict
import os

'''
    Parser class contais methods to parse some XML publication to Python dict
'''
class Parser:

    def __init__(self, path):
        self.path = os.path.dirname(__file__) + path
        self.dict = {}

    '''
        Open and read XML file
    '''
    def openFile(self):
        handle = open(self.path, 'r')
        self.content = handle.read()
        self.tree = utils.read_xml(self.path, False)
        handle.close()
    
    '''
        Parse to JSON
    '''
    def toJson(self):
        return json.dumps(self.dict)
        
    '''
        Parse and set dict attribute
    '''
    def parse(self):

        self.openFile()

        # Title
        tree_title = self.tree.find('.//title-group/article-title')
        title = utils.get_iter_tex(tree_title)
        self.dict['title'] = title

        # Article meta
        self.dict['pmid'] = utils.get_text(self.tree, './/article-meta/article-id/[@pub-id-type="pmid"]')
        self.dict['pmc'] = utils.get_text(self.tree, './/article-meta/article-id/[@pub-id-type="pmc"]')
        self.dict['doi'] = utils.get_text(self.tree, './/article-meta/article-id/[@pub-id-type="doi"]')
        self.dict['publisherId'] = utils.get_text(self.tree, './/article-meta/article-id/[@pub-id-type="publisher-id"]')
        # Keywords
        self.dict['keywords'] = utils.get_text_array(self.tree, './/article-meta/*/kwd')
        # ElocationId
        self.dict['elocationId'] = utils.get_text(self.tree, './/journal-meta/elocationId')
        # Categories
        self.dict['categories'] = utils.get_text_array(self.tree, './/article-meta/article-categories/*/subj-group/subject')

        self.getAbstract()
        self.getJournal()
        self.getDate()
        self.getContributors()
        self.getAffiliations() 
        self.getCountry()       
        
        return self

    '''
        Get Abstract Data
    '''
    def getAbstract(self):
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

    '''
        Get Journal Data
    '''
    def getJournal(self):
        journal = {}
        journal['title'] = utils.get_text(self.tree, './/journal-title')
        journal['nlmTa'] = utils.get_text(self.tree, './/journal-meta/journal-id/[@journal-id-type="nlm-ta"]')
        journal['isoAbbrev'] = utils.get_text(self.tree, './/journal-meta/journal-id/[@journal-id-type="iso-abbrev"]')
        journal['issn'] = utils.get_atrib_dic(self.tree, './/journal-meta/issn', 'pub-type')
        journal['publisher'] = utils.get_iter_tex_dic(self.tree, './/journal-meta/publisher/publisher-name')
        self.dict['journal'] = journal
    '''
        Get Publication Date
    '''
    def getDate(self):
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

    '''
        Get Contributors data
    '''
    def getContributors(self):
        tree = self.tree.findall('.//contrib-group/contrib/[@contrib-type]')
        contributors = []
        if tree is not None:
            for e in tree:
                if (e.text is not None):
                    contrib = {}
                    contrib['type'] = e.attrib['contrib-type']
                    contrib['name'] = utils.get_text(e, './/name/*', ', ')
                    contributors.append(contrib)
        self.dict['contributors'] = contributors

    '''
        Get Affiliations data
    '''
    def getAffiliations(self):
        tree = self.tree.findall('.//aff')
        affiliations = []
        if tree is not None:
            for e in tree:
                aff = {'id': 'aff', 'name': '', 'country': ''}

                try: 
                    aff['id'] = e.attrib['id']
                except:
                    pass

                aff['name'] = utils.get_text(e, './/institution')
                aff['address'] = utils.get_text(e, './/addr-line')
                aff['country'] = utils.get_text(e, './/country')
                
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


    '''
        Get Country data
    '''
    def getCountry(self):
        try:
            self.dict['country'] = self.dict['affiliations'][0]['country']
        except:
            self.dict['country'] = ''
        
        self.dict['country'] = self.dict['country'].replace('.', '')