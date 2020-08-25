import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  teste = 5
  formTest: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
   this.buildForm();
  }

  buildForm() {
    this.formTest = this.formBuilder.group({
      name: [null]
    });
  }

  onSubmit() {
    alert(this.formTest.value.name);
  }
}
