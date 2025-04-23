// import {Component, OnInit} from '@angular/core';
// import {EquipementService} from '../../../../service/equipement-service';
// import {Equipement} from '../../../../core/interface/equipement-interface';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {NgForOf, NgIf} from '@angular/common';
// import {PaginationComponent} from '../../../../shared/pagination.component';
//
// @Component({
//   selector: 'app-equipement-page',
//   imports: [
//     FormsModule,
//     NgForOf,
//     NgIf,
//     PaginationComponent,
//     ReactiveFormsModule
//   ],
//   templateUrl: './equipement-page.component.html',
//   styleUrl: './equipement-page.component.css'
// })
// export class EquipementPageComponent implements OnInit{
//   equipements: Equipement[] = [];
//   currentPage = 0;
//   pageSize = 10;
//   totalPages = 0;
//   totalElements = 0;
//
//   constructor(private equipementService: EquipementService) { }
//
//   loadEquipements(): void {
//     this.equipementService.getEquipements(this.currentPage, this.pageSize).subscribe({
//       next: (response) => {
//         this.equipements = response.content;
//         this.totalPages = response.totalPages;
//         this.totalElements = response.totalElements;
//         console.log('Users loaded:', this.equipements);
//       },
//       error: (error) => {
//         console.error('Error loading users:', error);
//       }
//     });
//   }
//
//   ngOnInit(): void {
//     this.loadEquipements();
//   }
//
//   onDelete(id: string): void {
//     if (confirm('Are you sure you want to delete this user?')) {
//       this.equipementService.deleteEquipement(id).subscribe({
//         next: () => {
//           console.log('User deleted successfully');
//           this.loadEquipements(); // Reload users after deletion
//         },
//         error: (error) => {
//           console.error('Error deleting user:', error);
//         }
//       });
//     }
//   }
//
//   onPageChange(page: number): void {
//     this.currentPage = page;
//     this.loadEquipements();
//   }
// }
import {Component, OnInit} from '@angular/core';
import {EquipementService} from '../../../../service/equipement-service';
import {Equipement} from '../../../../core/interface/equipement-interface';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {PaginationComponent} from '../../../../shared/pagination.component';

@Component({
  selector: 'app-equipement-page',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgClass, // Added NgClass to imports array
    PaginationComponent,
    ReactiveFormsModule
  ],
  templateUrl: './equipement-page.component.html',
  styleUrl: './equipement-page.component.css'
})
export class EquipementPageComponent implements OnInit {
  equipements: Equipement[] = [];
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  equipementForm: FormGroup;
  isEditing = false;
  showForm = false;
  currentEquipementId: string | undefined = undefined;

  constructor(
    private equipementService: EquipementService,
    private fb: FormBuilder
  ) {
    this.equipementForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      type: ['', Validators.required],
      etatEquipement: ['BON_ETAT']
    });
  }

  loadEquipements(): void {
    this.equipementService.getEquipements(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.equipements = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        console.log('Equipements loaded:', this.equipements);
      },
      error: (error) => {
        console.error('Error loading equipements:', error);
      }
    });
  }

  ngOnInit(): void {
    this.loadEquipements();
  }

  onDelete(id: string ): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet équipement?')) {
      this.equipementService.deleteEquipement(id).subscribe({
        next: () => {
          console.log('Equipement supprimé avec succès');
          this.loadEquipements(); // Recharger les équipements après la suppression
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEquipements();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.equipementForm.reset({
      nom: '',
      type: '',
      etatEquipement: 'BON_ETAT'
    });
    this.isEditing = false;
    this.currentEquipementId = undefined; // Changed from null to undefined
  }

  onEdit(equipement: Equipement): void {
    this.isEditing = true;
    this.currentEquipementId = equipement.id;
    this.showForm = true;

    this.equipementForm.patchValue({
      nom: equipement.nom,
      type: equipement.type,
      etatEquipement: equipement.etatEquipement
    });
  }

  onSubmit(): void {
    if (this.equipementForm.invalid) {
      return;
    }

    const equipementData = this.equipementForm.value;

    if (this.isEditing && this.currentEquipementId) {
      // Update existing equipment
      this.equipementService.updateEquipement(this.currentEquipementId, equipementData).subscribe({
        next: () => {
          console.log('Equipement mis à jour avec succès');
          this.loadEquipements();
          this.resetForm();
          this.showForm = false;
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
        }
      });
    } else {
      // Create new equipment
      this.equipementService.createEquipement(equipementData).subscribe({
        next: () => {
          console.log('Equipement créé avec succès');
          this.loadEquipements();
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
