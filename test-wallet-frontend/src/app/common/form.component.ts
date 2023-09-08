import {Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import {Form} from "./form";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../user.service";


@Component({
    selector: 'form-template',
    templateUrl: './form.component.html'
})

export class FormComponent implements OnInit {

    @Input() parentForm: FormGroup;
    @Input() walletId: string;
    @Input() name: string;
    @Input() fields: {};
    @Output() submitForm = new EventEmitter();

    objectKeys: any;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {

        this.objectKeys = Object.keys(this.fields);
    }

    onSubmit() {
        if(!this.parentForm.invalid) {
            this.submitForm.emit(this.parentForm);
        }

    }
}
