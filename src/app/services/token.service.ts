import { Injectable } from '@angular/core';

export interface Token {
  user_token?: string;
  secret_key?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public saveData({ user_token, secret_key }: Token) {
    localStorage.setItem('user_token', user_token ?? '');
    localStorage.setItem('secret_key', secret_key ?? '');
  }

  public getData(): Token {
    const user_token = localStorage.getItem('user_token') ?? '';
    const secret_key = localStorage.getItem('secret_key') ?? '';

    return { user_token, secret_key };
  }
}
