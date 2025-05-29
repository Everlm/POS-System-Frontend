import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IconsService } from "@shared/services/icons.service";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "vex-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  inputType = "password";
  visible = false;
  loading = false;

  icVisibility = IconsService.prototype.getIcon("icVisibility");
  icVisibilityOff = IconsService.prototype.getIcon("icVisibilityOff");

  initForm(): void {
    this.form = this.fb.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  login(): void {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((control) =>
        control.markAllAsTouched()
      );
    }

    this.loading = true;

    this.authService.login(this.form.value, "Interno").subscribe({
      next: (resp) => {
        if (resp.isSuccess) {
          this.router.navigate(["/"]);
        }
      },
      error: (err) => {
        console.error("Error during login:", err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = "password";
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = "text";
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
