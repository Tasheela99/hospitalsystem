//import {loadAllIds} from "/js/utils/utils";

let billingInfo = [];
let netTotal = 0;
const billIdPrefix = "BILL-"

function generateBillId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }
    return randomId;
}

//loadAllIds("patient","#patient")


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
            }
        );
}
const loadAllMedicineIds = () => {
    const firestore = firebase.firestore();
    firestore
        .collection('medicine')
        .get()
        .then((response) => {
            $('#medicineId').empty();
            response.forEach((medicineRecords) => {
                const option = $('<option></option>').val(medicineRecords.id).text(medicineRecords.id);
                $('#medicineId').append(option);
            });
        })
        .catch((err) => {
            console.log("Error loading Medicine Id's:", err);
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
                $('#address').val(data.address);
            }
        });
});
$('#medicineId').on("change", function () {
    const patientId = $(this).val();
    const firestore = firebase.firestore();
    firestore.collection('medicine')
        .doc(patientId)
        .get()
        .then((res) => {
            if (res.exists) {
                const data = res.data();
                $('#medicineName').val(data.medicineName);
                $('#medicinePrice').val(data.medicinePrice);
            }
        });
});


const addMedicine = () => {


    const unitPrice = $('#medicinePrice').val();
    const medicineUnitPrice = Number.parseFloat(unitPrice).toFixed(2);
    const buyingQty = $('#medicineQuantity').val();
    const medicineBuyingQty = Number.parseInt(buyingQty);

    const totalCost = medicineUnitPrice * medicineBuyingQty;
    const billObj = {
        "medicineId": $('#medicineId').val(),
        "medicineName": $('#medicineName').val(),
        "medicineUnitPrice": medicineUnitPrice,
        "medicineBuyingQty": medicineBuyingQty,
        "totalCost": totalCost
    };
    billingInfo.push(billObj);

    $('#table-body').empty();
    billingInfo.forEach(data => {
        const row = `
            
            <tr>
                <td>${data.medicineId}</td>
                <td>${data.medicineName}</td>
                <td>${data.medicineUnitPrice}</td>
                <td>${data.medicineBuyingQty}</td>
                <td>${data.totalCost}</td>
                
            </tr>
            
        `;
        $('#table-body').append(row);
    });
    calculateCost();
}

const calculateCost = () => {
    billingInfo.forEach(data => {
        netTotal += data.totalCost;
    });
    let cost = Number.parseFloat(netTotal).toFixed(2)
    $('#netTotal').val(cost);
}

const calculateOutStanding = () => {
    const payments = $('#payments').val();
    const patientsPayment = Number.parseFloat(payments).toFixed(2);

    let outStandingBalance = netTotal - patientsPayment;
    $('#outStandingBalance').val(outStandingBalance);

}


const addToBill = () => {

    calculateOutStanding();


    const billId = billIdPrefix + generateBillId(6);
    const patientId = $('#patientId').val();
    const firestore = firebase.firestore();
    let obj = {
        billId: billId,
        patient: {
            patientId: patientId,
            name: $('#name').val(),
            mobile: $('#mobile').val(),
            address: $('#address').val()
        },
        billingDate: new Date().toISOString().split('T')[0],
        netTotal: Number.parseInt($('#netTotal').val()),
        outStandingBalance: Number.parseInt($('#outStandingBalance').val()),
        payment:Number.parseInt($('#payments').val()),
        medicines: []
    }
    billingInfo.forEach(data => {
        obj.medicines.push(data);
    });


    firestore.collection('bill')
        .doc(billId)
        .set(obj)
        .then((res) => {
            console.log(res)
        }).catch((err) => {
        console.log(err);
    });

}


window.onload = () => {
    loadAllPatientIds();
    loadAllMedicineIds();
}

