import {Component, OnInit} from '@angular/core';
import {Form} from "./common/form";
import {UserService} from "./user.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
    selector: 'user',
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit{

    registerForm: FormGroup;

    constructor(private service: UserService, private fb: FormBuilder){
    }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            name: ['test'],
            currency: [1]
        });

    }

    submit(form:any)
    {
        this.service.register(form.value).subscribe(x => {
            console.log(x);
        });
    }
}
