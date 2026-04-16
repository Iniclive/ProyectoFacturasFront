import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrencyDialogComponent } from './concurrency-dialog.component';

describe('ConcurrencyDialogComponent', () => {
  let component: ConcurrencyDialogComponent;
  let fixture: ComponentFixture<ConcurrencyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcurrencyDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcurrencyDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
