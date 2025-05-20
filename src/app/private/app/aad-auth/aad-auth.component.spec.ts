import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadAuthComponent } from './aad-auth.component';

describe('AadAuthComponent', () => {
  let component: AadAuthComponent;
  let fixture: ComponentFixture<AadAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AadAuthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AadAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
