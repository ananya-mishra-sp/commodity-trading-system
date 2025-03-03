import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'commodity-trading-frontend';

  handleClickEvent(){
    alert("Function called")
    this.otherFunction()
  }

  otherFunction(){
    console.log("other function");
  }
}
