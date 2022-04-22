
let size = 0;

function toggleConsole() {
  let con = document.getElementById('console');
  if(con.style.display == '')
    con.style.display = 'none';
  else
    con.style.display = '';
}

function updateSize() {
  let elem = document.getElementById('size');
  elem.innerText = size;
}

function stackSize(id) {
  let elem = document.getElementById(id);
  return elem.childElementCount;
}

function updatePeek(val) {
  let elem = document.getElementById('peek');
  peek.innerText = '' + val;
}

function push(id, data) {
  let stack = document.getElementById(id);
  let val = document.createElement('div');
  val.className = 'value';
  let div = document.createElement('div');
  div.innerText = '' + data;
  val.appendChild(div);
  stack.appendChild(val);
  stack.scroll(0, -1000);
  size++;
  updateSize();
}

function pop(id) {
  let stack = document.getElementById(id);
  let i = stack.childElementCount - 1;
  if(i < 0) return;
  let elem = stack.removeChild(stack.children[i]);
  let val = elem.children[0].innerText;
  size--;
  updateSize();
  return [val, elem];
}

function _peek(id) {
  let stack = document.getElementById(id);
  let i = stack.childElementCount - 1;
  if(i < 0) return 'null';
  if(id == 'stack2')
    return stack.children[i].children[0].innerText;
  return stack.children[0].innerText;
}

function shiftStacks() {
  if(stackSize('stack1') > 0) {
    let stack1 = document.getElementById('stack1');
    let stack2 = document.getElementById('stack2');
    for(let i = stackSize('stack1'); --i >= 0;) {
      let elem = stack1.children[i];
      stack1.removeChild(elem);
      stack2.appendChild(elem);
    }
  }
}

function enqueue() {
  let input = document.getElementById('input');
  let val = input.value;
  if(val == '') return;
  input.value = '';
  input.focus();
  push('stack1', val);
  if(stackSize('stack2') < 1)
    updatePeek(val);
  log('queued ' + val);
}

function dequeue() {
  if(size == 0) return;
  if(stackSize('stack2') == 0) {
    shiftStacks();
  }
  let val = pop('stack2')[0];
  if(val !== undefined) {
    if(stackSize('stack2') == 0)
      updatePeek(_peek('stack1'));
    else
      updatePeek(_peek('stack2'));
  }
  log('dequeued ' + val);
}

function log(msg) {
  console.log(msg);
  let con = document.getElementById('console');
  let div = document.createElement('div');
  div.innerText = msg;
  con.appendChild(div);
  con.scroll(0, 1000);
}

window.addEventListener('load', () => {
  toggleConsole();
  let input = document.getElementById('input');
  input.addEventListener('keyup', (e) => {
    if(e.code == 'Enter')
      enqueue();
  }, false);
  window.addEventListener('keyup', (e) => {
    if(e.code == 'Backquote')
      toggleConsole();
  }, false);
}, false);
