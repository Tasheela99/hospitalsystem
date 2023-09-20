let medicineId;
const medicineIdPrefix = "MID-";

function generateMedicineId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }
    return randomId;
}


const createMedicine = () => {



    const medicineName = $('#medicineName').val();
    const medicineQuantity = parseFloat($('#medicineQuantity').val());
    const medicinePrice = parseFloat($('#medicinePrice').val());
    const expireDateInput = document.getElementById('expireDate'); // Get the input element
    const expireDateValue = expireDateInput.value.split('T')[0];

    if (isNaN(medicineQuantity) || medicineQuantity < 0) {
        toastr.error('Invalid quantity. Quantity must be a non-negative number.', 'Error');
        return;
    }else if (isNaN(medicinePrice) || medicinePrice < 0){
        toastr.error('Invalid Price. Price must be a non-negative number.', 'Error');
        return;
    }

    const medicineId = medicineIdPrefix + generateMedicineId(6);

    const medicine = {
        medicineId: medicineId,
        medicineName: medicineName,
        medicineQuantity: medicineQuantity,
        medicinePrice: medicinePrice,
        expireDate: expireDateValue,
    };

    console.log(medicine);

    const database = firebase.firestore();
    database
        .collection('medicine')
        .doc(medicineId)
        .set(medicine)
        .then((response) => {
            toastr.success('Medicine Added SuccessFully', 'Success');
            toastr.options.hideMethod = 'slideUp';
            console.log(response)
        })
        .catch((err) => {
            console.log("Error creating medicine:", err);
        });

}

const updateMedicine = (id) => {
    medicineId = id;
    const firestore = firebase.firestore();
    firestore.collection('medicine')
        .doc(medicineId)
        .get()
        .then((res) => {
            if (res.exists) {
                const data = res.data();
                $('#medicineId').val(data.medicineId);
                $('#medicineName').val(data.medicineName);
                $('#medicineQuantity').val(data.medicineQuantity);
                $('#medicinePrice').val(data.medicinePrice);
                $('#expireDate').val(data.expireDate);
            } else {
                console.log("Medicine data not found.");
            }
        })
        .catch((err) => {
            console.log("Error fetching medicine data:", err);
        });
}
const updateMedicineRecords = () => {
    if (medicineId) {
        const firestore = firebase.firestore();
        firestore.collection('medicine')
            .doc(medicineId)
            .update({
                medicineId: $('#medicineId').val(),
                medicineName: $('#medicineName').val(),
                medicineQuantity: $('#medicineQuantity').val(),
                medicinePrice: $('#medicinePrice').val(),
                expireDate: $('#expireDate').val(),
            })
            .then(() => {
                medicineId = undefined;
                loadAllMedicines();
            })
            .catch((err) => {
                console.log("Error updating medicine:", err);
            });
    }
}

const deleteMedicine = (id) => {
    if (confirm('Are you sure?')) {
        const firestore = firebase.firestore();
        firestore.collection('medicine')
            .doc(id)
            .delete()
            .then(() => {
                toastr.error('Medicine Deleted', 'Success');
                toastr.options.hideMethod = 'slideUp';
                medicineId = undefined;
                loadAllMedicines();
            })
            .catch((err) => {
                console.log("Error deleting medicine:", err);
            });
    }
}


const searchMedicine = () => {
    const searchValue = $('#searchInput').val().toLowerCase();
    const firestore = firebase.firestore();
    firestore
        .collection('medicine')
        .get()
        .then((response) => {
            $('#table-body').empty(); // Clear existing rows
            response.forEach((medicineRecords) => {
                const medicineData = medicineRecords.data();
                if (searchValue === '' || medicineData.medicineName.toLowerCase().includes(searchValue)) {
                    const row = `
                        <tr>
                            <td>${medicineData.medicineId}</td>
                            <td>${medicineData.medicineName}</td>
                            <td>${medicineData.medicineQuantity}</td>
                            <td>${medicineData.medicinePrice}</td>
                            <td>${medicineData.expireDate}</td>
                            <td>
                                <button class="btn btn-primary w-100" onclick="updateMedicine('${medicineRecords.id}')">Update</button>
                            </td>
                            <td>
                                <button class="btn btn-danger w-100" onclick="deleteMedicine('${medicineRecords.id}')">Delete</button>
                            </td>
                        </tr>
                    `;
                    $('#table-body').append(row);
                }
            });
        })
        .catch((err) => {
            console.log("Error searching for medicines:", err);
        });
}

const loadAllMedicines = () => {
    const firestore = firebase.firestore();
    firestore
        .collection('medicine')
        .get()
        .then((response) => {
            $('#table-body').empty();
            response.forEach((medicineRecords) => {
                const medicineData = medicineRecords.data();
                const row = `
                    <tr>
                        <td>${medicineData.medicineId}</td>
                        <td>${medicineData.medicineName}</td>
                        <td>${medicineData.medicineQuantity}</td>
                        <td>${medicineData.medicinePrice}</td>
                        <td>${medicineData.expireDate}</td>
                       
                        <td>
                            <button class="btn btn-primary w-100" onclick="updateMedicine('${medicineRecords.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                        </td>
                        <td>
                            <button class="btn btn-danger w-100" onclick="deleteMedicine('${medicineRecords.id}')"><i class="fa-solid fa-trash-can"></i></button>
                        </td>
                    </tr>
                `;
                $('#table-body').append(row);
            });
        })
        .catch((err) => {
            console.log("Error loading medicines:", err);
        });
}

window.onload = () => {
    loadAllMedicines()
}