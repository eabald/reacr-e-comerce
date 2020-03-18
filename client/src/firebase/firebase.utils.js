import firebase from 'firebase/app'
import dotenv from 'dotenv'
import 'firebase/firestore'
import 'firebase/auth'

dotenv.config()

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASSE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
}

export const createUserProfileDocument = async (userAuth, additionaData) => {
  if (!userAuth) return
  const userRef = firestore.doc(`user/${userAuth.uid}`)
  const snapShot = await userRef.get()
  if (!snapShot.exists) {
    const {displayName, email} = userAuth
    const createdAt = new Date()
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionaData
      })
    } catch (error) {
      console.log('Error creating user', error)
    }
  }
  return userRef
}

export const getUserCartRef = async userId => {
  const cartsRef = firestore.collection('carts').doc(userId)
  const snapShot = await cartsRef.get()
  if (!snapShot.exists) {
    await cartsRef.set({ userId, cartItems: [] })
    const currentCart = await cartsRef.get()
    return currentCart.data().cartItems
  } else {
    return snapShot.data().cartItems
  }
}

export const updateUserCartRef = async (userId, cartItems) => {
  await firestore.collection('carts').doc(userId).set({ userId, cartItems })
  const currentCart = await firestore.collection('carts').doc(userId).get()
  return currentCart.data().cartItems
}

export const addCollectionsAndDocuments = async (collectionKey, objectsToAdd) => {
  const collectionRef = firestore.collection(collectionKey)
  console.log(collectionRef)

  const batch = firestore.batch()

  objectsToAdd.forEach(obj => {
    const newDocRef = collectionRef.doc()
    batch.set(newDocRef, obj)
  })

  return await batch.commit()
}

export const convertCollectionsSnapshotToMap = (collecions) => {
  const transformedCollection = collecions.docs.map(doc => {
    const { title, items } = doc.data()
    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items
    }
  })

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection
    return accumulator
  }, {})
}

export const getCurrentUser = () => {
  return new Promise((reslove, reject) => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      unsubscribe()
      reslove(userAuth)
    }, reject)
  })
}

firebase.initializeApp(config)

export const auth = firebase.auth()
export const firestore = firebase.firestore()

export const googleProvider = new firebase.auth.GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider)

export default firebase
