# LibrarySystem-outofOrder-definition
A library system  that loads modules with nested dependencies

A library loader - mock implementation

1. Takes care of loading nested dependencies.
2. Libraries can be created/defined out of order before using/loading them

### Test cases:

The library modules are loaded even though they are created **out of order**

```javascript

librarySystem('StudyBlurb', ['name', 'course'], function(name, course) {
  return name + ' studies ' + company;
});

librarySystem('name', [], function() {
  return 'Siva';
});

librarySystem('course', [], function() {
  return 'Javascript';
});


librarySystem('StudyBlurb'); // 'Siva studies Javascript'
```
