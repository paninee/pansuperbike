import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateEditWarehouseComponent} from './create-edit-warehouse.component';

describe('CreateEditWarehouseComponent', () => {
  let component: CreateEditWarehouseComponent;
  let fixture: ComponentFixture<CreateEditWarehouseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateEditWarehouseComponent]
    });
    fixture = TestBed.createComponent(CreateEditWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
