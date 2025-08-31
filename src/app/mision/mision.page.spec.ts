import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisionPage } from './mision.page';

describe('MisionPage', () => {
  let component: MisionPage;
  let fixture: ComponentFixture<MisionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
