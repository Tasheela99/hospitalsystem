let doctorId;
const createDoctor = () => {
    const confirmed = document.getElementById('completeForm');
    if (!confirmed.checked) {
        toastr.warning('Please Select the Checkbox before Click The Button', 'Warning!');
        toastr.options.hideMethod = 'slideUp';
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
            toastr.success('Doctor Added SuccessFully', 'Success!');
            toastr.options.hideMethod = 'slideUp';
            console.log(response)
        })
        .catch((err) => {
            toastr.error('Error Adding doctor', 'Error!');
            toastr.options.hideMethod = 'slideUp';
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
                            <i class="fa-solid fa-pen-to-square" onclick="updateDoctor('${doctorRecords.id}')"></i>
                        </td>
                        <td>
                            <i class="fa-solid fa-trash-can" onclick="deleteDoctor('${doctorRecords.id}')"></i>
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
            .then((response) => {
                toastr.success('Doctor Updated SuccessFully', 'Success!');
                toastr.options.hideMethod = 'slideUp';
                doctorId = undefined;
                console.log(response)
                loadAllDoctors();
            })
            .catch((err) => {
                toastr.error('Error Updating doctor', 'Error!');
                toastr.options.hideMethod = 'slideUp';
                console.log("Error creating doctor:", err);
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
                toastr.warning('Doctor Deleted', 'Warning!');
                toastr.options.hideMethod = 'slideUp';
                alert("Deleted");
                doctorId = undefined;
                loadAllDoctors();
            })
            .catch((err) => {
                toastr.error('Error Deleting Doctor', 'Error!');
                toastr.options.hideMethod = 'slideUp';
                console.log("Error deleting Doctor:", err);
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
                            <i class="fa-solid fa-pen-to-square" onclick="updateDoctor('${doctorRecords.id}')"></i>
                        </td>
                        <td>
                            <i class="fa-solid fa-trash-can" onclick="deleteDoctor('${doctorRecords.id}')"></i>
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