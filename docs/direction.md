# Development Design and Structure

## Outline
This document is meant to outline the ideal design for the application's interface and internal structure, providing a nice reference point for *what* needs to be implemented so any developer (i.e., myself) can visualize *how* to implement it

## Internal structure

### Code Example

Given the following HTML:

```html
  <div data-grasp-template='main' class='container'>

    <div class='header'>
      <h1 class='title'> Welcome to ${title}, on ${date}! </h1>
      <h3 class='sub-title'> ${subtitle} </h3>
      <span> ${time} </span>
    </div>

    <div class='post-container'>
      <div class='post' data-repeat='post in posts'>
        <h4 class='post-title'> ${post.title} </h4>
        <p class='post-content'> ${post.content} </p>
        <span> ${time} </span>
      </div>
    </div>

  </div>
```

We should have the following internal `Grasp.js` state:

```js



  {
    /* Scoping is accomplished through nested objects */
    'main' : {

      /* The root property is the root HTMLElement of the template */
      'root': div.container,
      'hash': 0


      '${title}': {
        'elements': [h1.title]
      },

      '${date}': {
        'elements': [h3.sub-title]
      },

      '${subtitle}': {
        'elements': [div.sub-title]
      }

      '${time}': {
        'elements': [span, span]
      }

      'posts': {
        '_repeats' : []
      }
    }
  }


```

Each binding is set as a property on an object, which corresponds to the template itself.

Bindings are scoped by the template they are within. This means you cannot use the same bindings for different data within the same template, e.g., ${title} can only be bound once within a template. Future development may implement scoping within templates, but we'll see.

 This structure will allow us to form potential bindings from the keys of the passed data object(s) and then just use those to access the corresponding `HTMLElement` in the data structure. The binding process will create those potential bindings, check this data structure to see if they are valid, and if so attach the corresponding value to the element.

For example, with the above template, lets say we instantiated it as follows:

```js
/* Create the template */
var template = grasp.template('main');

/* Bind the data */
template.bind({
  title: 'My Test Website'
  subtitle: 'This is for some tests.',
  time: Date.now(),
  date: new Date();
  posts: [
    {title: 'My first post', content: 'This is where the content goes'},
    {title: 'My second post', content: 'This is also where the content goes'}
  ]
})

```


It would bind the values to the data structure like so:

```js



  {
    /* Scoping is accomplished through nested objects */
    'main' : {

      /* The root property is the root HTMLElement of the template */
      'root': div.container,
      'hash': 0,


      '${title}': {
        'elements': [h1.title],
        'value': 'My Test Website'
      },

      '${date}': {
        'elements': [h3.sub-title],
        'value': 'Thu Jul 09 2015 19:45:30 GMT-0500 (CDT)'
      },

      '${subtitle}': {
        'elements': [div.sub-title],
        'This is for some tests.'
      }

      '${time}': {
        'elements': [span, span],
        'value': '1436481950037'
      }

      'posts': {
        '_repeats' : []
      }
    }
  }


```
