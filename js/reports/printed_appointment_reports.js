const loadData = () => {

    const date = new Date().toISOString().split('T')[0];
    $('#date').text(date);


    const params = {};
    //const queryParams = window.location.search.substring(1);
    //const arr = queryParams.split('&');
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');

    const firestore = firebase.firestore();
    firestore.collection('appointment')
        .doc(id)
        .get()
        .then((res) => {
            if (res.exists) {
                const data = res.data();
                // $('#name').val(data.name);
                // $('#mobile').val(data.mobile);
                // $('#medicalHistory').val(data.medicalHistory);
                console.log(data)
                $('#appointmentId').text(res.id);
                $('#patientId').text(data.patientId);
                $('#patientName').text(data.patientName);
                $('#patientMobile').text(data.patientMobile);
                $('#patientMedicalHistory').text(data.patientMedicalHistory);
                $('#doctorName').text(data.doctorName);
                $('#patientMessage').text(data.message);
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
    loadData();
}