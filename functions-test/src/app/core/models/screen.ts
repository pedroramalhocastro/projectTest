import { Base } from "./base";
import { Department } from "./department";

export class Screen extends Base {
  name!: string;
  departmentId!: number;

  department?: Department;
}
