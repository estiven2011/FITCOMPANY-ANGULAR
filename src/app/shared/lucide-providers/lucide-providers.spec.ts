import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LucideProviders } from './lucide-providers';

describe('LucideProviders', () => {
  let component: LucideProviders;
  let fixture: ComponentFixture<LucideProviders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LucideProviders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LucideProviders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
