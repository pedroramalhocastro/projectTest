import {Base} from './base';
import {Profile} from './profile';
import {Screen} from './screen';
import {Unity} from './unity';

export class User extends Base {
  unityId!: number;
  unityCorporateName!: string;
  unityFantasyName!: string;
  profileId!: number;
  name!: string;
  email!: string;
  entityId!: number;
  screens: Screen[];
  unities: Unity[];
  password?: string;
  type?: string;
  profile?: Profile;
  pictureFile?: File | Blob;
  pictureBase64?: string;
  status?: string;
  active!: boolean;
  unityIds?: number[];

  constructor() {
    super();
    this.screens = [];
    this.unities = [];
  }
}
