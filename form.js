const form = document.querySelector('#erasure-form');
const status = document.querySelector('#status');
let submitted = false;
const date = new Date();
form.elements.date.value = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
function update() {
  const representative = form.elements.requester.value === 'representative';
  document.querySelector('#representative').hidden = !representative;
  for (const name of ['subjectName','subjectEmail','relationship']) {
    form.elements[name].required = representative;
    form.elements[name].disabled = !representative;
  }
  const specific = form.elements.scope.value === 'specific';
  document.querySelector('#specific').hidden = !specific;
  form.elements.details.required = specific;
  form.elements.details.disabled = !specific;
}
form.addEventListener('change', update);
update();
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitted) return;
  const button = form.querySelector('button');
  button.disabled = true;
  status.textContent = 'Sending your request…';
  try {
    const payload = Object.fromEntries(new FormData(form));
    payload.confirmed = form.elements.confirmed.checked;
    const response = await fetch('api/erasure', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Your request could not be sent. Please try again or email codyli9219@gmail.com.');
    submitted = true;
    status.textContent = 'Request received. We’ll review it and respond by email. Your data has not yet been deleted.';
    button.textContent = 'Request received';
    form.querySelectorAll('input,textarea').forEach(input => input.disabled = true);
  } catch (error) {
    status.textContent = error instanceof SyntaxError || error.name === 'TimeoutError' || error.name === 'TypeError' ? 'We could not confirm delivery. Please try again or email codyli9219@gmail.com.' : error.message;
    button.disabled = false;
  }
  status.focus();
});
