// import { Component, OnInit } from '@angular/core';
// import { Equipe } from '../../../../core/interface/equipe.interface';
// import { EquipeDetail, EquipeService, PageResponse } from '../../../../service/equipe.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import {PaginationComponent} from '../../../../shared/pagination.component';
//
// @Component({
//   selector: 'app-equipe-page',
//   templateUrl: './equipe-page.component.html',
//   imports: [CommonModule, FormsModule, PaginationComponent], // Ajout de FormsModule pour le select de pagination
//   standalone: true,
// })
// export class EquipePageComponent implements OnInit {
//   equipesPage: PageResponse<EquipeDetail> | null = null;
//   equipes: EquipeDetail[] = [];
//   loading = false;
//   error: string | null = null;
//   currentPage = 0;
//   pageSize = 10; // Increased page size for better UX
//   totalPages = 0;
//   totalElements = 0;
//
//
//   constructor(private equipeService: EquipeService) { }
//
//   ngOnInit(): void {
//     this.loadEquipes();
//   }
//
//
//   loadEquipes(): void {
//     this.loading = true;
//     this.equipeService.getEquipesWithDetails(this.currentPage, this.pageSize)
//       .subscribe({
//         next: (data) => {
//           this.equipesPage = data;
//           this.equipes = data.content; // Mettre à jour la liste des équipes
//           this.totalElements = data.totalElements;
//           this.totalPages = data.totalPages;
//           this.loading = false;
//           console.log(data)
//         },
//         error: (err) => {
//           // Gérer l'erreur
//         }
//       });
//   }
//
//
//
//   onPageSizeChange(size: number): void {
//     this.pageSize = size;
//     this.currentPage = 0; // Retour à la première page
//     this.loadEquipes();
//   }
//
//   onPageChange(page: number): void {
//     this.currentPage = page;
//     this.loadEquipes();
//   }
//
//
// }
import { Component, OnInit } from '@angular/core';
import { Equipe } from '../../../../core/interface/equipe.interface';
import { EquipeDetail, EquipeService, PageResponse } from '../../../../service/equipe.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationComponent } from '../../../../shared/pagination.component';
import {UserService} from '../../../../service/user.service';

@Component({
  selector: 'app-equipe-page',
  templateUrl: './equipe-page.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent],
  standalone: true,
})
export class EquipePageComponent implements OnInit {
  equipesPage: PageResponse<EquipeDetail> | null = null;
  equipes: EquipeDetail[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  // Form related properties
  equipeForm: FormGroup;
  isEditing = false;
  showForm = false;
  currentEquipeId: string | undefined = undefined;

  // Lists for dropdowns
  responsables: any[] = [];
  operateurs: any[] = [];
  techniciens: any[] = [];
  selectedTechniciens: string[] = [];

  constructor(
    private equipeService: EquipeService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.equipeForm = this.fb.group({
      responsableId: ['', Validators.required],
      operateurId: ['', Validators.required],
      technicienIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEquipes();
    this.loadUsers();
  }

  loadEquipes(): void {
    this.loading = true;
    this.equipeService.getEquipesWithDetails(this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.equipesPage = data;
          this.equipes = data.content;
          this.totalElements = data.totalElements;
          this.totalPages = data.totalPages;
          this.loading = false;
          console.log('Equipes loaded:', data);
        },
        error: (err) => {
          this.error = "Erreur lors du chargement des équipes";
          this.loading = false;
          console.error('Error loading equipes:', err);
        }
      });
  }

  private handleError(error: any): void {
    this.error = 'Erreur de chargement des utilisateurs: ' + error.message;
    this.loading = false;
  }

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


  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadEquipes();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEquipes();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.equipeForm.reset({
      responsableId: '',
      operateurId: '',
      technicienIds: []
    });
    this.selectedTechniciens = [];
    this.isEditing = false;
    this.currentEquipeId = undefined;
  }

  onEdit(equipe: EquipeDetail): void {
    this.isEditing = true;
    this.currentEquipeId = equipe.id;
    this.showForm = true;

    // Prepare selected techniciens
    this.selectedTechniciens = equipe.techniciens.map(tech => tech.id);

    this.equipeForm.patchValue({
      responsableId: equipe.responsable?.id || '',
      operateurId: equipe.operateur.id,
      technicienIds: this.selectedTechniciens
    });
  }

  onDelete(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe?')) {
      this.equipeService.deleteEquipe(id).subscribe({
        next: () => {
          console.log('Équipe supprimée avec succès');
          this.loadEquipes();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.equipeForm.invalid) {
      return;
    }

    const equipeData: Equipe = {
      responsableId: this.equipeForm.value.responsableId,
      operateurId: this.equipeForm.value.operateurId,
      technicienIds: this.equipeForm.value.technicienIds
    };

    if (this.isEditing && this.currentEquipeId) {
      // Update existing team
      this.equipeService.updateEquipe(this.currentEquipeId, equipeData).subscribe({
        next: () => {
          console.log('Équipe mise à jour avec succès');
          this.loadEquipes();
          this.resetForm();
          this.showForm = false;
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
        }
      });
    } else {
      // Create new team
      this.equipeService.createEquipe(equipeData).subscribe({
        next: () => {
          console.log('Équipe créée avec succès');
          this.loadEquipes();
          this.resetForm();
          this.showForm = false;
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
        }
      });
    }
  }

  onTechnicienChange(event: any, techId: string): void {
    if (event.target.checked) {
      // Add technicien to selection
      this.selectedTechniciens.push(techId);
    } else {
      // Remove technicien from selection
      this.selectedTechniciens = this.selectedTechniciens.filter(id => id !== techId);
    }

    // Update form control value
    this.equipeForm.get('technicienIds')?.setValue([...this.selectedTechniciens]);
  }

  isTechnicienSelected(techId: string): boolean {
    return this.selectedTechniciens.includes(techId);
  }
}
