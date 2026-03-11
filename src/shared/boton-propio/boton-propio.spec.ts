import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonPropio } from './boton-propio';

describe('BotonPropio', () => {
  let component: BotonPropio;
  let fixture: ComponentFixture<BotonPropio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonPropio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonPropio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
