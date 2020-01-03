import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
  apiKey: "AIzaSyBlNfa9VmO60O9MEjmuij72xtJeFtaFloc",
  authDomain: "react-e-commerce-50e41.firebaseapp.com",
  databaseURL: "https://react-e-commerce-50e41.firebaseio.com",
  projectId: "react-e-commerce-50e41",
  storageBucket: "react-e-commerce-50e41.appspot.com",
  messagingSenderId: "372147010263",
  appId: "1:372147010263:web:d7d425e9f9f9694fed4e92"
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

export const addCollectionsAndDocuments = async (collectionKey, objectsToAdd) => {
  const collectionRef = firestore.collection(collectionKey)
  console.log(collectionRef)

  const batch = firestore.batch();

  objectsToAdd.forEach(obj => {
    const newDocRef = collectionRef.doc()
    batch.set(newDocRef, obj)
  })

  return await batch.commit()
}

export const convertCollectionsSnapshotToMap = (collecions) => {
  const transformedCollection = collecions.docs.map(doc => {
    const { title, items } = doc.data();
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

firebase.initializeApp(config)

export const auth = firebase.auth()
export const firestore = firebase.firestore()

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })
export const signInWithGoogle = () => auth.signInWithPopup(provider)

export default firebase
