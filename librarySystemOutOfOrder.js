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
  /*
    Throw an error if the dependencies are not of the array type.
    If the dependencies length is greater than zero , Store the meta details of the libray 
    like the dependency names and the callbackfunction used to get thelibrary module.
    Else, Invoke the Callback function and store the library module in the library Store.

    To retrieve a module, invoke library system with just the name as a parameter.
    if the module returned is valid , return it , Else, throw an error of missing library.
  */
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
  /*
    A method to create a store of library modules or store meta information of library dependencies.
    If the library Store has all the dependencies already loaded, then just invoke the callback function.
    Else, Store the meta info of the library in a map - libraryDependencyMap 
  */
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
  /*
  * A method to get the library modules from the library store.

  * If libraryStore already has a value/module loaded , return the libraryStore[name]
  
  * Else, Iterate through the libraryDependencyMap to get the meta details of the library
    and loop through the dependencies to get the dependent library modules and recurse if there
    are nested dependencies.
  */
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