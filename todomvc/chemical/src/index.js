// import helpers
var PathParser = require('pathparser');
var router = new PathParser;

// load the stored todos

var store = require('./stores/todo');
store.load();

// render view
var MainView = require('./views/main');
var target = document.querySelector('#todoapp');
MainView.renderInto(target);

router.add('/', function () {
    // set the filter which will also call the 
    // store dispatch
    MainView.$.footer.setActiveFilter('all');
});

router.add('/active', function () {
    MainView.$.footer.setActiveFilter('active');
});

router.add('/completed', function () {
    MainView.$.footer.setActiveFilter('completed');
});

function hashChange(){
    var hash = location.hash.replace('#', '');
    if (hash.length === 0) hash = '/';
    router.run(hash); 
}

window.onhashchange = hashChange;

hashChange();