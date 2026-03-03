import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultLoanComponent } from './result-loan.component';

describe('ResultLoanComponent', () => {
  let component: ResultLoanComponent;
  let fixture: ComponentFixture<ResultLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
