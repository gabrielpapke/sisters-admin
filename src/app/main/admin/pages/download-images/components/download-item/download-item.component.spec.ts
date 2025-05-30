import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadItemComponent } from './download-item.component';

describe('DownloadItemComponent', () => {
  let component: DownloadItemComponent;
  let fixture: ComponentFixture<DownloadItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
