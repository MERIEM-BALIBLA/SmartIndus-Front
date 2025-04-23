import {User} from './user.interface';

export interface Equipe {
  id?: string;
  responsableId: string;
  operateurId: string;
  technicienIds: string[];
  // Propriétés pour l'affichage des noms (après mapping côté front)
  responsableNom?: string;
  operateurNom?: string;
  techniciens?: User[]; // Liste des objets User pour afficher leurs noms
}

