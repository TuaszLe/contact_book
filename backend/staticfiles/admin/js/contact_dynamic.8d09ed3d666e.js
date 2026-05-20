document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Contact Dynamic JS đã load thành công!");

    const typeField = document.getElementById('id_contact_type');
    console.log("Type field:", typeField ? "Tìm thấy" : "KHÔNG tìm thấy");

    if (!typeField) return;

    const tollplazaRow = document.querySelector('.field-tollplaza');
    const eparkingRow = document.querySelector('.field-eparking');

    console.log("Tollplaza row:", tollplazaRow ? "Tìm thấy" : "KHÔNG tìm thấy");
    console.log("Eparking row:", eparkingRow ? "Tìm thấy" : "KHÔNG tìm thấy");

    function toggleFields() {
        console.log("Đang thay đổi - Giá trị type:", typeField.value);

        if (typeField.value === 'tollplaza') {
            if (tollplazaRow) tollplazaRow.style.display = '';
            if (eparkingRow) eparkingRow.style.display = 'none';
        } else if (typeField.value === 'eparking') {
            if (tollplazaRow) tollplazaRow.style.display = 'none';
            if (eparkingRow) eparkingRow.style.display = '';
        } else {
            if (tollplazaRow) tollplazaRow.style.display = 'none';
            if (eparkingRow) eparkingRow.style.display = 'none';
        }
    }

    toggleFields();
    typeField.addEventListener('change', toggleFields);
});