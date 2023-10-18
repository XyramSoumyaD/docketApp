import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { CurrencyClass } from './models/currency-class.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  arrayBuffer: any;
  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    startTime: new FormControl(''),
    endTime: new FormControl(''),
    NoOfHoursWorked: new FormControl(''),
    ratePerHour: new FormControl(''),
    supplierName: new FormControl(''),
    purchaseOrder: new FormControl(''),
  });
  submitted = false;
  data: any;
  supplierData: any;
  poData: any;
  

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) {
   
  }


  ngOnInit(): void { 
    this.loadData();   
  }

  loadData(){
    this.httpClient.get("./assets/purchaseDetails.xlsx",{responseType: 'arraybuffer'}).subscribe( (response: any) =>{    
      var arraybuffer = response;
      /* convert data to binary string */
      var data = new Uint8Array(arraybuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");    
      /* Call XLSX */
      var workbook = XLSX.read(bstr, {type:"binary"});

      /* DO SOMETHING WITH workbook HERE */
      var first_sheet_name = workbook.SheetNames[0];
      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name];
      let excelData = XLSX.utils.sheet_to_json(worksheet,{raw:true});
      this.data = excelData;
      this.formatData();
    });
  }

  formatData(){
    this.supplierData=[];
    this.data.forEach((element:any) => {
      const currency = {
         pONumber: element['PO Number'], 
         supplier: element['Supplier'], 
         description: element['Description']
      }    
      this.supplierData.push(currency);
    });
    this.supplierData = this.supplierData.filter((item: any) => item.supplier !== '')
    
  }

  loadSupplierData(){
    this.formatData();   
  }

  getPurchangeOrder(event: any){
    this.poData=[];
    const poId = this.form.controls['supplierName'].value;
    this.poData = this.supplierData.filter((item: any) => item.pONumber === poId);   
    console.log(this.supplierData);
  }


  onSubmit(): void {
    this.submitted = true;
    const poId = this.form.controls['supplierName'].value;
    this.supplierData = this.supplierData.filter((val: any) => val.pONumber == poId);
  }

}
