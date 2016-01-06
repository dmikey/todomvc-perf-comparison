var noop = function () {};
var constants = require('../constants');
var store = require('../stores/todo');

console.log('controlller');

// double click to edit a todo
document.addEventListener('dblclick', function (event) {
    var target = event.target;

    if (target.className.indexOf('todolabel') > -1) {
        // show the edit field
        var li = target.parentNode.parentNode;
        li.className += ' editing';

        // set focus to the input field
        var edit = li.querySelector('.edit');
        edit.focus();

        // remove the edit field when focus lost
        edit.addEventListener('focusout', function () {

            // remove this listener
            edit.removeEventListener('focusout');
            li.className = '';

            target.innerHTML = edit.value;
            store.update(li.getAttribute('data-index'), {
                label: edit.value
            }, false)
        });
    }
});

// click targets
document.addEventListener('click', function (event) {
    var target = event.target;

    // clear completed items
    if (target.id === 'clear-completed') {

        store.delete(store.find({
            status: 'completed'
        }));
        
        return;
    }

    if (target.id === 'toggle-all') {
        // get all todos from the store
        var todos = store.get();
        var status = target.checked ? 'completed' : '';

        // set view meta data we want before the store
        // notifies the view of updates to items
        store.viewstate.toggleall = target.checked ? 'checked' : '';

        // update all the todos to be completed
        for (var i = 0; i < todos.length; i++) {
            store.update(i, {
                status: status
            }, false)
        }

        store.dispatch();

        return;
    }

    // if the toggle checked
    if (target.className.indexOf('destroy') > -1) {
        // update the store
        var li = target.parentNode.parentNode;
        store.delete(li.getAttribute('data-index'));
        
        return;
    }

    // if the toggle checked
    if (target.className.indexOf('toggle') > -1) {

        // update the store
        var li = target.parentNode.parentNode;
        var status = target.checked ? 'completed' : '';

        // set the class on the DOM for animated strike through
        li.className = status;

        store.update(li.getAttribute('data-index'), {
            status: status
        }, false);

        store.viewstate.toggleall = false;
        if (store.length() === store.find({
                status: 'completed'
            }).length && store.length() !== 0) {

            store.viewstate.toggleall = true;
        }
        
        var toggleall = document.getElementById('toggle-all');
        if(store.viewstate.toggleall) {
            toggleall.setAttribute('checked','checked');
        } else if(toggleall.hasAttribute('checked')) {
            toggleall.removeAttribute('checked');
        }
    }
}, false);

// look for enter key
window.addEventListener('keypress', function (event) {
    if (event.keyCode === constants.ENTER_KEY) {
        if ('new-todo' === event.target.id) {
            //new todo
            var todo = event.target.value;
            
            store.add({
                label: todo
            });
            
            event.target.value = '';
            return;
        }
        
        if (event.target.className.indexOf('edit') > -1) {
            event.target.blur();    
        }
        
        return;
    }
}, false);

// check for escape key
window.addEventListener('keyup', function (event) {
    if (event.keyCode === constants.ESCAPE_KEY) {

    }
}, false);

// exportable api
module.exports = {
    filter: function (query) {
        if (query) {
            store.filter(query);
            store.dispatch();
        } else {
            store.filter();
            store.dispatch();
        }
    },
    translateTodos: function (todos) {
        // creates an array of todos from the store
        var ToDo = require('../components/todo');
        var components = [];
        for (var i = 0; i < todos.length; i++) {
            // create a todo item
            components.push(new ToDo({
                tag: 'li',
                attributes: {
                    'class': todos[i].status,
                    'data-index': todos[i].index
                },
                status: todos[i].status,
                content: todos[i].label
            }));
        }
        return components;
    }
};