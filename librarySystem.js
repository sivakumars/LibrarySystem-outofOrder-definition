(function(root){
  var libraryStore = {};
  var librarySystem = function(name, dependencies, callbackFn) {
    if(arguments.length > 1) {
      var dependencyModules = [];
      if(Array.isArray(dependencies) && dependencies.length > 0) {
        dependencies.forEach(function(dependencyName) {
          var value = libraryStore[dependencyName];
          dependencyModules.push(value);
        });
      }
      libraryStore[name] = callbackFn.apply(this, dependencyModules);
    }else{
      return libraryStore[name];
    }
  } 
  root.librarySystem = librarySystem;
})(window);