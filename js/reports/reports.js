
const loadAllBills = () => {
    const firestore = firebase.firestore();

    firestore
        .collection('bill')
        .get()
        .then((response) => {
            $('#billing-report-table').empty();
            response.forEach((records) => {
                const data = records.data();
                const row = `
                    <tr>
                        <td>${data.billId}</td>
                        <td>${data.patient.name}</td>
                        <td>${data.billingDate}</td>
                        <td>${data.netTotal}</td>
                        <td>
                            <i class="fa-solid fa-print" onclick="printBillData('${records.id}')"></i>
                        </td>
                      
                    </tr>
                `;
                $('#billing-report-table').append(row);
            });
        })
        .catch((err) => {
            console.log("Error loading patients:", err);
        });
}

const loadAllPatients = () => {
    const firestore = firebase.firestore();

    firestore
        .collection('patient')
        .get()
        .then((response) => {
            $('#patients-report-table').empty();
            response.forEach((records) => {
                const data = records.data();
                const row = `
                    <tr>
                        <td>${data.userId}</td>
                        <td>${data.name}</td>
                        <td>${data.gender}</td>
                        <td>${data.address}</td>
                        <td>${data.mobile}</td>
                        <td>
                            <i class="fa-solid fa-print" onclick="printPatientData('${records.id}')"></i>
                        </td>
                      
                    </tr>
                `;
                $('#patients-report-table').append(row);
            });
        })
        .catch((err) => {
            console.log("Error loading patients:", err);
        });
}

const loadAllDoctors = () => {
    const firestore = firebase.firestore();

    firestore
        .collection('doctor')
        .get()
        .then((response) => {
            $('#doctors-report-table').empty();
            response.forEach((records) => {
                const data = records.data();
                const row = `
                    <tr>
                        <td>${data.id}</td>
                        <td>${data.doctorName}</td>
                        <td>${data.doctorMobile}</td>
                        <td>${data.doctorSpecialization}</td>
                       
                        <td>
                            <i class="fa-solid fa-print" onclick="printDoctorData('${records.id}')"></i>
                        </td>
                      
                    </tr>
                `;
                $('#doctors-report-table').append(row);
            });
        })
        .catch((err) => {
            console.log("Error loading patients:", err);
        });
}

const loadAllAppointments = () => {
    const firestore = firebase.firestore();

    firestore
        .collection('appointment')
        .get()
        .then((response) => {
            $('#appointments-report-table').empty();
            response.forEach((records) => {
                const data = records.data();
                const row = `
                    <tr>
                        <td>${data.appointmentId}</td>
                        <td>${data.patientId}</td>
                        <td>${data.patientName}</td>
                        <td>${data.doctorName}</td>
                        <td>${data.dateTime}</td>
                       
                       
                        <td>
                            <i class="fa-solid fa-print" onclick="printAppointmentData('${records.id}')"></i>
                        </td>
                      
                    </tr>
                `;
                $('#appointments-report-table').append(row);
            });
        })
        .catch((err) => {
            console.log("Error loading patients:", err);
        });
}

const printBillData=(id)=>{
    window.open(`printed_bill_reports.html?id=${id}`,'blank')

}
const printPatientData=(id)=>{
    window.open(`printed_patient_reports.html?id=${id}`,'blank')
}

const printDoctorData=(id)=>{
    window.open(`printed_doctor_reports.html?id=${id}`,'blank')
}
const printAppointmentData=(id)=>{
    window.open(`printed_appointment_reports.html?id=${id}`,'blank')
}


window.onload=()=>{
    loadAllBills();
    loadAllPatients();
    loadAllDoctors();
    loadAllAppointments();
}