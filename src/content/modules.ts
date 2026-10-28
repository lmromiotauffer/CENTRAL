import type { ModuleMeta } from '@/types/content';

export const modules: ModuleMeta[] = [
  { slug: 'gestao-contratos', title: 'Gestão de Contratos',
    description: 'Informações básicas do contrato, situações, valores, prazos, equipe, aditivos, garantias e documentos.',
    icon: 'Gavel' },
  { slug: 'gestao-obra-servico', title: 'Gestão de Obra/Serviço',
    description: 'Obras e serviços vinculados ao contrato, planilha de serviços, localização, ativos, cronogramas e eventos.',
    icon: 'Construction' },
  { slug: 'gestao-medicoes', title: 'Gestão de Medições',
    description: 'Registro de quantidades executadas no período, conferência de medições, documentos e fotos.',
    icon: 'Assessment' },
  { slug: 'gestao-fiscalizacao', title: 'Gestão de Fiscalização',
    description: 'Rotinas de fiscalização de conservação e obras, fichas especiais, tipos de ficha e serviços.',
    icon: 'FactCheck' },
  { slug: 'gestao-fornecedores', title: 'Gestão de Fornecedores',
    description: 'Avaliação de fornecedores, orientações de preenchimento, consultas e relatórios de desempenho.',
    icon: 'Groups' },
  { slug: 'gestao-projetos', title: 'Gestão de Projetos',
    description: 'Acompanhamento de projetos, contratos relacionados e fluxo de informações do módulo.',
    icon: 'AccountTree' },
];
