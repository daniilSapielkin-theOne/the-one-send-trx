const form = document.getElementById('dataForm');
const actionSelect = document.getElementById('actionSelect');
const approveFields = document.getElementById('approveFields');

const BASE_URL = window.ENV.BASE_URL;
const API_KEY = window.ENV.API_KEY;

function toggleApproveFields() {
  const idLabel = document.getElementById('idLabel');
  
  if (actionSelect.value === 'cancel') {
    approveFields.classList.add('hidden');
    idLabel.textContent = 'Request ID';
  } else {
    approveFields.classList.remove('hidden');
    idLabel.textContent = 'ID';
  }
}

actionSelect.addEventListener('change', () => {
  const currentValue = actionSelect.value;
  form.querySelectorAll('input').forEach(input => input.value = '');
  actionSelect.value = currentValue;
  toggleApproveFields();
});


document.addEventListener('DOMContentLoaded', () => {
  toggleApproveFields();
});

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const action = formData.get('action');

  const endpoint = `${BASE_URL}/v1/internal/withdraw/${action}`;

  const payload = action === 'cancel'
    ? { id: formData.get('id') }
    : {
        id: formData.get('id'),
        tx_hash: formData.get('tx_hash'),
        external_id: formData.get('external_id')
      };

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY
    },
    body: JSON.stringify(payload)
  })
  .then(async response => {
    if (response.status === 200) {
     showToast('Success submitted!', 'success');
    } else {
      const errorMessage = data.error || 'Unknown error';
      showToast('Error:' + errorMessage, 'error');
      console.error('Error:', errorMessage);
      throw new Error(errorMessage);
    }
  })
  .catch(error => {
    showToast('Error: ' + error.message, 'error');
    console.error(error);
  })
  .finally(() => {
    form.reset();             
    toggleApproveFields();    
  });
});
