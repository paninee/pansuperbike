// Firestore generic service. Used as a utility service to communite with Firestore.

import {Injectable, inject} from '@angular/core';
import {FirebaseError} from '@angular/fire/app';
import {
  CollectionReference, Firestore, addDoc,
  collection, doc, getDoc, getDocs, updateDoc
} from '@angular/fire/firestore';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) {
  }

  // Retrieve list of documents in specific collection
  async get<T>(path: string) {
    const collectionRef = collection(this.firestore, path);
    const docs = (await getDocs(collectionRef)).docs;
    return docs.map(doc => {
      return {...doc.data(), id: doc.id};
    }) as T;
  }

  // Retrieve a certain document by ID
  async getDocById<T>(path: string, id: string) {
    const docRef = doc(this.firestore, path, id);
    const docData = (await getDoc(docRef));
    if (docData.exists()) {
      return {...docData.data(), id: docData.id} as T;
    }
    this.notFound();
    return null
  }

  // Create and store a document
  async createDoc(path: string, data: any) {
    try {
      const collectionRef: CollectionReference = collection(this.firestore, path);
      const newDoc = await addDoc(collectionRef, data);
      return newDoc;
    } catch (error) {
      if (error instanceof FirebaseError) throw error.message;
      else throw 'Something went wrong. Please try again.';
    }
  }

  // Update a document
  async editDoc(path: string, data: any) {
    try {
      const docRef = doc(this.firestore, path);
      const docData = await updateDoc(docRef, data);
      return docData;
    } catch (error) {
      if (error instanceof FirebaseError) throw error.message;
      else throw 'Something went wrong. Please try again.';
    }
  }

  // get a document reference
  getDocRef(path: string) {
    return doc(this.firestore, path);
  }

  // Error handling. Redirect the user to a not-found page.
  notFound() {
    this.router.navigate(['not-found']);
  }

}
