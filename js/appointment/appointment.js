let appointments = [];
const appointmentIdPrefix = "APT-"

function generateAppointmentId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }
    return randomId;
}


const createAppointment = () => {

    const appointmentId = appointmentIdPrefix + generateAppointmentId(6);


    const confirmed = document.getElementById('completeForm');
    if (!confirmed.checked) {
        toastr.error('Please Confirm Before Submitting', 'Error!');
        toastr.options.hideMethod = 'slideUp';

        return;
    }

    const appointment = {
        appointmentId: appointmentId,
        patientId: $('#patientId').val(),
        patientName: $('#name').val(),
        patientMobile: $('#mobile').val(),
        patientMedicalHistory: $('#medicalHistory').val(),
        doctorName: $('#doctorName').val(),
        dateTime: $('#dateTime').val(),
        message: $('#message').val(),
    };

    checkAppointmentConflicts(appointment)
        .then(() => {
            const database = firebase.firestore();
            database
                .collection('appointment')
                .doc(appointmentId)
                .set(appointment)
                .then((response) => {
                    toastr.success('Appointment SuccessFully', 'Success');
                    toastr.options.hideMethod = 'slideUp';
                    console.log(response);
                })
                .catch((err) => {
                    toastr.error('Error Creating The Appointment', 'Error!');
                    toastr.options.hideMethod = 'slideUp';
                });
        })
        .catch((error) => {
            alert(error);
        });
};
const checkAppointmentConflicts = (appointment) => {
    return new Promise((resolve, reject) => {
        const database = firebase.firestore();
        const appointments = database.collection('appointment');

        appointments
            .where('dateTime', '==', appointment.dateTime)
            .where('doctorName', '==', appointment.doctorName)
            .get()
            .then((querySnapshot) => {
                let isConflict = false;
                querySnapshot.forEach((doc) => {
                    const existingAppointment = doc.data();
                    const existingDateTime = new Date(existingAppointment.dateTime);
                    const newDateTime = new Date(appointment.dateTime);

                    if (
                        newDateTime >= existingDateTime &&
                        newDateTime <= new Date(existingDateTime.getTime() + yourAppointmentDurationInMilliseconds)
                    ) {
                        isConflict = true;
                    }
                });

                if (isConflict) {
                    reject('Appointment conflicts with an existing appointment for the same doctor.');
                } else {
                    resolve();
                }
            })
            .catch((err) => {
                reject('Error loading appointments:', err);
            });
    });
};


const loadAllPatientIds = () => {
    const firestore = firebase.firestore();
    firestore
        .collection('patient')
        .get()
        .then((response) => {
            $('#patientId').empty();
            response.forEach((patientRecords) => {
                const option = $('<option></option>').val(patientRecords.id).text(patientRecords.id);
                $('#patientId').append(option);
            });
        })
        .catch((err) => {
            console.log("Error loading patients:", err);
        });
}


$('#patientId').on("change", function () {
    const patientId = $(this).val();
    const firestore = firebase.firestore();
    firestore.collection('patient')
        .doc(patientId)
        .get()
        .then((res) => {
            if (res.exists) {
                const data = res.data();
                $('#name').val(data.name);
                $('#mobile').val(data.mobile);
                $('#medicalHistory').val(data.medicalHistory);
            }
        });
});


const loadAllDoctors = () => {
    const firestore = firebase.firestore();
    firestore
        .collection('doctor')
        .get()
        .then((response) => {
            $('#doctorName').empty();
            response.forEach((doctorRecords) => {
                const doctorData = doctorRecords.data();
                const row = `
                        <option>${doctorData.doctorName}</option>
                `;
                $('#doctorName').append(row);
            });
        })
        .catch((err) => {
            console.log("Error loading patients:", err);
        });
}


window.onload = () => {
    loadAllDoctors();
    loadAllPatientIds();
}
