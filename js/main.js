function updateDateTime() {
  const now = new Date();
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const currentDateTime = now.toLocaleString('en-US', options);
  document.querySelector('#date').textContent = currentDateTime;
}
setInterval(updateDateTime, 1000);
