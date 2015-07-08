import './lib/template.js';

var grasp = function(element) {
  return document.querySelector(element);
}

grasp.template = function(name) {
  return new Template(name);

}
