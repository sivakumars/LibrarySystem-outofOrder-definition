/*  Algorithm for LibrarySystem dependencies are loaded out of order.
===========================================================================================   
  libraryStore -- to store the library modules.
  libraryDependenciesMap -- to track the dependencies of the libraries and their callback functions.
  If library invoked with -- (name , dependencies , callback that return library) { 
    if it has dependencies {
      check if all the dependent libraries are already loaded (i.e ., present in the libraryStore).
        If yes, invoke the callback with the dependencies and store it in libraryStore.
        otherwise
         store the (list of dependencies and callback function) as an object in a ||Map||,
         with the name as the key.
    }
    if no  dependencies{
      just execute/invoke the callback function and store the library in the libraystore
    }
  }
  Else,Library invoked with -- (name) {
    if libraryStore already has a value/module loaded 
      return the libraryStore[name]
    else
      if ||Map|| has a property with (name) 
        get the Object { deps:[..., ..., ...], callback: f}
        #########
            If each of the dependencies have dependencies , recurse through each dependency and get the module.
        #########
        invoke the callback with the dependencies array and store the return value in library store.
        return libraryStore
  }
######################################################################################################
Recursion :  Base case : Library without dependencies 
             Recursive case : Library with dependencies that have dependencies (Nested dependencies)
######################################################################################################
*/
(function(root){
  var libraryStore={};
  var libraryDependencyMap = {};

  var librarySystem = function(libraryName, dependencies, callbackFn){
    if(arguments.length > 1) {
      if(!Array.isArray(dependencies)) {
        throw new TypeError('The second parameter should be of type Array');
      }
      if(Object.keys(dependencies).length > 0) {
        createLibraryStore(dependencies, libraryName, callbackFn);
      }else {
        libraryStore[libraryName] = callbackFn.apply(this);
      }
    }else {
      if(!libraryName) {
        return undefined;
      }
      var module = getLibraryModule(libraryName);
      if(module) {
        return module;
      }else {
        throw new Error('Missing library or its dependencies: ' + libraryName);
      }
    }
  };

  function createLibraryStore(dependencies, libraryName, callbackFn) {
    var allDependenciesLoadedFlag = dependencies.every(function(item) {
            return libraryStore.hasOwnProperty(item) && libraryStore[item];
          });
    if(allDependenciesLoadedFlag) {
      libraryStore[libraryName] = callbackFn.apply(this, getDependentModules(dependencies));
    }else {
      libraryDependencyMap[libraryName] = {
        dependentModuleNames : dependencies,
        getModule: callbackFn  
      } 
    }
  }

  function getLibraryModule(libraryName) {
    if(libraryStore[libraryName]) {
        return libraryStore[libraryName];
    }else if(libraryDependencyMap.hasOwnProperty(libraryName)) {
      var libraryModule = libraryDependencyMap[libraryName];
      var deps = getDependentModules(libraryModule.dependentModuleNames);
      libraryStore[libraryName] = deps.length > 0 ? libraryModule.getModule.apply(this, deps) : undefined;
      return libraryStore[libraryName];
    }
  }

  function getDependentModules(dependencies) { 
    var dependentModules = [];
    dependencies.forEach(function(libraryModuleName) {
      var module = libraryStore[libraryModuleName];
      if(module) {
        dependentModules.push(module);
      }else {
        dependentModules.push(getLibraryModule(libraryModuleName));
      }
    });
    return dependentModules;
  }
  
  root.librarySystem = librarySystem;
})(window);