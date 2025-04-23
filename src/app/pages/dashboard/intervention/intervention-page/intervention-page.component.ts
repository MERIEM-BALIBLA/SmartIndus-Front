import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {PaginationComponent} from '../../../../shared/pagination.component';
import {InterventionService} from '../../../../service/intervention.service';
import {Intervention} from '../../../../core/interface/intervention.interface';

@Component({
  selector: 'app-intervention-page',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgClass, // Added NgClass to imports array
    PaginationComponent,
    ReactiveFormsModule
  ],
  templateUrl: './intervention-page.component.html',
  styleUrl: './intervention-page.component.css'
})
export class InterventionPageComponent {
  interventions: Intervention[] = [];
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  interventionForm: FormGroup;
  isEditing = false;
  showForm = false;
  currentInterventionId: string | undefined = undefined;

  constructor(
    private interventionService: InterventionService,
    private fb: FormBuilder
  ) {
    this.interventionForm = this.fb.group({
      type: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      interventionId: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  loadInterventions(): void {
    this.interventionService.getInterventions(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.interventions = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        console.log('Interventions loaded:', this.interventions);
      },
      error: (error) => {
        console.error('Error loading interventions:', error);
      }
    });
  }

  ngOnInit(): void {
    this.loadInterventions();
  }

  onDelete(id: string ): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet équipement?')) {
      this.interventionService.deleteIntervention(id).subscribe({
        next: () => {
          console.log('Intervention supprimé avec succès');
          this.loadInterventions(); // Recharger les équipements après la suppression
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadInterventions();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.interventionForm.reset({
      type: '',
      dateDebut: '',
      dateFin: '',
      interventionId: '',
      status: ''
    });
    this.isEditing = false;
    this.currentInterventionId = undefined; // Changed from null to undefined
  }

  onEdit(equipement: Intervention): void {
    this.isEditing = true;
    this.currentInterventionId = equipement.id;
    this.showForm = true;

    this.interventionForm.patchValue({
      type: equipement.type,
      dateDebut: equipement.dateDebut,
      dateFin: equipement.dateFin,
      equipementId: equipement.equipementId,
      status: equipement.status
    });
  }

  onSubmit(): void {
    if (this.interventionForm.invalid) {
      return;
    }

    const interventionData = this.interventionForm.value;

    if (this.isEditing && this.currentInterventionId) {
      // Update existing equipment
      this.interventionService.updateIntervention(this.currentInterventionId, interventionData).subscribe({
        next: () => {
          console.log('Intervention mis à jour avec succès');
          this.loadInterventions();
          this.resetForm();
          this.showForm = false;
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
        }
      });
    } else {
      // Create new equipment
      this.interventionService.createIntervention(interventionData).subscribe({
        next: () => {
          console.log('Intervention créé avec succès');
          this.loadInterventions();
          this.resetForm();
          this.showForm = false;
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
        }
      });
    }
  }


}
