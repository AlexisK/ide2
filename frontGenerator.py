from sys import argv
import os, re, json


globalScope = None

class Scope(object):
    def __init__(self, scope, name=None, result='result', sourceprefix='.', isHtml=False):
        
        config = '{}/{}'.format(sourceprefix, name or 'config');
        name = name or 'compiled'
        
        self.ext = ".{}".format(scope);
        self.libs = "{}/libs/{}/".format(pathProject, scope)
        self.comp = "{}/{}/".format(pathProject, result)
        self.main = "{}/{}{}".format(pathProject, config, self.ext)
        self.result = "{}{}{}".format(self.comp, name, self.ext)
        self.processed = []
        self.defines = {}
        self.attrs = {}
        self.langdef = {}
        self.isHtml = isHtml
    
    def regIncert(self, obj):
        if obj.group(1) in self.attrs:
            result = self.attrs[obj.group(1)]
        elif obj.group(1) in self.defines:
            result = self.defines[obj.group(1)]
        elif obj.group(1) in globalScope.defines:
            result = globalScope.defines[obj.group(1)]
        else:
            result = '%{}'.format(obj.group(1))
        
        return result
    
    def funcInsert(self, obj):
        return '{}{}('.format(obj.group(1), self.defines['function'] or 'function')






def getLineContent(line, scopePath, spaces=0):
    if scopePath.isHtml:
        result = line
        result = re.sub(r'([^\w])f\(', scopePath.funcInsert, result)
        result = re.sub(r'%(\w+);?', scopePath.regIncert, result)
        
    else:
        result = (line[:line.find('//-')])
        result = re.sub(r'^[\t\ ]+', '', result);
        result = re.sub(r'([^\w])f\(', scopePath.funcInsert, result)
        result = re.sub(r'%(\w+)', scopePath.regIncert, result)
        
        if result != '' and re.match(r'[^;\,]', result[-1:]):
            result += '\n'
    
    return "{}{}".format(' '*spaces, result)



def getFileContents(path, scopePath, spaces=0):
    #print "adding {}".format(path)
    result = ''
    _file = open(path, 'r')
    
    for _line in _file.readlines():
        
        _line_stripped = _line.lstrip();
        _spaces = len(_line) - len(_line_stripped) + spaces
        
        
        if _line == '':
            pass
            
        elif _line_stripped.find('#') == 0:
            mapping = _line_stripped.split(' ', 1)
            directive = mapping[0][1:len(mapping[0])]
            data = mapping[1].replace('\n', '')
            
            if directive == 'include':
                defMap = _line_stripped.replace('\n', '').split(' ', 2)
                newPath = scopePath.libs + defMap[1] + scopePath.ext
                
                
                if len(defMap) > 2 :
                    try:
                        dataMap = json.loads(defMap[2])
                    except:
                        dataMap = defMap[2].split('#')
                    
                    for i in xrange(len(dataMap)):
                         scopePath.attrs['attr_{}'.format(i)] = str(dataMap[i])
                
                
                if scopePath.isHtml:
                    result += getFileContents(newPath, scopePath, _spaces)
                elif not newPath in scopePath.processed :
                    scopePath.processed.append(newPath)
                    result += getFileContents(newPath, scopePath)
                
            elif directive == 'import':
                defMap = data.split(' ')
                insPath = scopePath.libs + defMap[0]
                if os.path.exists(insPath):
                    for _locFile in os.listdir('{}'.format(insPath)):
                        _locFilePath = '{}/{}'.format(insPath, _locFile)
                        if not os.path.isdir(_locFilePath):
                            result += getFileContents(_locFilePath, scopePath)
                
            elif directive == 'def':
                defMap = data.split(' ', 1)
                scopePath.defines[defMap[0]] = defMap[1]
            
            elif directive == 'write':
                defMap = data.split(' ')
                insPath = "{}{}{}".format(scopePath.comp,defMap[0],scopePath.ext)
                final = open(insPath, 'w')
                final.write(result)
                final.close()
                print 'write to {}'.format(insPath)
                result = ''
                
            else:
                result += getLineContent(_line, scopePath)
            
        else:
            result += getLineContent(_line, scopePath, spaces)
    
    return result





def processScope(scope):
    print ""
    compiled = getFileContents(scope.main, scope)
    print 'write {} done...'.format(scope.ext)


def iterVersion():
    vfile = open('{}/version'.format(pathProject), 'r')
    s = vfile.read()
    vfile.close()
    if len(s) == 0:
        s = 0
    else:
        s = int(s)
    s += 1
    vfile = open('{}/version'.format(pathProject), 'w')
    vfile.write(str(s))
    vfile.close()
    print "version {}".format(s)







pathProject = os.path.dirname(os.path.abspath(__file__))
scopes = [Scope('cfg','settings'),Scope('css'),Scope('js'),Scope(scope='html',isHtml=True)]
globalScope = scopes[0]

#for i in os.listdir('{}/templates'.format(pathProject)):
#    scopes.append(Scope('html', i.split('.')[0], 'pages', 'templates', True));


map(processScope, scopes)
#iterVersion()
print ""







