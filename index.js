

var grasp = function grasp(element) {

  function GraspElement(element) {

    var _this = this;
    this.state = {};
    this.rootNode = document.querySelector(element);

    /**
     * Takes in an array, string, or object and appends
     * the data to the rootNode
     * @param  {Object|String|Array} element the content to append
     * @return null
     */

    this.append = function append(elements) {

      if (typeof elements === 'string') {
        var container = document.createElement('tr');
        container.innerHTML = elements;
        _this.rootNode.appendChild(container.firstChild);
      }

      else if (Array.isArray(elements)) {
        elements.forEach(function(element) {
          _this.rootNode.appendChild(element);
        })
      }
    }
  }

  return new GraspElement(element);

};


/**
 * takes a data object and a template string and returns
 * an array of HTMLElements built using the #{} string
 * interpolation
 *
 *
 * @param  {String} name           name of the data-grasp-template
 * @return {Template}              a grasp Template instance
 */

grasp.template = function template(name) {
  return new Template(name);
};



/**
 * Template is a constructor for the grasp template structure. It
 * parses all HTMLElements with the data-grasp-template attribute
 * and finds the element with the matching data value. If no matching
 * template is found, an error is thrown
 *
 * It then walks the template tree and finds any bindings. These are then
 * cached on the template object itself so it will know what values are being
 * bound when it is digested and rendered.
 * @param {String} name the value passed to data-grasp-template
 * @constructor
 * @private
 */
function Template(name) {

  var slice = Array.prototype.slice;
  var _this = this;
  this.state = {};
  this.name = name;
  this.bindings = {};
  this.repeatStructures = {};

  /* query for all data-grasp-template HTMLElements */
  var templates = slice.call(document.querySelectorAll('[data-grasp-template]'), 0);

  /* Find the template that matches the passed template name */
  for (var i = 0; i < templates.length; i++) {
    var templateName = templates[i].getAttribute('data-grasp-template');
    if (templateName === name) this._templateRoot = templates[i];
  }

  if (!this._templateRoot) throw new Error('No template found for ' + name);
  walkTemplateTree(this._templateRoot, parseRepeatStructure);


  /**
   * internal function for visiting all dom elements in the template tree
   * and parsing out any potential bindings. It will build a list of all
   * the declared template bindings by matching the #{} syntax.
   *
   * That list is then used when digesting the template data, so it knows which
   * properties are going to need to be digested. It does this using recursion
   *
   * @param  {HTMLElement} parent the root HTMLElement for the tempalate
   * @private
   */
  function walkTemplateTree(parent, modifier) {

    var children = slice.call(parent.children, 0);
    children.forEach(function(child) {
      if (modifier) modifier(child);
      /* Match all template strings for the child elements */
      var potentialBindings = child.innerText.match(/#{[\w]+}/gim);
      /* If any exist, iterate and push any new binding declarations to this.binding */
      if (potentialBindings) {
        potentialBindings.forEach(function(bind) {
          var binding = _this.bindings[bind] = {};
          binding.element = child;

        })
      }
      /* Invoke recursively until no children are avaialble */
      if (child.children) walkTemplateTree(child);
      else if (modifier) modifier(parent);
    });
  }

  /**
   * determines whether an HTMLElement has the data-repeat attribute
   * which is used to declare the root of repeat templates. If it does
   * split the declared value. The first part should be the data source
   * in the state of the template, and the second the identifier for each
   * element in the series
   * @param  {HTMLElement} element
   * @private
   */

  function parseRepeatStructure(element) {
    if (!element.hasAttribute('data-repeat')) return;
    var repeat = element.getAttribute('data-repeat').split(' as ');
    var source = repeat[0];
    var identifier = repeat[1];
    _this.repeatStructures[source] = {
      identifier: identifier,
      root: element,
      template: element.children
    }
  }

}

Template.prototype.digest = function digest(name, data) {

  var _this = this;

  if (!this._templateRoot) throw new Error('Digest called on unbound template');

  digestBindings(data);

  function digestBindings(obj) {
    console.log(obj);
    var keys = Object.keys(obj);
    keys.forEach(function(key) {

      var bind = '#{' + key + '}';
      console.log(bind);
      if (_this.bindings[bind]) {
        var binding = _this.bindings[bind];
        binding.value = data[key];
      }
    })
  }
};


/**
 * take the parsed data-template and the digested data bindings
 * and render them to the DOM elements.
 * @function
 * @return {null} NA
 */
Template.prototype.render = function render() {

  var _this = this;

  /* Wait until the DOM is loaded to begin client-side templating */
  document.addEventListener('DOMContentLoaded', function() {
    Object.keys(_this.bindings).forEach(function(key) {
      var binding = _this.bindings[key];
      binding.element.innerText = binding.value;
    })
  })
};
