#Grasp.js

### Summmary

`Grasp.js` is a general purpose frontend utility that is meant to provide
functionality similiar to jQuery, along with basic implementations of features
popular with frameworks such as template rendering.


### Templates

Templates are declared in HTML using the `data-grasp-template` attribute. `Grasp.js` supports multiple templates on one page, and you differentiate them
by the value you pass to `data-grasp-template`;

```html
    <div data-grasp-template='main'>
      <!-- rendered content would appear here -->
      <h1> ${title} </h1>
    <div>
```

`Grasp.js` uses the same syntax that string templates in ES6 use for interpolation (also the same syntax Ruby uses). There are three steps to creating and rendering a template. The first is to delcare it

```js
var template = grasp.tempalte('main');
```

After you declare the template you inject data using the `digest` method.
The name passed as the first argument will act as a scope for the content,
so that you can implement multiple scopes in one template (coming soon).

```js
var content = {title: "The time is: " + new Date()}
template.digest('main', content);
```

After the data has been processed, you call `render` to actually edit the template bindings

```js
template.render();
```

### Repeats

`Grasp.js` can iterate through a Javascript model and build up a repatitive DOM structure based on your model, much like Angular's `ng-repeat` feature. If a property passed to `template.digest()` is an array it will be treated as a repeat structure. You use `data-repeat` to declare a repeat within a `data-grasp-template`. Below is an example.

```html
  <div data-grasp-template='main'>
    <h1 class='greeting'> Welcome, ${user}!</h1>
    <h3> Here are your tasks for today <h3>
    <ul class='task-list'>
      <li data-repeat='task in tasks'>
        <h4> ${task.title} </h4>
        <p> ${task.description} </p>
      </li>
    </ul>
```

You declare `data-repeat` on the HTMLElement you want to repeat, not on it's parent. The above example would iterate through all the objects in the array `tasks`. When iterating over an array of objects you use the `item in items` format in the data-repeat declaration, where `items` is the array and `item` is any identifier you'd like to use to represent the object itself.
