document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ JS Dynamic v5 - Brute force");

    const typeField = document.getElementById('id_contact_type');
    if (!typeField) return;

    function getAllFormRows() {
        return document.querySelectorAll('.form-row');
    }

    function toggleFields() {
        const value = typeField.value.toLowerCase().trim();
        console.log("Current value:", value);

        const rows = getAllFormRows();

        rows.forEach(row => {
            const label = row.querySelector('label');
            if (!label) return;

            const labelText = label.textContent.trim();

            if (labelText.includes('Tollplazas') || labelText.includes('tollplaza')) {
                row.style.display = (value.includes('toll')) ? 'table-row' : 'none';
                console.log(`Tollplazas → ${row.style.display} aaaaa`);
            }

            if (labelText.includes('Parkings') || labelText.includes('parking')) {
                row.style.display = (value.includes('park')) ? 'table-row' : 'none';
                console.log(`Parkings → ${row.style.display}`);
            }
            if (labelText.includes('Offices') || labelText.includes('office')) {
                row.style.display = (value.includes('office')) ? 'table-row' : 'none';
                console.log(`Offices → ${row.style.display}`);
            }
        });
    }

    // Chạy ngay khi load
    setTimeout(toggleFields, 300);   // delay một chút cho form load xong
    typeField.addEventListener('change', toggleFields);
});