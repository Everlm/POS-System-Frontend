import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AlertService } from "@shared/services/alert.service";
import { ProductService } from "../../services/product.service";
import { CategorySelectService } from "@shared/services/category-select.service";
import { IconsService } from "@shared/services/icons.service";
import { statesSelect } from "src/static-data/configs";
import { SelectAutoComplete } from "@shared/models/select-autocomplete.interface";

@Component({
  selector: "vex-product-manage",
  templateUrl: "./product-manage.component.html",
  styleUrls: ["./product-manage.component.scss"],
})
export class ProductManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = statesSelect;
  mode: string = "";
  categorySelect: SelectAutoComplete[];
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _productService: ProductService,
    public _dialogRef: MatDialogRef<ProductManageComponent>,
    private _categorySelectService: CategorySelectService
  ) {
    this.mode = data.mode;
  }

  ngOnInit(): void {
    this.listSelectCategories();
    this.initForm();
  }

  initForm(): void {
    this.form = this._fb.group({
      productId: [0, [Validators.required]],
      code: ["", [Validators.required]],
      name: ["", [Validators.required]],
      stockMin: [0, [Validators.required, Validators.min(1)]],
      stockMax: [0, [Validators.required, Validators.min(1)]],
      image: [""],
      unitSalePrice: [0, [Validators.required]],
      categoryId: ["", [Validators.required]],
      state: ["", [Validators.required]],
    });
  }

  listSelectCategories(): void {
    this._categorySelectService.listSelectCategories().subscribe((resp) => {
      this.categorySelect = resp;
    });
  }

  selectedImage(file: File) {
    this.form.get("image").setValue(file);
  }

  manageProduct(): void {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }
    const productId = this.form.get("productId").value;
    productId > 0 ? this.updateProduct(productId) : this.createProduct();
  }

  productById(productId: number): void {
    this._productService.productById(productId).subscribe((resp) => {
      this.form.reset({
        productId: resp.productId,
        code: resp.code,
        name: resp.name,
        stockMin: resp.stockMin,
        stockMax: resp.stockMax,
        image: resp.image,
        unitSalePrice: resp.unitSalePrice,
        categoryId: resp.categoryId,
        state: resp.state,
      });
    });
  }

  createProduct(): void {
    // this._productService.createProduct(this.form.value).subscribe((resp) => {
    //   if (resp.isSuccess) {
    //     this._alert.success("Excelente", resp.message);
    //     this._dialogRef.close(true);
    //   } else {
    //     this._alert.warn("Atención", resp.message);
    //   }
    // });
  }

  updateProduct(productId: number): void {
    // this._productService
    //   .updateProduct(productId, this.form.value)
    //   .subscribe((resp) => {
    //     if (resp.isSuccess) {
    //       this._alert.success("Excelente", resp.message);
    //       this._dialogRef.close(true);
    //     } else {
    //       this._alert.warn("Atención", resp.message);
    //     }
    //   });
  }
}
