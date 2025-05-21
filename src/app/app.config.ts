import { ApplicationConfig,importProvidersFrom,provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClient,provideHttpClient } from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader,TranslateService,TranslateStore,MissingTranslationHandler,FakeMissingTranslationHandler} from "@ngx-translate/core";
import { MultiLangServiceService } from './service/services/multi-lang-service.service';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
    new TranslateHttpLoader(http, './assets/i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(), 
     {provide: MultiLangServiceService,
     useClass: MultiLangServiceService,
    },
    {provide: TranslateStore,
     useClass: TranslateStore,
    },
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
          provide: MissingTranslationHandler,
          useClass: FakeMissingTranslationHandler
        }
    })]),
    TranslateService,
    TranslateStore,
    provideClientHydration(withEventReplay())]
};
