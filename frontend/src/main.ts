import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Check health before bootstrapping the app
const checkHealth = async () => {
  try {
    const response = await fetch(`${environment.apiUrl}/api/health`);
    if (response.ok) {
      console.log('Health check passed');
      return true;
    }
  } catch (error) {
    console.error('Health check failed, server might be down.', error);
  }
  return false;
};

// Wait for health check before bootstrapping
checkHealth().then(() => {
  bootstrapApplication(AppComponent, appConfig);
});
