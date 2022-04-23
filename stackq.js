
let size = 0;

function toggleConsole() {
  let con = document.getElementById('console');
  if(con.className == '')
    con.className = 'collapse';
  else
    con.className = '';
}

function clearConsole() {
  let con = document.getElementById('console');
  con.innerHTML = '';
}

function updateSize() {
  let elem = document.getElementById('size');
  elem.innerText = size;
}

function stackSize(id) {
  let elem = document.getElementById(id);
  return elem.childElementCount;
}

function updateFront(val) {
  let elem = document.getElementById('front');
  elem.innerText = '' + val;
}

function push(id, data) {
  let stack = document.getElementById(id);
  let val = document.createElement('div');
  val.className = 'value';
  let div = document.createElement('div');
  div.innerText = '' + data;
  val.appendChild(div);
  stack.appendChild(val);
  stack.scrollTo({top: -stack.scrollHeight, behavior: 'smooth'});
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
  if(id === undefined) {
    if(stackSize('stack2') > 0)
      id = 'stack2';
    else
      id = 'stack1';
  }
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
    stack2.scrollTo({top: -stack2.scrollHeight, behavior: 'smooth'});
  }
}

function enqueue(val) {
  if(val === undefined) {
    let input = document.getElementById('input');
    val = input.value;
  }
  if(val == '') return;
  input.value = '';
  input.focus();
  push('stack1', val);
  if(size == 1)
    updateFront(val);
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
      updateFront(_peek('stack1'));
    else
      updateFront(_peek('stack2'));
  }
  log('dequeued ' + val);
}

function front() {
  if(size == 0) return 'null';
  return _peek();
}

function log(msg) {
  console.log(msg);
  let con = document.getElementById('console');
  let div = document.createElement('div');
  div.innerText = msg;
  con.appendChild(div);
  let options = {
    top: con.scrollHeight + con.clientHeight,
    behavior: 'smooth'
  };
  con.scrollTo(options);
}

function handleOp(op) {
  if(op.charAt(0) == '1') {
    enqueue(op.substr(2));
  }
  else if(op.charAt(0) == '2') {
    dequeue();
  }
  else if(op.charAt(0) == '3') {
    log('front is ' + front());
  }
}

function toggleFile() {
  let select = document.querySelector('.fileSelect');
  if(select.style.display == '')
    select.style.display = 'none';
  else
    select.style.display = '';
}

window.addEventListener('load', () => {
  log('Console ready!');
  let input = document.getElementById('input');
  input.addEventListener('keyup', (e) => {
    if(e.code == 'Enter')
      enqueue();
  }, false);
  window.addEventListener('keyup', (e) => {
    if(e.code == 'Backquote')
      toggleConsole();
    if(e.code == 'Escape') {
      let fileSelect = document.querySelector('.fileSelect');
      if(fileSelect.style.display == '')
        fileSelect.style.display = 'none';
    }
  }, false);
  let consoleTitle = document.querySelector('.console').children[0];
  consoleTitle.addEventListener('click', () => {
    toggleConsole();
  }, false);
  let open = document.getElementById('open');
  open.addEventListener('click', () => {
    toggleFile();
  }, false);
  let filein = document.getElementById('filein');
  filein.addEventListener('change', (e) => {
    let files = filein.files;
    if(files.length == 0) return;
    let file = files[0];
    console.log('file changed to ' + file);
    let reader = new FileReader();
    let lines = [];
    reader.onload = (e) => {
      lines = e.target.result.split(/\r?\n/);
      console.log('read ' + lines.length + ' lines from file');
      for(let i = 0; i < lines.length; i++) {
        handleOp(lines[i]);
      }
    };
    reader.readAsText(file);
    toggleFile();
  }, false);
}, false);
