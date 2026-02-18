import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-candidate-form-with-file',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSlideToggleModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './candidate-form-with-file.component.html',
  styleUrl: './candidate-form-with-file.component.scss',
})
export class CandidateFormWithFileComponent {
  @Output() candidatesAddedByFile = new EventEmitter<any>();

  candidateByFileForm = new FormBuilder().group({
    name: new FormControl<string>('', [Validators.required]),
    surname: new FormControl<string>('', [Validators.required]),
    file: new FormControl<File | null>(null, [Validators.required]),
  });
  candidateFile: File | null = null;

  onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    this.candidateFile = files ? files[0] : null;
  }

  addCandidateByFile(): void {
    if (this.candidateByFileForm.valid && this.candidateFile) {
      this.candidatesAddedByFile.emit({
        name: this.candidateByFileForm.value.name,
        surname: this.candidateByFileForm.value.surname,
        file: this.candidateFile,
      });
    }
  }

  formReset(): void {
    this.candidateByFileForm.reset({
      name: null,
      surname: null,
    });
    this.candidateFile = null;
  }

  downloadTemplate() {
    // Create a workbook with sample headers
    const ws_data = [['seniority', 'yearsOfExperience', 'availability']];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'candidate_template.xlsx');
  }
}
