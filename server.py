from sys import argv
from distutils.dir_util import copy_tree
import os, re, json
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web


config = {
    'path': ['/home/alexisk/Downloads/development/projects/IDE'],
    'ignore': ['ace-noconflict'],
    'pathMaps': [],
    'sizeLimit': 5242880
}



def processPathItem(path):
    config.get('pathMaps').append(path_to_dict(path))

def path_to_dict(path):
    b = os.path.basename(path)
    if b in config['ignore']:
        return None
    
    d = {'name': b}
    if os.path.isdir(path):
        if len(d['name']) == 0:
            d['name'] = os.path.dirname(path)
        d['type'] = "directory"
        d['children'] = [path_to_dict(os.path.join(path,x)) for x in os.listdir(path)]
    else:
        d['type'] = "file"
        d['fullPath'] = path
    return d

def path_to_dict_single(pathGlob):
    result = {
        'dir':[],
        'file':[]
    }
    for item in os.listdir(pathGlob):
        path = os.path.join(pathGlob,item)
        base = os.path.basename(path) or os.path.dirname(path)
        if not base in config['ignore']:
            if os.path.isdir(path):
                result['dir'].append(path)
            else:
                result['file'].append(path)
    
    return result



def buildTree():
    config['pathMaps'] = []
    map(processPathItem, config.get('path'))


def file_get_contents(filename):
    with open(filename) as f:
        return f.read()

def file_set_contents(filename, content):
    final = open(filename, 'w')
    final.write(content.encode('utf8'))
    final.close()


def fastRead(path):
    fl = open("{}".format(path), 'r')
    s = fl.read()
    fl.close
    return s

def fastWrite(path, content):
    fl = open('{}'.format(path), 'w')
    fl.write(str(content))
    fl.close


def mksdir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def fetchVer(path, newSource, backOld, comp):
    ver = fastRead('{}/version'.format(path))
    sver = fastRead('{}/version'.format(newSource))
    
    if backOld:
        print "backup ver {}".format(ver)
        np = "{}/backup".format(path)
        mksdir(np)
        np = "{}/{}".format(np,ver)
        mksdir(np)
        djs = "{}/js".format(np)
        mksdir(djs)
        dcss = "{}/css".format(np)
        mksdir(dcss)
        djs1 = "{}/engine".format(djs)
        mksdir(djs1)
        djs2 = "{}/jollix".format(djs)
        mksdir(djs2)
        dcss1 = "{}/engine".format(dcss)
        mksdir(dcss1)
        copy_tree("{}/libs/js/engine".format(path), djs1)
        copy_tree("{}/libs/js/jollix".format(path), djs2)
        copy_tree("{}/libs/css/engine".format(path), dcss1)
    
    copy_tree("{}/libs/css/engine".format(newSource), "{}/libs/css/engine".format(path))
    copy_tree("{}/libs/js/engine".format(newSource), "{}/libs/js/engine".format(path))
    copy_tree("{}/libs/js/jollix".format(newSource), "{}/libs/js/jollix".format(path))
    
    if comp:
        os.system("cd {} && python frontGenerator.py".format(path.replace(' ', '\ ')))
    
    fastWrite('{}/version'.format(path), sver)
    print "ver {} for {}".format(sver, path)



class WSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print "WebSocket opened"

    def on_message(self, message):
        data = json.loads(message)
        try:
            self.handle(data['command'], data)
        except:
            self.close()
        

    def on_close(self):
        print "WebSocket closed"
    
    def check_origin(self, origin):
        print origin
        if origin == 'null':
            return True
        if origin == 'file://':
            return True
        return False
    
    def sendFormated(self, command, data):
        self.write_message(json.dumps({'command':command,'data':data}))
    
    def handle(self, command, data):
        print(command)
        
        
        
        if command == 'listOs':
            self.sendFormated('listOs', config['pathMaps'])
            
        elif command == 'reqFile':
            if not os.path.isfile(data['path']):
                self.sendFormated('notFound', { 'path':data['path']})
                return 0
            size = os.path.getsize(data['path'])
            
            if size <= config['sizeLimit']:
                try:
                    content = file_get_contents(data['path'])
                    newData = {'content':content, 'path':data['path'], 'size':size}
                    self.sendFormated('reqFile', newData)
                except:
                    self.sendFormated('notify', 'Filed to open {}'.format(data['path']))
            else:
                self.sendFormated('notify', '{} has size {}b. Opening denied by server settings.'.format(data['path'], size))
            
        elif command == 'saveFile':
            file_set_contents(data['path'], data['content'])
            self.sendFormated('saveFile', {'msg':'{} saved.'.format(data['path']),'path':data['path']})
            
        elif command == 'setProject':
            config['path'] = []
            
            for path in data['path']:
                if os.path.isdir(path):
                    #config['path'].append(path)
                    resp = path_to_dict_single(path)
                    resp['path'] = path
                    self.sendFormated('listDir', resp)
                else:
                    self.sendFormated('notify', '{} is not a folder!'.format(path))
            #buildTree()
            #self.sendFormated('listOs', config['pathMaps'])
            
        elif command == 'listDir':
            if os.path.isdir(data['path']):
                resp =  path_to_dict_single(data['path'])
                resp['path'] = data['path']
                self.sendFormated('listDir', resp)
        
        elif command == 'syncTargeted':
            src = data['src']
            target = data['target']
            print src
            print target
            fetchVer(target, src, data['backOld'], data['compile'])
            self.sendFormated('notify', 'synchronize {} success!'.format(target))
        
        elif command == 'compileTarget':
            os.system("cd {} && python frontGenerator.py".format(data['path'].replace(' ', '\ ')))
        
        elif command == 'iterVersion':
            path = data['path']
            ind = int(data['ind'])
            ver = fastRead('{}/version'.format(path)).split('.')
            
            for i in xrange(len(ver), ind+1):
                ver.append('0')
            
            ver[ind] = str(int(ver[ind])+1)
            newVer = '.'.join(ver)
            fastWrite('{}/version'.format(path), newVer)
            
            newData = {'content':newVer, 'path':'{}/version'.format(path), 'size':os.path.getsize(path)}
            self.sendFormated('reqFile', newData)





application = tornado.web.Application([
    (r"/websocket", WSHandler),
])


if __name__ == "__main__":
    buildTree()
    
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(17864)
    tornado.ioloop.IOLoop.instance().start()
















