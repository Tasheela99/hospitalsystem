const loadData = () => {

    const date = new Date().toISOString().split('T')[0];
    $('#date').text(date);


    const params = {};
    //const queryParams = window.location.search.substring(1);
    //const arr = queryParams.split('&');
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');

    const firestore = firebase.firestore();
    firestore.collection('bill')
        .doc(id)
        .get()
        .then((res) => {
            if (res.exists) {
                const data = res.data();
                // $('#name').val(data.name);
                // $('#mobile').val(data.mobile);
                // $('#medicalHistory').val(data.medicalHistory);
                console.log(data)
                $('#billId').text(data.billId);
                $('#patientId').text(data.patient.patientId);
                $('#patientName').text(data.patient.name);
                $('#patientMobile').text(data.patient.mobile);
                $('#billingDate').text(data.billingDate);
                const billingDataRow = `
                
                <tr>
                    <td>${res.id}</td>                  
                    <td>${data.billingDate}</td>
                    <td>${"Rs." + data.netTotal}</td>
                    <td>${"Rs." + data.payment}</td>
                    <td>${"Rs." + data.outStandingBalance}</td>
                </tr>                
                `;
                $('#printed-bill-table-bill-body').append(billingDataRow);


                data.medicines.forEach(medicineRecords=>{

                    const medicineDataRow = `
                
                <tr>
                    <td>${medicineRecords.medicineId}</td>                  
                    <td>${medicineRecords.medicineName}</td>                  
                    <td>${medicineRecords.medicineUnitPrice}</td>                  
                    <td>${medicineRecords.medicineBuyingQty}</td>                  
                    <td>${medicineRecords.totalCost}</td>                  
                   
                </tr>                
                `;
                    $('#printed-bill-table-medicine-body').append(medicineDataRow);
                });

                $('#billTotal').text("Rs."+data.netTotal);
                $('#payment').text("Rs."+data.payment);
                let outStandings = $('#outStandingBalance').text("Rs."+data.outStandingBalance);

                if (outStandings !== 0) {
                    $('#paymentMessage')
                        .text("Payment Completed")
                        .addClass("payment-completed")
                        .removeClass("payment-not-completed");
                } else {
                    $('#paymentMessage')
                        .text("Payment Not Completed")
                        .addClass("payment-not-completed")
                        .removeClass("payment-completed");
                }



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