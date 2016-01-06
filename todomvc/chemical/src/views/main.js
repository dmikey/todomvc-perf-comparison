//import components
var Component = require('componently');

var Header = require('../components/header'),
    Main = require('../components/main'),
    Todo = require('../components/todo'),
    Footer = require('../components/footer');

var Controller = require('../controllers/todo');

// declare and name components for exporting
// chemical does NOT do this by default, YOU decide
// when you need this
var components = {
    header: new Header({}),
    main: new Main({
        content: []
    }),
    footer: new Footer({
        itemsleft: 0
    })
};

// compose view
var container = new Component({
    components: [
        components.header,
        components.main,
        components.footer
    ]
});

document.addEventListener('todo-store-updated', function (event) {
    
    // listen for the store to be updated
    var store = event.store;
    var viewstate = store.viewstate;

    // toggle all view state
    viewstate.toggleall = false;
    if (store.length() === store.find({
            status: 'completed'
        }).length && store.length() !== 0) {
        // all items are checked or unchecked?

        viewstate.toggleall = true;
    }

    // update the view components
    components.footer.itemsleft = store.find({
        status: ''
    }).length;

    components.main.update({
        components: Controller.translateTodos(store.get()),
        toggleall: viewstate.toggleall ? 'checked' : ''
    });

    // ask the container to update it's DOM reference
    container.update();

    document.getElementById('new-todo').focus();
}, false);

// export reference to the components we need
container.$ = components;

// we want to export our components
module.exports = container;