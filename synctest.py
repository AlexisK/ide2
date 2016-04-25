from sys import argv
from distutils.dir_util import copy_tree
import os, re, json


def fastRead(path):
    fl = open("./sync/{}".format(path), 'r')
    s = fl.read()
    fl.close
    return s

def fastWrite(path, content):
    fl = open('./sync/{}'.format(path), 'w')
    fl.write(str(content))
    fl.close

def mksdir(path):
    npath = "./sync/{}".format(path)
    if not os.path.exists(npath):
        os.makedirs(npath)

def mksdir2(path):
    mksdir("from/{}".format(path))
    mksdir("to/{}".format(path))


def scenario():
    mksdir2('js')
    mksdir2('css')
    mksdir2('html')
    mksdir2('js/engine')
    mksdir2('js/project')
    mksdir2('js/jollix')
    fastWrite('from/js/engine/fl1.txt',7)
    fastWrite('to/js/engine/fl1.txt',3)
    fastWrite('from/version', 5)
    fastWrite('to/version', 2)
    print("done scenario")



def bckp(path, tover):
    ver = fastRead('{}/version'.format(path))
    if ver < tover:
        print "backup ver {}".format(ver)
        mksdir("{}/backup".format(path))
        mksdir("{}/backup/{}".format(path,ver))
        mksdir("{}/backup/{}/js".format(path,ver))
        mksdir("{}/backup/{}/js/engine".format(path,ver))
        copy_tree("./sync/{}/js/engine".format(path), "./sync/{}/backup/{}/js/engine".format(path,ver))
        return True
    return False

def sync(src, dest):
    ver = fastRead('{}/version'.format(src))
    needCopy = bckp(dest, ver)
    if needCopy:
        print "fetching ver {}".format(ver)
        copy_tree("./sync/{}".format(src), "./sync/{}".format(dest))




scenario()


sync('from', 'to')
print("done")
print("")

