document.addEventListener('DOMContentLoaded', function() {
    const contactType = document.getElementById('id_contact_type');
    const tollplazaRow = document.getElementById('id_tollplaza').closest('.form-row');
    const eparkingRow = document.getElementById('id_eparking').closest('.form-row');

    function toggleFields() {
        if (contactType.value === 'tollplaza') {
            tollplazaRow.style.display = '';
            eparkingRow.style.display = 'none';
        } else if (contactType.value === 'eparking') {
            tollplazaRow.style.display = 'none';
            eparkingRow.style.display = '';
        } else {
            tollplazaRow.style.display = 'none';
            eparkingRow.style.display = 'none';
        }
    }

    // Chạy lần đầu
    toggleFields();

    // Khi thay đổi
    contactType.addEventListener('change', toggleFields);
});