import firebase from 'firebase/app'

export const createCart = (cart) => {

    return (dispatch) => {
        //make async call to database
        // firebase.firestore().collection('cart').doc(cart[0].idUser).set({...cart})
        // .then(() =>{
        dispatch({ type: 'CREATE_CART', payload: cart });
        // }).catch((err) => {
        //     dispatch({ type: 'CREATE_CART_ERROR', err });
        // })
    }
};

export const createBrand = (brand) => {
    return (dispatch) => {
        //make async call to database
        firebase.firestore().collection('brand').doc(brand.idBrand).set({ ...brand })
            .then((dispatch({ type: 'CREATE_BRAND', payload: brand })))
            .catch(err => dispatch({ type: 'CREATE_BRAND_ERROR', err }))
    }
};

export const readCart = ((dispatch) => {
    firebase.firestore().collection('cart').get()
        .then((querySnapshot) => {
            let data = []
            querySnapshot.forEach(doc => data = [...data, { ...doc.data() }])
            dispatch({ type: 'READ_CART', payload: data })
        }).catch(err => dispatch({ type: 'READ_CART_ERROR', err }))
})



export const deleteCart = (document) => {
    return (dispatch) => {
        firebase.firestore().collection('cart').doc(document).update({ deleted: true })
            .then((dispatch({ type: 'DELETE_CART' })))
            .catch(err => dispatch({ type: 'DELETE_CART_ERROR', err }))
    }
}

export const updateCart = (updateObject, document) => {
    return (dispatch) => {
        firebase.firestore().collection('cart').doc(document).update(updateObject)
            .then((dispatch({ type: 'UPDATE_CART', payload: updateObject })))
            .catch(err => dispatch({ type: 'UPDATE_CART_ERROR', err }))
    }
}

export const createImage = (image, reference) => {
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child(reference)
    imageRef.putString(image, 'data_url')
}

export const readImage = (reference) => {
    var storage = firebase.storage();
    var pathReference = storage.ref(reference);
    pathReference.getDownloadURL()
        .then(url => {
            return url
        })
}