import { Base } from "./base";
import { Screen } from "./screen";

export class Profile extends Base {
  name!: string;
  screenIds: number[];

  screens?: Screen[];

  constructor() {
    super();
    this.screenIds = [];
    this.screens = [];
  }
}

export class ProfileSave {
  name!: string;
  screenIds: number[];

  screens?: Screen[];

  constructor() {
    this.screenIds = [];
    this.screens = [];
  }
}

