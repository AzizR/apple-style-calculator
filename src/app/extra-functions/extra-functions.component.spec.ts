import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraFunctionsComponent } from './extra-functions.component';

describe('ExtraFunctionsComponent', () => {
  let component: ExtraFunctionsComponent;
  let fixture: ComponentFixture<ExtraFunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraFunctionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
