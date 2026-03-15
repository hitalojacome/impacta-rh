export interface Employee {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  cargo: string;
  dataCadastro: string;
}

export const cargos = [
  "Analista de Sistemas",
  "Desenvolvedor Back-end",
  "Desenvolvedor Front-end",
  "Product Owner",
  "Scrum Master",
  "Analista de RH",
  "Suporte Técnico",
  "Coordenador Acadêmico",
  "Analista Financeiro",
  "Designer UX/UI",
  "DBA",
  "Gerente de Projetos",
];
