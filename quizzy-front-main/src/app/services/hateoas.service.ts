import { Injectable } from '@angular/core';

export enum HateoasUrl {
  CreateQuiz = 'createQuiz',
  GetQuizAfterPost = 'getQuiz',
}

@Injectable({
  providedIn: 'root'
})
export class HateoasService {
  private urls = new Map<string, string>;

  addUrl(key: HateoasUrl, url: string) {
    this.urls.set(key, url);
  }

  getUrl(key: HateoasUrl): string {
    return this.urls.get(key) ?? '';
  }

  hasUrl(key: HateoasUrl): boolean {
    return this.urls.has(key);
  }
}
