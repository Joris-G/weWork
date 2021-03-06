import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuth } from '@app/_interfaces/users/user-auth';
import { first } from 'rxjs/operators';
import { AlertService } from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';
import { DialogSimpleInfoComponent } from '@app/shared/dialog/dialog-simple-info/dialog-simple-info.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  hide:boolean = true;
  // password = new FormControl('');
  submitted = false;
  // loading = false;
  @ViewChild('qrcodeInput') qrcodeInput: ElementRef;
  @ViewChild('nameInput') nameInput: ElementRef;
  // @ViewChild('passwordInput') passwordInput: ElementRef;

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    ) {

    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['']);
    }
  }
  ngAfterViewInit(): void {
    this.qrcodeInput.nativeElement.focus();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      console.error('remplir les champs !');
      return;
    }
    // this.loading = true;

    const newUserAuth: UserAuth = {
      username: this.f.username.value,
      password: this.f.password.value
    }
    this.login(newUserAuth);

  }
  inputQrcodeAction() {
    const newUser: UserAuth = {
      username: this.qrcodeInput.nativeElement.value,
      password: 'Socata01',
    }
    this.login(newUser)
  }

  login(user: UserAuth) {
    this.authenticationService.login(user)
      .pipe(first())
      .subscribe(
        // (res)=>{console.log(res);}
      {

        next: (res) => {
        if(res){
      //     // get return url from query parameters or default to home page
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/app-home';
           this.router.navigateByUrl(returnUrl);
        }else{
          console.error(res);
          const dialogRef = this.dialog.open(DialogSimpleInfoComponent, {
            data: {
              type: 'alert',
              title : 'Erreur de connexion',
              message: "Votre nom d'utilisateur ou votre mot de passe est erron??"
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            // console.log(data);
          })
          // this.loading = false;
              //  this.router.navigate(['/app-login']);
        }
         },
      //   error: error => {
      //
      //   }
      // );
  });
  }
  focusQrCode() {
    this.qrcodeInput.nativeElement.focus();
  }
}

