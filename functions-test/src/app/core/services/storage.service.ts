import { Injectable } from '@angular/core';

import { User } from '../models/user';
import { Unity } from '../models/unity';
import { Entity } from '../models/entity';

@Injectable({
  providedIn: "root",
})
export class StorageService {

  constructor() { }

  // USER
  set setUser(data: User) {
    localStorage.setItem("user", JSON.stringify(data));
  }
  get getUser(): User {
    return JSON.parse(localStorage.getItem("user") || 'null');
  }
  removeUser() {
    localStorage.removeItem("user");
  }

  // UNITY
  set setUnity(data: Unity) {
    localStorage.setItem("unity", JSON.stringify(data));
  }
  get getUnity(): Unity {
    return JSON.parse(localStorage.getItem("unity") || 'null');
  }
  removeUnity() {
    localStorage.removeItem("unity");
  }

  // ENTITY
  set setEntity(data: Entity) {
    localStorage.setItem("entity", JSON.stringify(data));
  }
  get getEntity(): Entity {
    return JSON.parse(localStorage.getItem("entity") || 'null');
  }
  removeEntity() {
    localStorage.removeItem("entity");
  }
}
