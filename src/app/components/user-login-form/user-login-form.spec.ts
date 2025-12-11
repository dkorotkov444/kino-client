import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoginFormComponent } from './user-login-form';

describe('UserLoginFormComponent', () => {
    let component: UserLoginFormComponent;
    let fixture: ComponentFixture<UserLoginFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        imports: [UserLoginFormComponent]
        })
        .compileComponents();

        fixture = TestBed.createComponent(UserLoginFormComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
