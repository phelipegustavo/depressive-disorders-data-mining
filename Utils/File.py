import pathlib
import os

def createPath(path):
    pathlib.Path(path.lower()).mkdir(parents=True, exist_ok=True) 
    return path.lower()

def cls():
    os.system('cls' if os.name=='nt' else 'clear')