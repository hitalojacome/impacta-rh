import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Employee } from '@/data/employees';
import { funcionariosService } from '@/services/funcionariosService';

interface EmployeeContextType {
  employees: Employee[];
  loading: boolean;
  error?: string | null;
  addEmployee: (emp: Omit<Employee, 'id' | 'dataCadastro'>) => Promise<{ success: boolean; error?: string }>;
  updateEmployee: (id: number, emp: Omit<Employee, 'id' | 'dataCadastro'>) => Promise<{ success: boolean; error?: string }>;
  deleteEmployee: (id: number) => Promise<{ success: boolean; error?: string }>;
  getEmployee: (id: number) => Employee | undefined;
}

const EmployeeContext = createContext<EmployeeContextType | null>(null);

export const useEmployees = () => {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error('useEmployees must be within EmployeeProvider');
  return ctx;
};

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await funcionariosService.getAll();
        if (mounted) {
          setEmployees(data);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Erro ao carregar funcionários');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const addEmployee = useCallback(async (emp: Omit<Employee, 'id' | 'dataCadastro'>) => {
    try {
      const created = await funcionariosService.create(emp);
      setEmployees(prev => [created, ...prev]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao cadastrar funcionário' };
    }
  }, []);

  const updateEmployee = useCallback(async (id: number, emp: Omit<Employee, 'id' | 'dataCadastro'>) => {
    try {
      const updated = await funcionariosService.update(id, emp);
      setEmployees(prev => prev.map(e => e.id === id ? updated : e));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao atualizar funcionário' };
    }
  }, []);

  const deleteEmployee = useCallback(async (id: number) => {
    try {
      await funcionariosService.remove(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao excluir funcionário' };
    }
  }, []);

  const getEmployee = useCallback((id: number) => {
    return employees.find(e => e.id === id);
  }, [employees]);

  return (
    <EmployeeContext.Provider value={{ employees, loading, error, addEmployee, updateEmployee, deleteEmployee, getEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};
