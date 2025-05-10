import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitPermissionComponent } from './wait-permission.component';

describe('WaitPermissionComponent', () => {
  let component: WaitPermissionComponent;
  let fixture: ComponentFixture<WaitPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitPermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
