import { isAxiosError } from 'axios';
import { api } from '../api/axiosInstance';
import type { Pokemon } from '../types';

export const getPokemons = async (limit: number) => {
  try {
    const { data } = await api.get<{ results: Pokemon[] }>(
      `/pokemon?limit=${limit}`
    );

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error?.message);
    }
  }
};

export const getPokemonsSprites = async (pokemons: string[]) => {
  try {
    const responses = await Promise.all(
      pokemons.map(async name => {
        const { data } = await api.get<Pokemon>(`/pokemon/${name}`);

        return data;
      })
    );

    return responses;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error?.message);
    }
  }
};
