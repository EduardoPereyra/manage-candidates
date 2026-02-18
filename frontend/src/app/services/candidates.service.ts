import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Candidate, CandidateDTO } from '../interfaces/candidate';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  private apiUrl = environment.apiUrl + '/candidates';

  constructor(private http: HttpClient) {}

  public getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl);
  }

  public addCandidate(candidate: CandidateDTO): Observable<Candidate> {
    return this.http.post<Candidate>(this.apiUrl, candidate);
  }

  public updateCandidate(
    candidateId: number,
    candidate: CandidateDTO,
  ): Observable<Candidate> {
    const apiUrl = `${this.apiUrl}/${candidateId}`;
    return this.http.put<Candidate>(apiUrl, candidate);
  }

  public deleteCandidate(candidateId: number): Observable<void> {
    const apiUrl = `${this.apiUrl}/${candidateId}`;
    return this.http.delete<void>(apiUrl);
  }

  public addCandidateWithFile(
    name: string,
    surname: string,
    file: File,
  ): Observable<Candidate> {
    const apiUrl = `${this.apiUrl}/upload`;
    const formData = new FormData();
    formData.append('excelFile', file);
    formData.append('name', name);
    formData.append('surname', surname);

    return this.http.post<Candidate>(apiUrl, formData);
  }

  public health(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/health`);
  }
}
