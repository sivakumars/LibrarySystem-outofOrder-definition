/*  Algorithm for LibrarySystem dependencies are loaded out of order.
===========================================================================================		
	libraryStore -- to store the library modules.
	libraryDependenciesMap -- to track the dependencies of the libraries and their callback functions.
	If library invoked with -- (name , dependencies , callback that return library) { 
		if it has dependencies {
			check if all the dependent libraries are already loaded (i.e ., present in the libraryStore).
				If yes, 
     invoke the callback with the dependencies and store it in libraryStore.
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
				invoke the callback with the dependencies array and store the return value in library store.
				return libraryStore
 }
====================================================================================================
*/
(function(root){
	var libraryStore={};
	var libraryDependencyMap = {};

	function getDependentModules(dependencies) { 
		var dependentModules = [];
		dependencies.forEach(function(libraryModule){
			var module = libraryStore[libraryModule];
			if(module) {
				dependentModules.push(module);
			}
		});
		return dependentModules;
	}

	var librarySystem = function(libraryName, dependencies, callbackFn){
  //If librarySystem invoked with -- (name , dependencies , callback that return library).
		if(arguments.length > 1){
			if(!Array.isArray(dependencies)) {
				throw new TypeError('The second parameter should be of type Array');
			}
   //if it has a valid list of dependencies 
			if(Object.keys(dependencies).length > 0) {
    //check if all the dependent libraries are already loaded by tracking a flag(i.e ., present in the libraryStore).
				var dependenciesLoadedFlag = dependencies.every(function(item){
						return libraryStore.hasOwnProperty(item) && libraryStore[item];
					});
    //If dependenciesLoadedFlag is true invoke the callback with the dependencies and store it in libraryStore.
				if(dependenciesLoadedFlag) {
					libraryStore[libraryName] = callbackFn.apply(this, getDependentModules(dependencies));
    //Else,store the (list of dependencies and callback function) as an object in a {Map},with the name as the key.
				}else {
					libraryDependencyMap[libraryName] = {
						dependentModuleNames : dependencies,
						getModule: callbackFn  
					} 
				}
   // If no dependencies, just execute/invoke the callback function and store the library in the libraystore.
			}else {
				libraryStore[libraryName] = callbackFn.apply(this);
			}
  //librarySystem invoked with -- (libraryName) - to retrieve the library module			
		}else {
   //if libraryStore already has a value/module loaded , return the module --libraryStore[name]
			if(libraryStore[libraryName]) {
				return libraryStore[libraryName];
   //if {Map} has a property with (libraryName), get the Object { deps:[..., ..., ...], callback: f}
			}else if(libraryDependencyMap.hasOwnProperty(libraryName)) {
				var libraryModule = libraryDependencyMap[libraryName];
				var deps = getDependentModules(libraryModule.dependentModuleNames);
    //invoke the callback with the dependencies array and store the return value in library store.
				libraryStore[libraryName] = deps.length > 0 ? 
												libraryModule.getModule.apply(this, deps) : undefined;
    //return libraryStore
				return libraryStore[libraryName];
			}
		}
	};
	root.librarySystem = librarySystem;
})(window);