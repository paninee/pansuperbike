import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UploaderComponent} from './uploader.component';

describe('UploaderComponent', () => {
  let component: UploaderComponent;
  let fixture: ComponentFixture<UploaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UploaderComponent]
    });
    fixture = TestBed.createComponent(UploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
