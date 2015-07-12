import walk from 'findit';

export function _sortModules(modules) {
  return modules.sort((a, b) => {
    return (a.module.priority || 0) - (b.module.priority || 0);
  });
}

export function _processModules(modules, app, express) {
  const sortedModules = _sortModules(modules);
  for (let i = 0; i < sortedModules.length; i++) {
    const module = sortedModules[i];
    module(app, express);
  }
}

export function _processFilename(modules, filename) {
  if (filename.split('.').last() === 'js' && filename !== __filename) {
    let name = filename.replace('.js', '');
    name = name.replace(__dirname, '.');

    modules.push(require(name));
  }
}

export default function loadRoutes(app, express, dir = __dirname) {
  const modules = [];

  const walker = walk(dir);
  walker.on('file', (file, stat) => {
    _processFilename(modules, file);
  });
  walker.on('end', () => {
    _processModules(modules, app, express);
  });
}
