import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {PaginationComponent} from '../../../../shared/pagination.component';
import {Equipement} from '../../../../core/interface/equipement-interface';
import {Tache} from '../../../../core/interface/tache.interface';
import {EquipementService} from '../../../../service/equipement-service';
import {TacheService} from '../../../../service/tache.service';

@Component({
  selector: 'app-tache-page',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgClass, // Added NgClass to imports array
    PaginationComponent,
    ReactiveFormsModule
  ],  templateUrl: './tache-page.component.html',
  styleUrl: './tache-page.component.css'
})
export class TachePageComponent {
  taches: Tache[] = [];
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  equipementForm: FormGroup;
  isEditing = false;
  showForm = false;
  currentEquipementId: string | undefined = undefined;

  constructor(
    private tacheService: TacheService,
    private fb: FormBuilder
  ) {
    this.equipementForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', Validators.required],
      depart: ['', Validators.required],
      fin: ['', Validators.required],
      user_id: ['', Validators.required],
      intervention_id: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

}
