import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Candidate, CandidateDTO } from '../../interfaces/candidate';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSlideToggleModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './candidate-form.component.html',
  styleUrl: './candidate-form.component.scss',
})
export class CandidateFormComponent {
  @Input() editingCandidateId: number | null = null;
  @Output() addingCandidate = new EventEmitter<CandidateDTO>();
  @Output() editingCancelled = new EventEmitter<void>();
  @Output() candidateEdited = new EventEmitter<Candidate>();

  candidateForm = new FormBuilder().group({
    name: new FormControl<string>('', [Validators.required]),
    surname: new FormControl<string>('', [Validators.required]),
    seniority: new FormControl<string>('', [Validators.required]),
    yearsOfExperience: new FormControl<number>(1, [
      Validators.required,
      Validators.min(0),
      Validators.max(80),
    ]),
    availability: new FormControl(true),
  });

  setEditingCandidateValues(candidate: Candidate | null) {
    if (candidate) {
      this.candidateForm.setValue({
        name: candidate.name,
        surname: candidate.surname,
        seniority: candidate.seniority,
        yearsOfExperience: candidate.yearsOfExperience,
        availability: candidate.availability,
      });
    }
  }

  addCandidate() {
    if (this.candidateForm.valid) {
      this.addingCandidate.emit({
        name: this.candidateForm.value.name!,
        surname: this.candidateForm.value.surname!,
        seniority: this.candidateForm.value.seniority! as 'senior' | 'junior',
        yearsOfExperience: this.candidateForm.value.yearsOfExperience!,
        availability: this.candidateForm.value.availability!,
      } as CandidateDTO);
    }
  }

  formReset() {
    this.candidateForm.reset();
    this.candidateForm.reset({ availability: true });
  }

  saveEditCandidate() {
    if (this.candidateForm.valid && this.editingCandidateId !== null) {
      this.candidateEdited.emit({
        id: this.editingCandidateId!,
        name: this.candidateForm.value.name!,
        surname: this.candidateForm.value.surname!,
        seniority: this.candidateForm.value.seniority! as 'senior' | 'junior',
        yearsOfExperience: this.candidateForm.value.yearsOfExperience!,
        availability: this.candidateForm.value.availability!,
      });
    }
  }

  cancelEditing() {
    this.editingCancelled.emit();
  }
}
