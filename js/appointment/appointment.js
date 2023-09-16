const createAppointment = () => {
    const confirmed = document.getElementById('completeForm');
    if (!confirmed.checked) {
        toastr.error('Please Confirm Before Submitting', 'Error!');
        toastr.options.hideMethod = 'slideUp';

        return;
    }

    const appointment = {
        name: $('#name').val(),
        mobile: $('#mobile').val(),
        doctorName: $('#doctorName').val(),
        dateTime: $('#dateTime').val(),
        message: $('#message').val(),
    };

    // Check for appointment conflicts
    checkAppointmentConflicts(appointment)
        .then(() => {
            const database = firebase.firestore();
            const appointments = database.collection('appointment');
            appointments
                .add(appointment)
                .then((response) => {
                    toastr.success('Appointment SuccessFully','Success');
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
}
