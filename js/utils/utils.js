export const loadAllIds=(collectionName,collectionId)=>{
    const firestore = firebase.firestore();
    firestore
        .collection(collectionName)
        .get()
        .then((response) => {
            $(collectionId).empty();
            response.forEach((records) => {
                const option = $('<option></option>').val(records.id).text(records.id);
                $(collectionId).append(option);
            });
        })
        .catch((err) => {
                console.log("Error loading patients:", err);
            }
        );
}
