import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import icClose from "@iconify/icons-ic/twotone-close"
import * as configs from '../../../../static-data/configs'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '@shared/services/alert.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'vex-category-manage',
  templateUrl: './category-manage.component.html',
  styleUrls: ['./category-manage.component.scss']
})
export class CategoryManageComponent implements OnInit {

  icClose = icClose
  configs = configs

  form: FormGroup

  initForm(): void {
    this.form = this._fb.group({
      categoryId: [0, [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      state: ['', Validators.required]
    })
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _categoryService: CategoryService,
    private _dialogRef: MatDialogRef<CategoryManageComponent>

  ) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  CategorySave(): void {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }

    const categoryId = this.form.get('categoryId').value

    if (categoryId > 0) {
      this.CategoryEdit(categoryId)
    }
    else {
      this.CategoryRegister()
    }
  }

  CategoryRegister(): void {
    this._categoryService.CategoryRegister(this.form.value).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success('Nice', resp.message)
        this._dialogRef.close()
      }
      else {
        this._alert.warn('Warning', resp.message)
      }
    })

  }

  CategoryEdit(categoryId: number): void {

  }

}
