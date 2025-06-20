export interface UpdateUserRequest {
  email: string;
  // roles: number[]; // O el tipo de dato que uses para los IDs de roles
  // ... otras propiedades que puedas tener para actualizar el usuario
  sendSignalTest?: boolean; // <-- ¡NUEVO! Propiedad opcional para la prueba
}
