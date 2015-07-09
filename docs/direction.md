# Development Design and structure

## Outline
This document is meant to outline the ideal design for the application's interface and internal structure, providing a nice reference point for *what* needs to be implemented so any developer (i.e., myself) can visualize *how* to implement it

## Internal structure

Given the following HTML:

```html
  <div data-grasp-template='main' class='container'>

    <div class='header'>
      <h1 class='title'> Welcome to #{title} </h1>
      <h3 class='sub-title'> #{subtitle} </h3>
    </div>

    <div class='post-container'>
      <div class='post' data-repeat='post in posts'>
        <h4 class='post-title'> #{post.title} </h4>
        <p class='post-content'> #{post.content} </p>
      </div>
    </div>

  </div>
```

Should correspond to the following Grasp.js template digest:

```js

  {
    'main' : {

      'd773eed4c8' : {
        'parent': div.header,
        'element': h1.title,
        'text': 'Welcome to #{title}',
        'bindings': ['#{title}']
        },

      'bfff93440d': {
        'parent': div.header,
        'element': h3.sub-title,
        'text': '#{subtitle}',
        'bindings': ['#{subtitle}']
        },

      _repeats: {
        'users' {}
      }
    }
  }


```
