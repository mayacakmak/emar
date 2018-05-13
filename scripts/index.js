function startEditor() {
  var robotSelect = document.getElementById('robotSelect');
  window.location.href = "edit.html?robot=" + robotSelect.value;
}

function startRenderer() {
  var robotSelect = document.getElementById('robotSelect');
  window.location.href = "render.html?robot=" + robotSelect.value;
}

function startController() {
  var robotSelect = document.getElementById('robotSelect');
  window.location.href = "control.html?robot=" + robotSelect.value;
}