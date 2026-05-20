document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Contact Dynamic JS loaded successfully!");

    const typeField = document.getElementById('id_contact_type');
    if (!typeField) {
        console.error("❌ Không tìm thấy field contact_type");
        return;
    }

    console.log("Contact Type field found!");

    // Selector đáng tin cậy hơn
    const tollplazaRow = document.querySelector('.field-tollplaza');
    const eparkingRow  = document.querySelector('.field-eparking');

    function toggleFields() {
        console.log("Current value:", typeField.value);

        if (typeField.value === 'tollplaza') {
            if (tollplazaRow) tollplazaRow.style.display = 'table-row';
            if (eparkingRow)  eparkingRow.style.display = 'none';
        } 
        else if (typeField.value === 'eparking') {
            if (tollplazaRow) tollplazaRow.style.display = 'none';
            if (eparkingRow)  eparkingRow.style.display = 'table-row';
        } 
        else {
            if (tollplazaRow) tollplazaRow.style.display = 'none';
            if (eparkingRow)  eparkingRow.style.display = 'none';
        }
    }

    // Chạy ngay lập tức
    toggleFields();

    // Theo dõi sự thay đổi
    typeField.addEventListener('change', toggleFields);
});