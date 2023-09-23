const loadPatientData = () => {

    const date = new Date().toISOString().split('T')[0];
    $('#date').text(date);


    const params = {};
    //const queryParams = window.location.search.substring(1);
    //const arr = queryParams.split('&');
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');

    const firestore = firebase.firestore();
    firestore.collection('patient')
        .doc(id)
        .get()
        .then((res) => {
            if (res.exists) {
                const data = res.data();
                console.log(data)
                $('#patientId').text(res.id);
                $('#patientName').text(data.name);
                $('#patientGender').text(data.gender);
                $('#patientAge').text(data.age);
                $('#patientMobile').text(data.mobile);
                $('#patientAddress').text(data.address);
                $('#patientMedicalHistory').text(data.medicalHistory);
            }
        });


}
const printReport=()=>{
    print();
}

const backToReports=()=>{
    window.open('report_dashboard.html');
}


window.onload = () => {
    loadPatientData();
}