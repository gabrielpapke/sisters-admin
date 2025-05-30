import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralActionsComponent } from './general-actions.component';

describe('GeneralActionsComponent', () => {
  let component: GeneralActionsComponent;
  let fixture: ComponentFixture<GeneralActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
