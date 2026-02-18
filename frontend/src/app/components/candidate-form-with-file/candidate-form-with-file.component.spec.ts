import { CandidateFormWithFileComponent } from './candidate-form-with-file.component';

describe('CandidateFormWithFileComponent', () => {
  let component: CandidateFormWithFileComponent;

  beforeEach(() => {
    component = new CandidateFormWithFileComponent();
  });

  it('should create the form with default values', () => {
    expect(component.candidateByFileForm.value).toEqual({
      name: '',
      surname: '',
      file: null,
    });
  });

  it('should emit candidatesAddedByFile when form is valid and file is selected', () => {
    const spy = jest.spyOn(component.candidatesAddedByFile, 'emit');
    component.candidateByFileForm.setValue({
      name: 'John',
      surname: 'Doe',
      file: new File([''], 'test.txt'),
    });
    component.candidateFile = new File([''], 'test.txt');

    component.addCandidateByFile();

    expect(component.candidateByFileForm.valid).toBe(true);
    expect(spy).toHaveBeenCalledWith({
      name: 'John',
      surname: 'Doe',
      file: component.candidateFile,
    });
  });

  it('should not emit candidatesAddedByFile when form is invalid', () => {
    const spy = jest.spyOn(component.candidatesAddedByFile, 'emit');
    component.candidateByFileForm.setValue({
      name: '',
      surname: '',
      file: null,
    });
    component.candidateFile = new File([''], 'test.txt');

    component.addCandidateByFile();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should reset the form and candidateFile', () => {
    component.candidateByFileForm.setValue({
      name: 'John',
      surname: 'Doe',
      file: null,
    });
    component.candidateFile = new File([''], 'test.txt');

    component.formReset();

    expect(component.candidateByFileForm.value).toEqual({
      name: null,
      surname: null,
      file: null,
    });
    expect(component.candidateFile).toBeNull();
  });

  it('should set candidateFile when a file is selected', () => {
    const file = new File([''], 'test.txt');
    const event = { target: { files: [file] } } as unknown as Event;

    component.onFileSelected(event);

    expect(component.candidateFile).toBe(file);
  });
});
