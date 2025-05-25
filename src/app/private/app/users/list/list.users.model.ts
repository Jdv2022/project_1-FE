import { environment } from "src/environments/environment";
import { USERS_HEIRARCHY } from "src/static-data/users-heirarchy";

export class ListUsersModel {

	public id: string = '-';
	public username: string = '-';
	public userDetailsId: string = '-';
	public userDetailsAddress: string = '-';
	public userDetailsDateOfBirth: string = '-';
	public userDetailsEmail: string = '-';
	public userDetailsFirstName: string = '-';
	public userDetailsGender: string = '-';
	public userDetailsLastName: string = '-';
	public userDetailsMiddleName: string = '-';
	public userDetailsPhone: string = '-';
	public userDetailsProfileImageURL: string = '-';
	public heirarchy: Array<any> = [];
	public userRolesType1: string = '-';
	public name: string = '-';
	public userDepartmentsDepartmentName: string = '-';
  
	constructor(init?: Partial<ListUsersModel>) {
		if (init) {
			Object.assign(this, init);
			if(init.userDetailsProfileImageURL == 'null') {
				this.userDetailsProfileImageURL = environment.feBaseUrl + 'assets/img/avatars/noavatar.png'; 
			}
			else {
				this.userDetailsProfileImageURL = environment.getBaseUrl + init.userDetailsProfileImageURL; 
			}
			this.name = init.userDetailsFirstName + ' ' + init.userDetailsLastName;
			if(init.userRolesType1) {
				USERS_HEIRARCHY.forEach(element => {
					if(element.text == init.userRolesType1) {
						this.heirarchy.push(element);
					}
				})
				this.userRolesType1 = init.userRolesType1;
			}
		}
	}
  
}
  