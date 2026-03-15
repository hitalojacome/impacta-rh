import { Users, Briefcase, UserPlus, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEmployees } from '@/context/EmployeeContext';
import { cargos } from '@/data/employees';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const Dashboard = () => {
  const { employees, loading, error } = useEmployees();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const newThisMonth = employees.filter(e => e.dataCadastro.startsWith(currentMonth)).length || 0;
  const uniqueCargos = new Set(employees.map(e => e.cargo)).size;
  const recentEmployees = [...employees].sort((a, b) => (b.dataCadastro.localeCompare(a.dataCadastro))).slice(0, 5);

  const stats = [
    { label: 'Total de Funcionários', value: employees.length, icon: Users, trend: `${newThisMonth} novos este mês` },
    { label: 'Cargos Cadastrados', value: uniqueCargos || cargos.length, icon: Briefcase, trend: 'ativos' },
    { label: 'Novos no Mês', value: newThisMonth, icon: UserPlus, trend: '+12% vs mês anterior' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do portal de funcionários</p>
      </motion.div>

      {loading ? (
        <div className="p-6">Carregando dados...</div>
      ) : error ? (
        <div className="p-6 text-destructive">{error}</div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                className="p-6 rounded-xl bg-card border border-border card-highlight flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{stat.label}</span>
                  <stat.icon size={18} className="text-primary" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <h2 className="text-4xl font-bold font-display">{stat.value}</h2>
                  <span className="text-accent text-sm font-mono-data">{stat.trend}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Employees */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold tracking-tight">Últimos Funcionários Cadastrados</h2>
              <a href="/funcionarios" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                Ver todos <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Nome</th>
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Cargo</th>
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEmployees.map((emp, i) => (
                    <tr key={emp.id} className={`hover:bg-foreground/5 transition-colors ${i < recentEmployees.length - 1 ? 'border-b border-border/50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-display font-semibold text-sm">
                            {emp.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{emp.nome}</p>
                            <p className="text-xs text-muted-foreground">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{emp.cargo}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-mono-data">{emp.dataCadastro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Dashboard;
