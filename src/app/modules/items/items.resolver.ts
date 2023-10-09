import {inject} from '@angular/core';
import {FirestoreService} from '../../shared/services/firebase/firestore.service';
import {ResolveFn} from '@angular/router';
import {EMPTY} from 'rxjs';
import {Item} from './item';

export const itemsResolver: ResolveFn<Item[]> = (route, state) => {
  // fetch items from firestore
  try {
    return inject(FirestoreService).get<Item[]>('items');
  } catch (error) {
    return EMPTY;
  }
};
