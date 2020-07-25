from datetime import datetime
import os

def log(data):
    date = datetime.now()
    filename = os.path.dirname(__file__) + '/logs/' + date.strftime('%Y-%m-%d') + '.log'
    handle = open(filename, 'a')
    handle.write(date.strftime('%H:%M:%S:: ') + data + '\n')