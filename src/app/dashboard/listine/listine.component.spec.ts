import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListineComponent } from './listine.component';

describe('ListineComponent', () => {
  let component: ListineComponent;
  let fixture: ComponentFixture<ListineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
