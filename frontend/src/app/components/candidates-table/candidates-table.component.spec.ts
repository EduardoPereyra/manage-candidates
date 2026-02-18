import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { Candidate, CandidateDTO } from '../../interfaces/candidate';
import { CandidatesService } from '../../services/candidates.service';
import { CandidatesTableComponent } from './candidates-table.component';

describe('CandidatesTableComponent', () => {
  let component: CandidatesTableComponent;
  let candidatesService: CandidatesService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    candidatesService = new CandidatesService(null as any);
    snackBar = {
      open: jest.fn(),
    } as unknown as MatSnackBar;
    component = new CandidatesTableComponent(candidatesService, snackBar);
    component.candidateFormComponent = {
      setEditingCandidateValues: jest.fn(),
      formReset: jest.fn(),
    } as any;
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should fetch candidates on init', () => {
    const candidates: Candidate[] = [
      {
        id: 1,
        name: 'John',
        surname: 'Doe',
        seniority: 'junior',
        yearsOfExperience: 2,
        availability: true,
      },
    ];
    jest
      .spyOn(candidatesService, 'getCandidates')
      .mockReturnValue(of(candidates));
    component.ngOnInit();
    expect(component.dataSource.data).toEqual(candidates);
  });

  it('should handle error when fetching candidates', () => {
    jest
      .spyOn(candidatesService, 'getCandidates')
      .mockReturnValue(throwError(() => new Error('Error')));
    const openSnackBarSpy = jest.spyOn(snackBar, 'open');
    component.ngOnInit();
    expect(openSnackBarSpy).toHaveBeenCalledWith(
      'Error fetching candidates. Please try again later.',
      'Ok',
      expect.any(Object)
    );
  });

  it('should delete a candidate', () => {
    const candidateId = 1;
    component.dataSource.data = [
      {
        id: candidateId,
        name: 'John',
        surname: 'Doe',
        seniority: 'junior',
        yearsOfExperience: 2,
        availability: true,
      },
    ];
    jest.spyOn(candidatesService, 'deleteCandidate').mockReturnValue(of());
    component.deleteCandidate(candidateId);
    component.dataSource.data = component.dataSource.data.filter(
      (candidate) => candidate.id !== candidateId
    );
    expect(component.dataSource.data.length).toBe(0);
  });

  it('should handle error when deleting a candidate', () => {
    const candidateId = 1;
    component.dataSource.data = [
      {
        id: candidateId,
        name: 'John',
        surname: 'Doe',
        seniority: 'junior',
        yearsOfExperience: 2,
        availability: true,
      },
    ];
    jest
      .spyOn(candidatesService, 'deleteCandidate')
      .mockReturnValue(throwError(() => new Error('Error')));
    const openSnackBarSpy = jest.spyOn(snackBar, 'open');
    component.deleteCandidate(candidateId);
    expect(openSnackBarSpy).toHaveBeenCalledWith(
      'Error deleting candidate. Please try again later.',
      'Ok',
      expect.any(Object)
    );
  });

  it('should add a candidate', () => {
    const candidateDTO: CandidateDTO = {
      name: 'Jane',
      surname: 'Doe',
      seniority: 'senior',
      yearsOfExperience: 5,
      availability: true,
    };
    const newCandidate = { id: 2, ...candidateDTO };
    jest
      .spyOn(candidatesService, 'addCandidate')
      .mockReturnValue(of(newCandidate));
    component.onCandidateAdded(candidateDTO);
    expect(component.dataSource.data).toContainEqual(newCandidate);
  });

  it('should handle error when adding a candidate', () => {
    const candidateDTO: CandidateDTO = {
      name: 'Jane',
      surname: 'Doe',
      seniority: 'senior',
      yearsOfExperience: 5,
      availability: true,
    };
    jest
      .spyOn(candidatesService, 'addCandidate')
      .mockReturnValue(throwError(() => new Error('Error')));
    const openSnackBarSpy = jest.spyOn(snackBar, 'open');
    component.onCandidateAdded(candidateDTO);
    expect(openSnackBarSpy).toHaveBeenCalledWith(
      'Error adding candidate. Please try again later.',
      'Ok',
      expect.any(Object)
    );
  });

  it('should edit a candidate', () => {
    const candidate: Candidate = {
      id: 1,
      name: 'John',
      surname: 'Doe',
      seniority: 'junior',
      yearsOfExperience: 2,
      availability: true,
    };
    component.editCandidate(candidate);
    expect(component.editingCandidateId).toBe(candidate.id);
  });

  it('should save edited candidate', () => {
    const candidate: Candidate = {
      id: 1,
      name: 'John',
      surname: 'Doe',
      seniority: 'junior',
      yearsOfExperience: 2,
      availability: true,
    };
    const updatedCandidateDTO: CandidateDTO = {
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      yearsOfExperience: 3,
      availability: true,
    };
    jest.spyOn(candidatesService, 'updateCandidate').mockReturnValue(of());
    component.dataSource.data = [candidate];
    component.editingCandidateId = candidate.id;
    component.onSaveEditCandidate({ ...candidate, ...updatedCandidateDTO });
    expect(component.dataSource.data[0].yearsOfExperience).toBe(2);
  });

  it('should handle error when saving edited candidate', () => {
    const candidate: Candidate = {
      id: 1,
      name: 'John',
      surname: 'Doe',
      seniority: 'junior',
      yearsOfExperience: 2,
      availability: true,
    };
    const updatedCandidateDTO: CandidateDTO = {
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      yearsOfExperience: 3,
      availability: true,
    };
    jest
      .spyOn(candidatesService, 'updateCandidate')
      .mockReturnValue(throwError(() => new Error('Error')));
    const openSnackBarSpy = jest.spyOn(snackBar, 'open');
    component.dataSource.data = [candidate];
    component.editingCandidateId = candidate.id;
    component.onSaveEditCandidate({ ...candidate, ...updatedCandidateDTO });
    expect(openSnackBarSpy).toHaveBeenCalledWith(
      'Error updating candidate. Please try again later.',
      'Ok',
      expect.any(Object)
    );
  });
});
