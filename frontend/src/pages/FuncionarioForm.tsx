import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEmployees } from '@/context/EmployeeContext';
import { cargos } from '@/data/employees';

interface FormData {
  nome: string;
  email: string;
  cpf: string;
  cargo: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  cpf?: string;
  cargo?: string;
  server?: string;
}

const cpfMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const validateCpf = (cpf: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const FuncionarioForm = () => {
  const { id } = useParams();
  const idNum = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const { addEmployee, updateEmployee, getEmployee, loading } = useEmployees();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<FormData>({ nome: '', email: '', cpf: '', cargo: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (idNum !== undefined) {
      const emp = getEmployee(idNum);
      if (emp) {
        setForm({ nome: emp.nome, email: emp.email, cpf: emp.cpf, cargo: emp.cargo });
      } else if (!loading) {
        // not found, go back
        navigate('/funcionarios');
      }
    }
  }, [idNum, getEmployee, navigate, loading]);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório';
    if (!form.email.trim()) errs.email = 'E-mail é obrigatório';
    else if (!validateEmail(form.email)) errs.email = 'E-mail inválido';
    if (!form.cpf.trim()) errs.cpf = 'CPF é obrigatório';
    else if (!validateCpf(form.cpf)) errs.cpf = 'CPF inválido';
    if (!form.cargo) errs.cargo = 'Cargo é obrigatório';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched({ nome: true, email: true, cpf: true, cargo: true });
      return;
    }

    setSubmitting(true);
    try {
      const result = isEditing && idNum !== undefined
        ? await updateEmployee(idNum, form)
        : await addEmployee(form);

      if (!result.success) {
        setErrors({ server: result.error });
        setSubmitting(false);
        return;
      }

      navigate('/funcionarios');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    const newForm = { ...form, [field]: field === 'cpf' ? cpfMask(value) : value };
    setForm(newForm);
    if (touched[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      delete newErrors.server;
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errs = validate();
    if (errs[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: errs[field as keyof FormErrors] }));
    } else {
      setErrors(prev => { const n = { ...prev }; delete n[field as keyof FormErrors]; return n; });
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full bg-background border rounded-lg px-4 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground ${
      errors[field] && touched[field as string]
        ? 'border-destructive focus:ring-2 focus:ring-destructive/20'
        : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'
    }`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}>
      <button onClick={() => navigate('/funcionarios')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm">
        <ArrowLeft size={16} />
        Voltar para Funcionários
      </button>

      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-1">
          {isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isEditing ? 'Altere os dados do funcionário' : 'Preencha os dados para cadastrar um novo funcionário'}
        </p>

        {errors.server && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 mb-6 text-sm font-medium">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
            <input
              className={inputClass('nome')}
              placeholder="Ex: Ana Beatriz Souza"
              value={form.nome}
              onChange={e => handleChange('nome', e.target.value)}
              onBlur={() => handleBlur('nome')}
              disabled={loading || submitting}
            />
            {errors.nome && touched.nome && <p className="text-xs text-destructive font-medium">{errors.nome}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">E-mail Corporativo</label>
            <input
              type="email"
              className={inputClass('email')}
              placeholder="exemplo@impacta.edu.br"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              disabled={loading || submitting}
            />
            {errors.email && touched.email && <p className="text-xs text-destructive font-medium">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">CPF</label>
            <input
              className={`${inputClass('cpf')} font-mono-data`}
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={e => handleChange('cpf', e.target.value)}
              onBlur={() => handleBlur('cpf')}
              disabled={loading || submitting}
            />
            {errors.cpf && touched.cpf && <p className="text-xs text-destructive font-medium">{errors.cpf}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Cargo</label>
            <select
              className={inputClass('cargo')}
              value={form.cargo}
              onChange={e => handleChange('cargo', e.target.value)}
              onBlur={() => handleBlur('cargo')}
              disabled={loading || submitting}
            >
              <option value="">Selecione um cargo</option>
              {cargos.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.cargo && touched.cargo && <p className="text-xs text-destructive font-medium">{errors.cargo}</p>}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || submitting}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm glow-blue hover:brightness-110 transition-all active:scale-[0.98]"
            >
              <Save size={16} />
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/funcionarios')}
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:brightness-110 transition-all active:scale-[0.98]"
            >
              <X size={16} />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default FuncionarioForm;
