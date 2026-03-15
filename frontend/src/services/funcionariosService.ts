import { Employee } from '@/data/employees';

const BASE_URL = 'https://localhost:7100/api';

async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  let data: any = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const message =
      (data && (data.message || data.errors || data.detail)) ||
      response.statusText;

    throw new Error(
      typeof message === 'string' ? message : JSON.stringify(message)
    );
  }

  return data;
}

export const funcionariosService = {
  async getAll(): Promise<Employee[]> {
    const res = await fetch(`${BASE_URL}/funcionarios`, { mode: 'cors' });
    return handleResponse(res);
  },

  async getById(id: number): Promise<Employee> {
    const res = await fetch(`${BASE_URL}/funcionarios/${id}`, { mode: 'cors' });
    return handleResponse(res);
  },

  async create(payload: Omit<Employee, 'id' | 'dataCadastro'>): Promise<Employee> {
    const sanitized = { ...payload, cpf: (payload.cpf || '').replace(/\D/g, '') };
    const res = await fetch(`${BASE_URL}/funcionarios`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized),
    });
    return handleResponse(res);
  },

  async update(id: number, payload: Omit<Employee, 'id' | 'dataCadastro'>): Promise<Employee> {
    const sanitized = { ...payload, cpf: (payload.cpf || '').replace(/\D/g, '') };
    const res = await fetch(`${BASE_URL}/funcionarios/${id}`, {
      method: 'PUT',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized),
    });
    return handleResponse(res);
  },

  async remove(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/funcionarios/${id}`, { method: 'DELETE', mode: 'cors' });
    await handleResponse(res);
  },
};