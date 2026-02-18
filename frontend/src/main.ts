import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { CandidatesService } from './app/services/candidates.service';

// Call health endpoint before bootstrapping
const injector = bootstrapApplication(AppComponent, appConfig).then((appRef) =>
  appRef.injector.get(CandidatesService),
);

injector.then((candidatesService) => {
  candidatesService.health().subscribe({
    next: () => {
      console.log('Health check passed');
    },
    error: () => {
      console.error('Health check failed, server might be down.');
    },
  });
});
