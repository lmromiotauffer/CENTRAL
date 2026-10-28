import type { FAQItem } from '@/types/content';

export const faq: FAQItem[] = [
  {
    pergunta: 'Como redefinir minha senha de acesso?',
    resposta: 'Acesse a tela de login e clique em "Esqueci minha senha". Siga as instruções enviadas ao seu e-mail institucional.',
    categoria: 'Acesso',
  },
  {
    pergunta: 'Onde anexo os documentos de RT (Anotação de Responsabilidade Técnica)?',
    resposta: 'No módulo Gestão de Obra/Serviço, aba "Documentos", clique em "Anexar RT".',
    categoria: 'Documentos',
  },
  {
    pergunta: 'Como gerar o relatório consolidado de medições mensais?',
    resposta: 'Em Gestão de Medições > Relatórios > Consolidado Mensal. Selecione o período e clique em "Gerar".',
    categoria: 'Relatórios',
  },
  {
    pergunta: 'Quais os prazos para aprovação de aditivos?',
    resposta: 'Aditivos contratuais têm prazo regular de 15 dias úteis após protocolo completo.',
    categoria: 'Prazos',
  },
];
