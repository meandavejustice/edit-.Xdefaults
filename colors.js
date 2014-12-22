var contentArea = document.querySelector('.defaults');
var uploader = document.querySelector('.upload');
var currentTarget;
var loadSampleLink = document.querySelector('.load-sample');
var exportLink = document.querySelector('.export');

function formatFile(content) {
  contentArea.textContent = '';
  var elements = content.split('\n').map(wrapLine);
  contentArea.appendChild(document.createElement('ul'));
  var lineList = contentArea.querySelector('ul');
  elements.forEach(function(el) {
    lineList.appendChild(el);
  });
}

function checkComment(line) {
  return !!~line.indexOf('!');
}

function parseColor(line) {
  var idx = line.indexOf('#');
  return line.substr(idx, idx+6);
}

function wrapLine(line) {
  var span = document.createElement('li');
  span.textContent = line +'\n';
  span.style.background = parseColor(line);
  span.addEventListener('click', updateColor, false);
  return span;
}

var colorChooser = document.querySelector('.colorpicker');
function updateColor(ev) {
  currentTarget = ev.target;
  colorChooser.click();
}

colorChooser.addEventListener('change', function(ev) {
  updateLineColor(currentTarget, ev.target.value);
})

function updateLineColor(lineEl, color) {
  var line = lineEl.textContent;
  var idx = line.indexOf('#');
  lineEl.textContent = line.replace(line.substr(idx, idx+6), color) + '\n';
  lineEl.style.background = color;
}

uploader.addEventListener('change', function(ev) {
  var file = ev.target.files[0];
  if (file === undefined) return;

  var reader = new FileReader();
  reader.onloadend = function(ev) {
    formatFile(ev.target.result);
  };

  reader.readAsText(file);
})

loadSampleLink.addEventListener('click', function() {
  var req = new XMLHttpRequest();
  req.open('GET', '/sample-Xdefaults.txt', true);
  var self = this;
  req.onloadend = function(ev) {
    formatFile(ev.target.response);
  };

  req.send();
})

exportLink.addEventListener('click', function() {
  var content = contentArea.textContent;
  debugger;
  var blob = new Blob([content], { type : "text/plain"});
  var url = (window.URL || window.webkitURL).createObjectURL(blob);
  var link = window.document.createElement('a');
  link.href = url;
  link.download = 'sample-.Xdefaults.txt';
  var click = document.createEvent("Event");
  click.initEvent("click", true, true);
  link.dispatchEvent(click);
})