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
  /* Helper methods and name declaration */
  var slice = Array.prototype.slice;
  var _this = this;
  this.name = name;

  /* Raw undigested data */
  this.data = {};

  /* Digested data ready to be bound */
  this.digests = {};
  this.digests.repeats = {};

  /* Bindings ready to be rendered */
  this.bindings = [];

  /* query for all data-grasp-template HTMLElements */
  var templates = slice.call(document.querySelectorAll('[data-grasp-template]'), 0);

  /* Find the template that matches the passed template name */
  for (var i = 0; i < templates.length; i++) {
    var templateName = templates[i].getAttribute('data-grasp-template');
    if (templateName === name) this._templateRoot = templates[i];
  }

  if (!this._templateRoot) throw new Error('No template found for ' + name);
  walkTemplateTree(this._templateRoot);


  /**
   * internal function for visiting all dom elements in the template tree
   * and parsing out any potential bindings. It will build a list of all
   * the declared template bindings by matching the #{} syntax.
   *
   * If an element uses the data-repeat attribute, it will be parsed
   * differently. It will be removed from the DOM and saved in the template
   * property of the repeatStructure. This will then be used with cloneNode
   * to map an Array of data to the corresponding HTMLElements
   *
   * That list is then used when digesting the template data, so it knows which
   * properties are going to need to be digested. It does this using recursion
   *
   * @param  {HTMLElement} parent the root HTMLElement for the tempalate
   * @private
   */
  function walkTemplateTree(parent) {

    var children = slice.call(parent.children, 0);
    if (!children.length) return;

    children.forEach(function(child) {

      if (child.hasAttribute('data-repeat')) {
        var repeat = child.getAttribute('data-repeat').split(' as ');
        var source = repeat[0];
        var digest = _this.digests.repeats[source] = {};
        digest.parent = child.parentNode;
        digest.template = child.parentNode.removeChild(child);
        digest.indentifier = repeat[1];
        return;
      };

      /* Match all template strings for the child elements */
      var potentialBindings = child.innerText.match(/#{[\w|\.]+}/gim);
      /* If any exist, iterate and push any new binding declarations to this.binding */
      if (potentialBindings) {
        potentialBindings.forEach(function(bind) {
          var bind = bind.replace(/\W/gim, '');
          var digest = _this.digests[bind] = {};
          digest.element = child;
        })
      }
      /* Invoke recursively until no children are avaialble */
      if (child.children) walkTemplateTree(child);
    });
  }

}

/**
 * digest is the main method used to interpolate data and
 * template bindings. It takes a name, which is a string indicating
 * a scope for the data, and an Array or Object which populates that
 * scope
 *
 * It iterates through the parsed bindings on the template instance
 * populates any matches with the data passed in. The data properties
 * must match the name of the property in the template bind (i.e., if
 * you use #{name} in a template, the corresponding property must be
 * called name).
 *
 * @param  {Array|Object} data template content
 */
Template.prototype.digest = function digest(data) {

  var _this = this;
  if (!this._templateRoot) throw new Error('Digest called on unbound template');
  /* Localize the digests from the template init */
  var digests = this.digests;
  var repeats = digests.repeats;
  /* Match the data against the digests, handle repeats */
  Object.keys(data).forEach(function(key) {
      /* Pass the repeats object to the helper function for repeat data */
      if (repeats[key]) {
        digestRepeatData(data[key], repeats[key]);
        return;
      }

    })

  function digestRepeatData(data, repeat) {

    var parent = repeat.parent;
    var indentifier = repeat.indentifier;

    data.forEach(function(item) {
      var props = Object.keys(item).map(function(prop) {
        var binding = '#{' + indentifier + '.' + prop + '}';
        var node = repeat.template.cloneNode(true);
        var value = item[prop];
        parent.appendChild(node);
        _this.bindings.push({binding: binding, node: node, value: value});
      });

    })
  }
}




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
    _this.bindings.forEach(function(binding) {
      var text = binding.node.innerText;
      console.log(binding);
    })
  })

};
