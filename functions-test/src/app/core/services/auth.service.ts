import { Injectable } from '@angular/core';

import { Buffer } from 'buffer';

import { CookieService } from '../cookie.service';
import { StorageService } from '../storage.service';
import { UtilsService } from '../utils.service';
import { BaseApi } from './base.service';
import { EntityService } from './entity.service';
import { UnityService } from './unity.service';
import { UserService } from './user/user.service';

interface DecryptedUser {
  userId: number;
  unityId: number;
  entityId: number;
}
interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _api: BaseApi,
    private _user: UserService,
    private _unity: UnityService,
    private _utils: UtilsService,
    private _cookie: CookieService,
    private _entity: EntityService,
    private _storage: StorageService
  ) {}

  async signIn(login: string, password: string): Promise<void> {
    return this._api
      .post('Authentication/login', { login, password })
      .then(async (res: LoginResponse) => {
        this._cookie.set('access_token', res.access_token, {
          seconds: res.expires_in,
        });
        this._cookie.set('refresh_token', res.refresh_token, {
          seconds: res.refresh_expires_in,
        });

        const dataStr = Buffer.from(res.access_token.split('.')[1], 'base64').toString();

        const decrypt: DecryptedUser = JSON.parse(dataStr);

        // USER
        const user = await this._user.getById(decrypt.userId);
        this._storage.setUser = user;

        // ENTITY
        const entity = await this._entity.getById(user.entityId);
        this._storage.setEntity = entity;

        // PRIMARY UNITY
        const unity = await this._unity.getById(user.unityId);
        this._storage.setUnity = unity;
      })
      .catch((err) => {
        if (err.status === 401)
          this._utils.message('Usuário ou senha inválido!', 'error');
        return Promise.reject(err);
      });
  }

  signOut() {
    localStorage.clear();
    this._cookie.delete('access_token');
    this._cookie.delete('refresh_token');
  }
}
