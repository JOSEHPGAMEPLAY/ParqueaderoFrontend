// Función auxiliar para agregar ceros
export const agregarCeros = (numero: number): string =>
  numero < 10 ? `0${numero}` : `${numero}`;

export const formatDate = (dateValue: string | number): string => {
    const fecha = new Date(dateValue);
    return `${fecha.getUTCFullYear()}-${agregarCeros(fecha.getUTCMonth() + 1)}-${agregarCeros(fecha.getUTCDate())}`;
};

// Ordenar registros por fecha (más reciente primero)
import { Registro } from "@/types/registro";

export const sortRegistersByDate = (registros: Registro[]): Registro[] => {
    return registros.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
