const loadDoctorData = () => {

    const date = new Date().toISOString().split('T')[0];
    $('#date').text(date);


    const params = {};
    //const queryParams = window.location.search.substring(1);
    //const arr = queryParams.split('&');
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');

    const firestore = firebase.firestore();
    firestore.collection('doctor')
        .doc(id)
        .get()
        .then((res) => {
            if (res.exists) {
                const data = res.data();
                console.log(data)
                $('#doctorId').text(res.id);
                $('#doctorName').text(data.doctorName);
                $('#doctorMobile').text(data.doctorMobile);
                $('#doctorSpecialization').text(data.doctorSpecialization);
                $('#doctorAddress').text(data.doctorAddress);
                $('#doctorProvince').text(data.doctorProvince);
                $('#doctorCity').text(data.doctorCity);
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
    loadDoctorData();
}