let tx = ld('ledgerly.tx', null);                 // load saved transactions
const sv = (k,v) => localStorage.setItem(k, JSON.stringify(v));

$('#form').onsubmit = e => {                      // add a transaction
  e.preventDefault();
  const a = parseFloat($('#amount').value), t = $('#title').value.trim();
  if (!(a > 0) || !t) { /* show error + shake */ return; }
  tx.push({id:'t'+Date.now(), date:$('#date').value, type, title:t,
           category:$('#cat').value, amount:Math.round(a*100)/100});
  sv('ledgerly.tx', tx); toast('Transaction added'); render();
};

const sum = (l,t) => l.filter(x => x.type===t).reduce((a,x) => a+x.amount, 0);
const inM = m => tx.filter(x => x.date.startsWith(m));    // transactions of a month

function render(){
  const mt = inM(month), inc = sum(mt,'income'), exp = sum(mt,'expense');
  tween($('#sBal'), sum(tx,'income') - sum(tx,'expense'));  // balance
  tween($('#sInc'), inc);  tween($('#sExp'), exp);
  welcome(inc, exp);  renderTable();  /* charts + report also updated */
}

function welcome(inc, exp){
  const h = now.getHours();
  const g = h<12 ? 'Good morning' : h<18 ? 'Good afternoon' : 'Good evening';
  $('#wHi').textContent = g + (uname ? ', ' + uname : '') + '.';
  const r = inc ? Math.round(exp/inc*100) : 0;
  $('#wMsg').textContent = `You’ve spent ${r}% of your income and have ${money(inc-exp)} left.`;
  $('#wBar').style.width = Math.min(100, r) + '%';
}

$('#dYes').onclick = () => {                      // confirmed delete + undo
  const i = tx.findIndex(x => x.id === pend), [r] = tx.splice(i, 1);
  sv('ledgerly.tx', tx); render();
  toast('Transaction deleted', () => { tx.push(r); sv('ledgerly.tx', tx); render(); });
};
