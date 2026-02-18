import { Candidate } from '../../interfaces/candidate';
import { CandidateFormComponent } from './candidate-form.component';

describe('CandidateFormComponent', () => {
  let component: CandidateFormComponent;

  beforeEach(() => {
    component = new CandidateFormComponent();
  });

  it('should create the form with default values', () => {
    expect(component.candidateForm.value).toEqual({
      name: '',
      surname: '',
      seniority: '',
      yearsOfExperience: 1,
      availability: true,
    });
  });

  it('should emit addingCandidate when addCandidate is called with valid form', () => {
    const spy = jest.spyOn(component.addingCandidate, 'emit');
    component.candidateForm.setValue({
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      yearsOfExperience: 5,
      availability: true,
    });
    component.addCandidate();
    expect(spy).toHaveBeenCalledWith({
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      yearsOfExperience: 5,
      availability: true,
    });
  });

  it('should not emit addingCandidate when addCandidate is called with invalid form', () => {
    const spy = jest.spyOn(component.addingCandidate, 'emit');
    component.candidateForm.setValue({
      name: '',
      surname: '',
      seniority: '',
      yearsOfExperience: -1,
      availability: true,
    });
    component.addCandidate();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should reset the form when formReset is called', () => {
    component.candidateForm.setValue({
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      yearsOfExperience: 5,
      availability: false,
    });
    component.formReset();
    expect(component.candidateForm.value).toEqual({
      name: null,
      surname: null,
      seniority: null,
      yearsOfExperience: null,
      availability: true,
    });
  });

  it('should emit candidateEdited when saveEditCandidate is called with valid form', () => {
    const spy = jest.spyOn(component.candidateEdited, 'emit');
    component.editingCandidateId = 1;
    component.candidateForm.setValue({
      name: 'Jane',
      surname: 'Doe',
      seniority: 'junior',
      yearsOfExperience: 3,
      availability: true,
    });
    component.saveEditCandidate();
    expect(spy).toHaveBeenCalledWith({
      id: 1,
      name: 'Jane',
      surname: 'Doe',
      seniority: 'junior',
      yearsOfExperience: 3,
      availability: true,
    });
  });

  it('should emit editingCancelled when cancelEditing is called', () => {
    const spy = jest.spyOn(component.editingCancelled, 'emit');
    component.cancelEditing();
    expect(spy).toHaveBeenCalled();
  });

  it('should set editing candidate values correctly', () => {
    const candidate: Candidate = {
      id: 1,
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      yearsOfExperience: 5,
      availability: true,
    };
    component.setEditingCandidateValues(candidate);
    expect(component.candidateForm.value).toEqual({
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      yearsOfExperience: 5,
      availability: true,
    });
  });
});
