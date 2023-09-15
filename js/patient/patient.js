// function Patient(name, age, gender, mobile, address, medicalHistory) {
//     this.name = name;
//     this.age = age;
//     this.gender = gender;
//     this.mobile = mobile;
//     this.address = address;
//     this.medicalHistory = medicalHistory;
// }


const createPatient = () => {

    const confirmed = document.getElementById('#completeForm');

    const patient = {
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
        .add(patient)
        .then((response) => {
            console.log(response)
        }).catch((err) => {
        console.log(err);
    });

}

const loadAllPatients = () => {
    const firestore = firebase.firestore();
    firestore
        .collection('patient')
        .get()
        .then((response) => {
            response.forEach((patientRecords) => {
                const patientData = patientRecords.data();
                const row = `
                <tr>
                <td>${patientData.name}</td>
                <td>${patientData.age}</td>
                <td>${patientData.gender}</td>
                <td>${patientData.mobile}</td>
                <td>${patientData.address}</td>
                <td>${patientData.medicalHistory}</td>
                <td>
                    <button class="btn btn-primary w-100" onclick="updatePatient(${patientData.id})">Update</button>
                </td>
                <td>
                    <button class="btn btn-danger w-100" onclick="deletePatient(${patientData.id})">Delete</button>
                </td>
                </tr>
                
                `;
                $('#table-body').append(row);
            });
        });
}

const updatePatient=(id)=>{
    customerId = id;
}

const updatePatientRecords=()=>{
    const firestore = firebase.firestore();
    firestore.collection('patient')
        .doc(customerId)
        .update({

        })
}

const deletePatient=(id)=>{}
