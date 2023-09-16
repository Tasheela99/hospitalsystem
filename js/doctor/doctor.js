let doctorId;
const createDoctor = () => {

    // Check if the confirmation checkbox is checked
    const confirmed = document.getElementById('completeForm');
    if (!confirmed.checked) {
        alert('Please confirm before creating a doctor.');
        return;
    }

    const doctor = {
        doctorName: $('#doctorName').val(),
        doctorSpecialization: $('#doctorSpecialization').val(),
        doctorProvince: $('#doctorProvince').val(),
        doctorCity: $('#doctorCity').val(),
        doctorMobile: $('#doctorMobile').val(),
        doctorAddress: $('#doctorAddress').val(),
        doctorAvailability: $('#doctorAvailability').val(),
    };

    console.log(doctor);

    const database = firebase.firestore();
    database
        .collection('doctor')
        .add(doctor)
        .then((response) => {
            console.log(response)
        })
        .catch((err) => {
            console.log("Error creating doctor:", err);
        });
}

const totalDoctorCount = (count) => {
    $('#doctorCount').text(count);
}
const loadAllDoctors = () => {
    const firestore = firebase.firestore();
    firestore
        .collection('doctor')
        .get()
        .then((response) => {
            const doctorCount = response.size;
            totalDoctorCount(doctorCount);
            $('#table-body').empty();
            response.forEach((doctorRecords) => {
                const doctorData = doctorRecords.data();
                const row = `
                    <tr>
                        <td>${doctorData.doctorName}</td>
                        <td>${doctorData.doctorSpecialization}</td>
                        <td>${doctorData.doctorProvince}</td>
                        <td>${doctorData.doctorCity}</td>
                        <td>${doctorData.doctorMobile}</td>
                        <td>${doctorData.doctorAddress}</td>
                        <td>${doctorData.doctorAvailability}</td>
                        <td>
                            <button class="btn btn-primary w-100" onclick="updateDoctor('${doctorRecords.id}')">Update</button>
                        </td>
                        <td>
                            <button class="btn btn-danger w-100" onclick="deleteDoctor('${doctorRecords.id}')">Delete</button>
                        </td>
                    </tr>
                `;
                $('#table-body').append(row);
            });
        })
        .catch((err) => {
            console.log("Error loading doctors:", err);
        });
}

const updateDoctor = (id) => {
    doctorId = id;
    const firestore = firebase.firestore();
    firestore.collection('doctor')
        .doc(doctorId)
        .get()
        .then((res) => {
            if (res.exists) {
                const data = res.data();
                $('#doctorName').val(data.doctorName);
                $('#doctorSpecialization').val(data.doctorSpecialization);
                $('#doctorProvince').val(data.doctorProvince);
                $('#doctorCity').val(data.doctorCity);
                $('#doctorMobile').val(data.doctorMobile);
                $('#doctorAddress').val(data.doctorAddress);
                $('#doctorAvailability').val(data.doctorAvailability);
            } else {
                console.log("Doctor data not found.");
            }
        })
        .catch((err) => {
            console.log("Error fetching doctor data:", err);
        });
}

const updateDoctorRecords = () => {
    if (doctorId) {
        const firestore = firebase.firestore();
        firestore.collection('doctor')
            .doc(doctorId)
            .update({
                doctorName: $('#doctorName').val(),
                doctorSpecialization: $('#doctorSpecialization').val(),
                doctorProvince: $('#doctorProvince').val(),
                doctorCity: $('#doctorCity').val(),
                doctorMobile: $('#doctorMobile').val(),
                doctorAddress: $('#doctorAddress').val(),
                doctorAvailability: $('#doctorAvailability').val(),
            })
            .then(() => {
                doctorId = undefined;
                loadAllDoctors();
            })
            .catch((err) => {
                console.log("Error updating doctor:", err);
            });
    }
}

const deleteDoctor = (id) => {
    if (confirm('Are you sure?')) {
        const firestore = firebase.firestore();
        firestore.collection('doctor')
            .doc(id)
            .delete()
            .then(() => {
                alert("Deleted");
                doctorId = undefined;
                loadAllDoctors();
            })
            .catch((err) => {
                console.log("Error deleting doctor:", err);
            });
    }
}

const searchDoctor = () => {
    const searchValue = $('#searchInput').val().toLowerCase();
    const firestore = firebase.firestore();
    firestore
        .collection('doctor')
        .get()
        .then((response) => {
            $('#table-body').empty(); // Clear existing rows
            response.forEach((doctorRecords) => {
                const doctorData = doctorRecords.data();

                if (searchValue === '' || doctorData.doctorName.toLowerCase().includes(searchValue)) {
                    const row = `
                        <tr>
                            <td>${doctorData.doctorName}</td>
                            <td>${doctorData.doctorSpecialization}</td>
                            <td>${doctorData.doctorProvince}</td>
                            <td>${doctorData.doctorCity}</td>
                            <td>${doctorData.doctorMobile}</td>
                            <td>${doctorData.doctorAddress}</td>
                            <td>${doctorData.doctorAvailability}</td>
                            <td>
                                <button class="btn btn-primary w-100" onclick="updateDoctor('${doctorRecords.id}')">Update</button>
                            </td>
                            <td>
                                <button class="btn btn-danger w-100" onclick="deleteDoctor('${doctorRecords.id}')">Delete</button>
                            </td>
                        </tr>
                    `;
                    $('#table-body').append(row);
                }
            });
        })
        .catch((err) => {
            console.log("Error searching for doctors:", err);
        });
}

window.onload = () => {
    loadAllDoctors();
}