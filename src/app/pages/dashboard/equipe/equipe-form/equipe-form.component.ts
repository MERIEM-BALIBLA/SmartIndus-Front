import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {EquipeService} from '../../../../service/equipe.service';
import {User} from '../../../../core/interface/user.interface';
import {UserService} from '../../../../service/user.service';
import {CommonModule} from '@angular/common';
import {PaginationComponent} from '../../../../shared/pagination.component';

@Component({
  selector: 'app-equipe-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './equipe-form.component.html',
  styleUrl: './equipe-form.component.css'
})
export class EquipeFormComponent implements OnInit {
  equipeForm: FormGroup;
  responsables: User[] = [];
  operateurs: User[] = [];
  techniciens: User[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private equipeService: EquipeService,
    private userService: UserService
  ) {
    this.equipeForm = this.fb.group({
      responsableId: ['', Validators.required],
      operateurId: ['', Validators.required],
      technicienIds: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  // ngOnInit(): void {
  //   this.loadUsers();
  // }

  loadUsers(): void {
    this.loading = true;

    this.userService.getUsersByRole('RESPONSABLE_DE_MAINTENANCE').subscribe({
      next: (users) => this.responsables = users,
      error: (err) => this.handleError(err)

    });

    this.userService.getUsersByRole('OPERATEUR_DE_PRODUCTION').subscribe({
      next: (users) => this.operateurs = users,
      error: (err) => this.handleError(err)
    });

    this.userService.getUsersByRole('TECHNICIEN_DE_MAINTENANCE').subscribe({
      next: (users) => {
        this.techniciens = users;
        this.loading = false;
      },
      error: (err) => this.handleError(err)
    });
  }

  // onSubmit(): void {
  //   if (this.equipeForm.invalid) {
  //     this.markAllAsTouched();
  //     return;
  //   }
  //
  //   this.loading = true;
  //   this.error = null;
  //
  //   const equipeData = {
  //     responsableId: this.equipeForm.value.responsableId,
  //     operateurId: this.equipeForm.value.operateurId,
  //     technicienIds: this.equipeForm.value.technicienIds
  //   };
  //
  //   this.equipeService.createEquipe(equipeData).subscribe({
  //     next: () => {
  //       this.loading = false;
  //       this.equipeForm.reset();
  //       // Redirection ou message de succès
  //     },
  //     error: (err) => {
  //       this.error = 'Erreur lors de la création: ' + err.message;
  //       this.loading = false;
  //     }
  //   });
  // }

  private markAllAsTouched(): void {
    Object.values(this.equipeForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private handleError(error: any): void {
    this.error = 'Erreur de chargement des utilisateurs: ' + error.message;
    this.loading = false;
  }

  //
  editing: boolean = false; // true si on est en mode édition
  selectedEquipeId?: string; // ID de l'équipe à modifier (optionnel)

  ngOnInit(): void {
    this.loadUsers();

    if (this.selectedEquipeId) {
      this.editing = true;
      this.loadEquipe(this.selectedEquipeId); // pré-remplit le formulaire
    }

    this.initForm();
  }

  initForm(): void {
    this.equipeForm = this.fb.group({
      responsableId: ['', Validators.required],
      operateurId: ['', Validators.required],
      technicienIds: [[], Validators.required]
    });
  }

  onSubmit(): void {
    if (this.editing) {
      this.updateEquipe();
    } else {
      this.createEquipe();
    }
  }

  createEquipe(): void {
    const payload = this.equipeForm.value;
    // appel service pour créer
  }

  updateEquipe(): void {
    const payload = this.equipeForm.value;
    // appel service pour modifier (avec selectedEquipeId)
  }

  loadEquipe(id: string): void {
    this.equipeService.getEquipeById(id).subscribe(equipe => {
      this.equipeForm.patchValue({
        responsableId: equipe.responsableId,
        operateurId: equipe.operateurId,
        technicienIds: equipe.technicienIds
      });
    });
  }
}
