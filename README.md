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
      <h1> #{title} </h1>
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
