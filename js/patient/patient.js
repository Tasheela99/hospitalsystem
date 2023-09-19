

let patientId;
const patientIdPrefix = "PID-";

function generatePatientId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }
    return randomId;
}


const createPatient = () => {

    const patientId = patientIdPrefix + generatePatientId(6);

    $('#patientId').val(patientId);


    const confirmed = document.getElementById('completeForm');
    if (!confirmed.checked) {
        alert('Please confirm before creating a patient.');
        return;
    }


    const patient = {
        userId: patientId,
        name: $('#name').val(),
        age: $('#age').val(),
        gender: $('#gender').val(),
        mobile: $('#mobile').val(),
        address: $('#address').val(),
        medicalHistory: $('#medicalHistory').val(),
    };

    console.log(patient);

    const database = firebase.firestore();
    database
        .collection('patient')
        .doc(patientId)
        .set(patient)
        .then((response) => {
            console.log(response)
        })
        .catch((err) => {
            console.log("Error creating patient:", err);
        });
}

const totalPatientCount = (count) => {
    $('#patientCount').text(count);
}
const loadAllPatients = () => {
    const firestore = firebase.firestore();
    firestore
        .collection('patient')
        .get()
        .then((response) => {
            const patientCount = response.size;
            totalPatientCount(patientCount);
            $('#table-body').empty();
            response.forEach((patientRecords) => {
                const patientData = patientRecords.data();
                const row = `
                    <tr>
                        <td>${patientData.userId}</td>
                        <td>${patientData.name}</td>
                        <td>${patientData.age}</td>
                        <td>${patientData.gender}</td>
                        <td>${patientData.mobile}</td>
                        <td>${patientData.address}</td>
                        <td>${patientData.medicalHistory}</td>
                        <td>
                            <button class="btn btn-primary w-100" onclick="updatePatient('${patientRecords.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                        </td>
                        <td>
                            <button class="btn btn-danger w-100" onclick="deletePatient('${patientRecords.id}')"><i class="fa-solid fa-trash-can"></i></button>
                        </td>
                    </tr>
                `;
                $('#table-body').append(row);
            });
        })
        .catch((err) => {
            console.log("Error loading patients:", err);
        });
}

const updatePatient = (id) => {
    patientId = id;
    const firestore = firebase.firestore();
    firestore.collection('patient')
        .doc(patientId)
        .get()
        .then((res) => {
            if (res.exists) {
                const data = res.data();
                $('#patientId').val(data.userId);
                $('#name').val(data.name);
                $('#age').val(data.age);
                $('#gender').val(data.gender);
                $('#mobile').val(data.mobile);
                $('#address').val(data.address);
                $('#medicalHistory').val(data.medicalHistory);
            } else {
                console.log("Patient data not found.");
            }
        })
        .catch((err) => {
            console.log("Error fetching patient data:", err);
        });
}

const updatePatientRecords = () => {
    if (patientId) {
        const firestore = firebase.firestore();
        firestore.collection('patient')
            .doc(patientId)
            .update({
                userId: $('#patientId').val(),
                name: $('#name').val(),
                age: $('#age').val(),
                gender: $('#gender').val(),
                mobile: $('#mobile').val(),
                address: $('#address').val(),
                medicalHistory: $('#medicalHistory').val()
            })
            .then(() => {
                patientId = undefined;
                loadAllPatients();
            })
            .catch((err) => {
                console.log("Error updating patient:", err);
            });
    }
}

const deletePatient = (id) => {
    if (confirm('Are you sure?')) {
        const firestore = firebase.firestore();
        firestore.collection('patient')
            .doc(id)
            .delete()
            .then(() => {
                alert("Deleted");
                patientId = undefined;
                loadAllPatients();
            })
            .catch((err) => {
                console.log("Error deleting patient:", err);
            });
    }
}

const searchPatient = () => {
    const searchValue = $('#searchInput').val().toLowerCase();
    const firestore = firebase.firestore();
    firestore
        .collection('patient')
        .get()
        .then((response) => {
            $('#table-body').empty(); // Clear existing rows
            response.forEach((patientRecords) => {
                const patientData = patientRecords.data();
                if (searchValue === '' || patientData.name.toLowerCase().includes(searchValue)) {
                    const row = `
                        <tr>
                            <td>${patientData.name}</td>
                            <td>${patientData.age}</td>
                            <td>${patientData.gender}</td>
                            <td>${patientData.mobile}</td>
                            <td>${patientData.address}</td>
                            <td>${patientData.medicalHistory}</td>
                            <td>
                                <button class="btn btn-primary w-100" onclick="updatePatient('${patientRecords.id}')">Update</button>
                            </td>
                            <td>
                                <button class="btn btn-danger w-100" onclick="deletePatient('${patientRecords.id}')">Delete</button>
                            </td>
                        </tr>
                    `;
                    $('#table-body').append(row);
                }
            });
        })
        .catch((err) => {
            console.log("Error searching for patients:", err);
        });
}

window.onload = () => {
    loadAllPatients();
}