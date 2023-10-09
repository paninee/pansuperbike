import {inject} from '@angular/core';
import {ResolveFn} from '@angular/router';
import {Warehouse} from './warehouse';
import {FirestoreService} from 'src/app/shared/services/firebase/firestore.service';
import {EMPTY} from 'rxjs';

export const warehousesResolver: ResolveFn<Warehouse[]> = (route, state) => {
  // fetch warehouses from firestore
  try {
    return inject(FirestoreService).get<Warehouse[]>('warehouses');
  } catch (error) {
    return EMPTY;
  }
};
