import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEmployees } from '@/context/EmployeeContext';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const Funcionarios = () => {
  const { employees, deleteEmployee, loading, error } = useEmployees();
  const [search, setSearch] = useState('');
  const [cargoFilter, setCargoFilter] = useState('');

  const uniqueCargos = [...new Set(employees.map(e => e.cargo))].sort();

  const filtered = employees.filter(emp => {
    const matchSearch = !search || emp.nome.toLowerCase().includes(search.toLowerCase()) || emp.email.toLowerCase().includes(search.toLowerCase());
    const matchCargo = !cargoFilter || emp.cargo === cargoFilter;
    return matchSearch && matchCargo;
  });

  const handleDelete = async (id: number, nome: string) => {
    if (window.confirm(`Deseja excluir o funcionário "${nome}"?`)) {
      const res = await deleteEmployee(id);
      if (!res.success) alert(res.error || 'Falha ao excluir funcionário');
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground mt-1">Gerencie os funcionários da instituição</p>
        </div>
        <Link
          to="/funcionarios/novo"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm glow-blue hover:brightness-110 transition-all active:scale-[0.98]"
        >
          <Plus size={18} />
          Novo Funcionário
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={cargoFilter}
          onChange={e => setCargoFilter(e.target.value)}
          className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground"
        >
          <option value="">Todos os cargos</option>
          {uniqueCargos.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </motion.div>

      {/* Table */}
      <motion.div variants={item} className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Carregando funcionários...</div>
        ) : error ? (
          <div className="p-6 text-center text-destructive">{error}</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Nome', 'E-mail', 'CPF', 'Cargo', 'Data de Cadastro', 'Ações'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    Nenhum funcionário encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((emp, i) => (
                  <tr key={emp.id} className={`hover:bg-foreground/5 transition-colors ${i < filtered.length - 1 ? 'border-b border-border/50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-display font-semibold text-xs">
                          {emp.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <span className="font-medium text-sm">{emp.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{emp.email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono-data">{emp.cpf}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{emp.cargo}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono-data">{emp.dataCadastro}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/funcionarios/editar/${emp.id}`}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(emp.id, emp.nome)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Funcionarios;
