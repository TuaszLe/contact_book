document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Dynamic Contact Fields");

  const typeField = document.getElementById("id_contact_type");

  if (!typeField) return;

  // =====================================================
  // FIELD ROWS
  // =====================================================

  const tollRow = document.querySelector(".field-tollplazas");
  const parkingRow = document.querySelector(".field-parkings");
  const officeRow = document.querySelector(".field-offices");
  const contractorRow = document.querySelector(".field-contractors");

  function hideAll() {
    if (tollRow) tollRow.style.display = "none";
    if (parkingRow) parkingRow.style.display = "none";
    if (officeRow) officeRow.style.display = "none";
    if (contractorRow) contractorRow.style.display = "none";
  }

  function toggleFields() {
    const value = typeField.value;

    hideAll();

    if (value === "tollplaza") {
      if (tollRow) tollRow.style.display = "";
    } else if (value === "parking") {
      if (parkingRow) parkingRow.style.display = "";
    } else if (value === "office") {
      if (officeRow) officeRow.style.display = "";
    } else if (value === "contractor") {
      if (contractorRow) contractorRow.style.display = "";
    }

    //console.log("Current type:", value);
  }

  // =====================================================
  // INIT
  // =====================================================

  toggleFields();

  typeField.addEventListener("change", toggleFields);
});
