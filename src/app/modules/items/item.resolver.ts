import {inject} from '@angular/core';
import {FirestoreService} from '../../shared/services/firebase/firestore.service';
import {ResolveFn} from '@angular/router';
import {EMPTY} from 'rxjs';
import {Item} from './item';

export const itemResolver: ResolveFn<Item | null> = (route, state) => {
  // fetch item by id from firestore
  const id = route.paramMap.get('id') as string;
  const firestoreService = inject(FirestoreService)
  try {
    return firestoreService.getDocById<Item>('items', id);
  } catch (error) {
    firestoreService.notFound();
    return EMPTY;
  }
};
