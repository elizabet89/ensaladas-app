function toggleAccordion(header) {
  const content = header.nextElementSibling;
  const arrow = header.querySelector('.arrow');
  content.classList.toggle('open');
  arrow.classList.toggle('rotated');}

function changeQty(btn, change) {
  const span = btn.parentNode.querySelector("span");
  let value = parseInt(span.innerText);
  value += change;
  if (value < 0) value = 0;
  span.innerText = value;
}




