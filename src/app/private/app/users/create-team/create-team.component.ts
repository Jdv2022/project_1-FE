import {
	ChangeDetectionStrategy,
	Component,
	OnInit
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger60ms } from '@vex/animations/stagger.animation';
import { NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreateTeamService } from './create-team.service';
import { ModelRequestBase } from 'src/app/core/base/model.request.base';
import { Router } from '@angular/router';
  
export interface CountryState {
	name: string;
	population: string;
	flag: string;
}
  
@Component({
	selector: 'vex-create-team',
	templateUrl: './create-team.component.html',
	styleUrls: ['./create-team.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [stagger60ms, fadeInUp400ms],
	standalone: true,
	imports: [
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		NgIf,
		ReactiveFormsModule
	],
	providers: [CreateTeamService]
})

export class CreateTeamComponent implements OnInit {

	teamForm!: FormGroup;

	constructor(
		private fb: UntypedFormBuilder,
		private service: CreateTeamService,
		private router: Router
	) {
		this.teamForm = this.fb.group({
			team_name: [null, Validators.required],
			description: [null, Validators.required],
		});
	}

	ngOnInit() {}

	onSubmit() {
		if (this.teamForm.invalid) return;
		let data = new ModelRequestBase();
		data.payload = this.teamForm.value;
		this.service.createTeam(data).subscribe(
			(response) => {
				this.router.navigate(['/private/users/team/details/', response.payload.result]);
			},
			(error) => {
				console.error('Team creation failed:', error);
			}
		);
	}

}
  