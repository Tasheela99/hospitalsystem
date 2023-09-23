const firestore = firebase.firestore();


const fetchCounts = async () => {
    try {
        const doctorsCount = parseInt(await firestore.collection('doctor').get().then(querySnapshot => querySnapshot.size), 10);
        const patientsCount = parseInt(await firestore.collection('patient').get().then(querySnapshot => querySnapshot.size), 10);
        const medicinesCount = parseInt(await firestore.collection('medicine').get().then(querySnapshot => querySnapshot.size), 10);
        const appointmentsCount = parseInt(await firestore.collection('appointment').get().then(querySnapshot => querySnapshot.size), 10);
        createChart([doctorsCount, patientsCount, medicinesCount, appointmentsCount]);

        $('#patientCount').text(patientsCount);
        $('#doctorCount').text(doctorsCount);
        $('#appointmentCount').text(appointmentsCount);
        $('#medicineCount').text(medicinesCount);


    } catch (error) {
        console.error('Error fetching counts from Firestore: ', error);
    }



};


const createChart = (counts) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Doctors', 'Patients', 'Medicines', 'Appointments'],
            datasets: [
                {
                    label: 'Count',
                    data: counts,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
};

window.onload = () => {
    fetchCounts();
};