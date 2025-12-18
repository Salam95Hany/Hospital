import { Injectable } from '@angular/core';
import { SearchReportModel } from '../models/SearchReportModel';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {
  apiURL = environment.apiUrl;
  constructor(private http: HttpClient) { }

  DownloadFile(Model: SearchReportModel, fileName: string) {
    return this.http.post(this.apiURL + 'CreateReport/CreateGeneralReport', Model, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      map((response: any) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(new Blob([response.body], { type: response.body.type }));
        downloadLink.download = fileName;
        downloadLink.click();
      })
    );
  }
}
