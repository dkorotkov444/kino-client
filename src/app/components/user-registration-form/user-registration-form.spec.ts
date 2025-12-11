import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistrationFormComponent } from './user-registration-form';

describe('UserRegistrationFormComponent', () => {
    let component: UserRegistrationFormComponent;
    let fixture: ComponentFixture<UserRegistrationFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        imports: [UserRegistrationFormComponent]
        })
        .compileComponents();

        fixture = TestBed.createComponent(UserRegistrationFormComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
