// Firebase storage utility service.

import {Injectable, inject} from '@angular/core';
import {FirebaseError} from '@angular/fire/app';
import {Storage, getDownloadURL, ref, uploadBytesResumable} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storage: Storage = inject(Storage);

  // Upload a file to specific path
  async upload(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, `${path}/${file.name}`);
      const task = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(task.ref);
      return url;
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw error.message;
      } else {
        throw 'Something went wrong. Please try again.';
      }
    }
  }
}
