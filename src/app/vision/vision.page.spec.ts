import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisionPage } from './vision.page';

describe('VisionPage', () => {
  let component: VisionPage;
  let fixture: ComponentFixture<VisionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
