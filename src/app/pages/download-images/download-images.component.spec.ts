import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadImagesComponent } from './download-images.component';

describe('DownloadImagesComponent', () => {
  let component: DownloadImagesComponent;
  let fixture: ComponentFixture<DownloadImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadImagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
