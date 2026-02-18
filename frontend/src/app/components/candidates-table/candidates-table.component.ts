import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Candidate, CandidateDTO } from '../../interfaces/candidate';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CandidatesService } from '../../services/candidates.service';
import { HttpClientModule } from '@angular/common/http';
import { CandidateFormComponent } from '../candidate-form/candidate-form.component';
import { CandidateFormWithFileComponent } from '../candidate-form-with-file/candidate-form-with-file.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-candidates-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    HttpClientModule,
    CandidateFormComponent,
    CandidateFormWithFileComponent,
  ],
  providers: [CandidatesService],
  templateUrl: './candidates-table.component.html',
  styleUrl: './candidates-table.component.scss',
})
export class CandidatesTableComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(CandidateFormComponent)
  candidateFormComponent: CandidateFormComponent = {} as CandidateFormComponent;
  @ViewChild(CandidateFormWithFileComponent)
  candidateFormWithFileComponent: CandidateFormWithFileComponent =
    {} as CandidateFormWithFileComponent;

  displayedColumns: string[] = [
    'name',
    'surname',
    'seniority',
    'yearsOfExperience',
    'availability',
    'actions',
  ];
  dataSource: MatTableDataSource<Candidate> = new MatTableDataSource<Candidate>(
    []
  );
  editingCandidateId: number | null = null;

  constructor(
    private candidatesService: CandidatesService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.candidatesService.getCandidates().subscribe({
      next: (candidates) => {
        this.dataSource = new MatTableDataSource<Candidate>(candidates);
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error fetching candidates:', error);
        this.openSnackBar('Error fetching candidates. Please try again later.');
      },
    });
  }

  deleteCandidate(id: number) {
    this.candidatesService.deleteCandidate(id).subscribe({
      next: () => {
        this.localDelete(id);
      },
      error: (error) => {
        console.error('Error deleting candidate:', error);
        this.openSnackBar('Error deleting candidate. Please try again later.');
      },
    });
  }

  localDelete(id: number) {
    this.dataSource.data = this.dataSource.data.filter(
      (candidate) => candidate.id !== id
    );
  }

  onCandidateAdded(candidateDTO: CandidateDTO) {
    const newCandidate: CandidateDTO = {
      name: candidateDTO.name,
      surname: candidateDTO.surname,
      seniority: candidateDTO.seniority as 'senior' | 'junior',
      yearsOfExperience: candidateDTO.yearsOfExperience,
      availability: candidateDTO.availability,
    };
    this.candidatesService.addCandidate(newCandidate).subscribe({
      next: (candidate) => {
        this.dataSource.data = [...this.dataSource.data, candidate];
        this.candidateFormComponent.formReset();
      },
      error: (error) => {
        console.error('Error adding candidate:', error);
        this.openSnackBar('Error adding candidate. Please try again later.');
      },
    });
    this.candidateFormComponent.formReset();
  }

  onCandidatesAddedByFile(values: {
    name: string;
    surname: string;
    file: File;
  }) {
    this.candidatesService
      .addCandidateWithFile(values.name, values.surname, values.file)
      .subscribe({
        next: (candidate) => {
          this.dataSource.data = [...this.dataSource.data, candidate];
          this.candidateFormWithFileComponent.formReset();
        },
        error: (error) => {
          console.error('Error adding candidate with file:', error);
          this.openSnackBar(
            'Error adding candidate with file. Please try again later.'
          );
        },
      });
  }

  editCandidate(candidate: Candidate) {
    this.editingCandidateId = candidate.id;
    this.candidateFormComponent.setEditingCandidateValues(candidate);
  }

  onSaveEditCandidate(candidate: Candidate) {
    const updatedCandidate: CandidateDTO = {
      name: candidate.name,
      surname: candidate.surname,
      seniority: candidate.seniority as 'senior' | 'junior',
      yearsOfExperience: candidate.yearsOfExperience,
      availability: candidate.availability,
    };

    this.candidatesService
      .updateCandidate(candidate.id, updatedCandidate)
      .subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.map((candidate) =>
            candidate.id === this.editingCandidateId
              ? { ...candidate, ...updatedCandidate }
              : candidate
          );
          this.cancelEditing();
        },
        error: (error) => {
          console.error('Error updating candidate:', error);
          this.openSnackBar(
            'Error updating candidate. Please try again later.'
          );
        },
      });
  }

  onEditingCancelled() {
    this.cancelEditing();
  }

  cancelEditing() {
    this.editingCandidateId = null;
    this.candidateFormComponent.formReset();
  }

  openSnackBar(errorMessage: string) {
    this._snackBar.open(errorMessage, 'Ok', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
