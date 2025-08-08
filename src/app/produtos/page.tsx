"use client";
// Necessário para usar useState neste componente de página
import { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, Circle, ChevronDown, ChevronRight, FileText, Maximize, Box, Settings, Package, Trash2 } from 'lucide-react';

// Produtos completos cadastrados na plataforma
const produtos = [
  { 
    id: 1, 
    sku: "MESA-ESC-001", 
    nome: "Mesa de Escritório Premium", 
    categoria: "Móveis para Escritório", 
    peso: 28.500, 
    preco: 449.90,
    descricao: "Mesa moderna com estrutura metálica e tampo em MDF, ideal para escritórios corporativos",
    medidas: {
      comprimento: 120,
      altura: 75,
      largura: 60,
      espessuraFerro: 2.5,
      espessuraMdf: 18,
      distanciaNichos: 40,
      distanciaVaroes: 25
    },
    componentes: [
      { id: 1, nome: "Pés metálicos", quantidade: 4, peso: 3.200, valor: 28.50 },
      { id: 2, nome: "Tampo MDF", quantidade: 1, peso: 18.500, valor: 125.00 },
      { id: 3, nome: "Parafusos de fixação", quantidade: 16, peso: 0.320, valor: 12.80 },
      { id: 4, nome: "Suportes laterais", quantidade: 2, peso: 6.480, valor: 45.60 }
    ],
    embalagens: [
      { id: 1, comprimento: 125, altura: 10, largura: 65 },
      { id: 2, comprimento: 80, altura: 15, largura: 15 }
    ],
    links: {
      googleDrive: "https://drive.google.com/mesa-escritorio-premium",
      olist: "https://olist.com/mesa-escritorio-001",
      personalizados: [
        { id: 1, nome: "Manual de Montagem", url: "https://manuais.metalom.com/mesa-001" }
      ]
    },
    observacao: "Produto certificado para uso comercial. Peso máximo suportado: 50kg."
  },
  { 
    id: 2, 
    sku: "EST-IND-002", 
    nome: "Estante Industrial Modular", 
    categoria: "Estantes e Prateleiras", 
    peso: 42.750, 
    preco: 329.90,
    descricao: "Estante com 5 prateleiras, estrutura em ferro com acabamento preto fosco",
    medidas: {
      comprimento: 80,
      altura: 180,
      largura: 35,
      espessuraFerro: 3.0,
      espessuraMdf: 15,
      distanciaNichos: 35,
      distanciaVaroes: 30
    },
    componentes: [
      { id: 1, nome: "Montantes verticais", quantidade: 2, peso: 12.400, valor: 89.50 },
      { id: 2, nome: "Prateleiras MDF", quantidade: 5, peso: 25.000, valor: 187.50 },
      { id: 3, nome: "Suportes de prateleira", quantidade: 10, peso: 3.500, valor: 42.00 },
      { id: 4, nome: "Parafusos estruturais", quantidade: 20, peso: 1.850, valor: 18.90 }
    ],
    embalagens: [
      { id: 1, comprimento: 185, altura: 85, largura: 40 }
    ],
    links: {
      googleDrive: "https://drive.google.com/estante-industrial-002",
      olist: "https://olist.com/estante-modular-002",
      personalizados: [
        { id: 1, nome: "Catálogo de Cores", url: "https://cores.metalom.com/est-002" }
      ]
    },
    observacao: "Disponível em 3 cores: preto, branco e cinza. Capacidade por prateleira: 25kg."
  },
  { 
    id: 3, 
    sku: "RACK-TV-003", 
    nome: "Rack TV Suspenso", 
    categoria: "Racks e Suportes", 
    peso: 15.890, 
    preco: 189.90,
    descricao: "Rack para TV até 55\" com compartimentos para equipamentos, fixação na parede",
    medidas: {
      comprimento: 140,
      altura: 45,
      largura: 25,
      espessuraFerro: 1.8,
      espessuraMdf: 12,
      distanciaNichos: 20,
      distanciaVaroes: 15
    },
    componentes: [
      { id: 1, nome: "Estrutura principal", quantidade: 1, peso: 8.500, valor: 95.00 },
      { id: 2, nome: "Prateleiras internas", quantidade: 3, peso: 4.200, valor: 52.50 },
      { id: 3, nome: "Suporte de fixação na parede", quantidade: 1, peso: 2.890, valor: 35.80 },
      { id: 4, nome: "Kit de parafusos e buchas", quantidade: 1, peso: 0.250, valor: 8.90 },
      { id: 5, nome: "Passador de cabos", quantidade: 2, peso: 0.050, valor: 3.20 }
    ],
    embalagens: [
      { id: 1, comprimento: 145, altura: 50, largura: 30 }
    ],
    links: {
      googleDrive: "https://drive.google.com/rack-tv-suspenso-003",
      olist: "https://olist.com/rack-tv-003",
      personalizados: [
        { id: 1, nome: "Guia de Instalação", url: "https://instalacao.metalom.com/rack-003" },
        { id: 2, nome: "Suporte Técnico", url: "https://suporte.metalom.com/contato" }
      ]
    },
    observacao: "Suporta TVs de 32\" a 55\". Incluí template de furação para facilitar a instalação."
  }
];

// Componentes disponíveis para seleção incluindo os usados nos produtos cadastrados
const componentesDisponiveis = [
  { id: 1, nome: "Parafuso M6x20", peso: 0.015, valor: 0.25 },
  { id: 2, nome: "Porca M6", peso: 0.008, valor: 0.15 },
  { id: 3, nome: "Arruela Lisa 6mm", peso: 0.003, valor: 0.05 },
  { id: 4, nome: "Chapa Aço 100x50", peso: 0.785, valor: 12.50 },
  { id: 5, nome: "Tubo 20x20x2", peso: 1.232, valor: 8.75 },
  { id: 6, nome: "Solda MIG", peso: 0.001, valor: 0.10 },
  { id: 7, nome: "Pés metálicos", peso: 3.200, valor: 28.50 },
  { id: 8, nome: "Tampo MDF", peso: 18.500, valor: 125.00 },
  { id: 9, nome: "Parafusos de fixação", peso: 0.020, valor: 0.80 },
  { id: 10, nome: "Suportes laterais", peso: 3.240, valor: 22.80 },
  { id: 11, nome: "Montantes verticais", peso: 6.200, valor: 44.75 },
  { id: 12, nome: "Prateleiras MDF", peso: 5.000, valor: 37.50 },
  { id: 13, nome: "Suportes de prateleira", peso: 0.350, valor: 4.20 },
  { id: 14, nome: "Parafusos estruturais", peso: 0.093, valor: 0.95 },
  { id: 15, nome: "Estrutura principal", peso: 8.500, valor: 95.00 },
  { id: 16, nome: "Prateleiras internas", peso: 1.400, valor: 17.50 },
  { id: 17, nome: "Suporte de fixação na parede", peso: 2.890, valor: 35.80 },
  { id: 18, nome: "Kit de parafusos e buchas", peso: 0.250, valor: 8.90 },
  { id: 19, nome: "Passador de cabos", peso: 0.025, valor: 1.60 }
];

export default function ProdutosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Informações'|'Medidas'|'Componentes'|'Embalagem'|'Dados'>('Informações');
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  
  // Estados para sistema de lembretes
  const [fieldReminders, setFieldReminders] = useState<Record<string, { reminders: Array<{title: string; content: string; date: string}>; info: string }>>({
    nome: { reminders: [{ title: 'Usar nomenclatura padronizada', content: 'Sempre usar padrão definido pela empresa', date: new Date().toLocaleDateString('pt-BR') }], info: 'O nome deve ser claro e descritivo' },
    descricao: { reminders: [{ title: 'Incluir especificações técnicas', content: 'Detalhar materiais, dimensões e características', date: new Date().toLocaleDateString('pt-BR') }], info: 'Descrição detalhada do produto' },
    comprimento: { reminders: [{ title: 'Verificar unidade de medida', content: 'Sempre usar centímetros como padrão', date: new Date().toLocaleDateString('pt-BR') }], info: 'Medida em centímetros' }
  });
  const [editModal, setEditModal] = useState<{ open: boolean; field: string; type: 'reminder' | 'info' }>({
    open: false, field: '', type: 'reminder'
  });
  const [viewModal, setViewModal] = useState<{ open: boolean; field: string }>({
    open: false, field: ''
  });
  const [editValue, setEditValue] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [selectedReminder, setSelectedReminder] = useState<{title: string; content: string; date: string} | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ open: boolean; field: string; index: number }>({
    open: false,
    field: '',
    index: -1
  });
  
  // Estados para controlar qual campo está ativo para mostrar a lâmpada
  const [activeField, setActiveField] = useState<string | null>(null);
  
  // Estados para sistema de proteção de clique
  const [fieldProtection, setFieldProtection] = useState<{
    protected: boolean;
    fieldName: string | null;
    hasContent: boolean;
    timer: NodeJS.Timeout | null;
  }>({
    protected: false,
    fieldName: null,
    hasContent: false,
    timer: null
  });
  
  // Estados para os campos do formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    sku: '',
    categoria: '',
    // Campos de medidas
    comprimento: '',
    altura: '',
    largura: '',
    espessuraFerro: '',
    espessuraMdf: '',
    distanciaNichos: '',
    distanciaVaroes: '',
    // Links padrão
    driveLink: '',
    olistLink: '',
    // Observação do usuário
    observacao: ''
  });
  // Links personalizados
  const [customLinks, setCustomLinks] = useState<Array<{ id: number; name: string; url: string }>>([]);

  // Funções para gerenciar links personalizados
  const addCustomLink = () => {
    const newId = customLinks.length > 0 ? Math.max(...customLinks.map(l => l.id)) + 1 : 1;
    setCustomLinks([...customLinks, { id: newId, name: '', url: '' }]);
  };
  const updateCustomLink = (id: number, field: 'name'|'url', value: string) => {
    setCustomLinks(customLinks.map(l => l.id === id ? { ...l, [field]: value } : l));
  };
  const removeCustomLink = (id: number) => {
    setCustomLinks(customLinks.filter(l => l.id !== id));
  };

  // Funções para sistema de lembretes
  // Funções para gerenciar lembretes
  const openEditModal = (field: string, type: 'reminder' | 'info') => {
    const current = fieldReminders[field];
    if (type === 'reminder') {
      setEditTitle('');
      setEditValue('');
    } else {
      setEditValue(current?.info || '');
    }
    setEditModal({ open: true, field, type });
    setViewModal({ open: false, field: '' });
  };

  const saveFieldData = () => {
    const { field, type } = editModal;
    setFieldReminders(prev => {
      const entry = prev[field] || { reminders: [], info: '' };
      if (type === 'reminder') {
        return {
          ...prev,
          [field]: { 
            ...entry, 
            reminders: [...(entry.reminders || []), { title: editTitle, content: editValue, date: new Date().toLocaleDateString('pt-BR') }] 
          }
        };
      }
      return { ...prev, [field]: { ...entry, info: editValue } };
    });
    setEditModal({ open: false, field: '', type: 'reminder' });
    setEditValue('');
    setEditTitle('');
    // Reabrir o modal de visualização
    setViewModal({ open: true, field });
  };

  const removeFieldData = (field: string, type: 'reminder' | 'info') => {
    setFieldReminders(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: ''
      }
    }));
  };

  // Função para confirmar e executar a exclusão do lembrete
  const confirmDeleteReminder = () => {
    const { field, index } = deleteConfirmModal;
    setFieldReminders(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        reminders: prev[field]?.reminders?.filter((_, i) => i !== index) || []
      }
    }));
    setDeleteConfirmModal({ open: false, field: '', index: -1 });
  };

  // Componente para mostrar dicas da aba quando clicado no ícone
  const handleTabIconClick = (tabName: string) => {
    // Abre modal com informações da aba específica
    setViewModal({ open: true, field: `tab_${tabName}` });
    setModalTab('lembretes'); // Sempre abre na aba de lembretes
  };

  // Função para verificar se uma aba tem conteúdo de lembretes
  const getTabContentStatus = (tabName: string) => {
    // Verifica se a aba específica tem lembretes ou informações
    const tabFieldKey = `tab_${tabName}`;
    const tabData = fieldReminders[tabFieldKey];
    return (tabData?.reminders?.length || 0) > 0 || (tabData?.info?.length || 0) > 0;
  };



  // Função para lidar com o blur de forma inteligente
  const handleFieldBlur = (fieldName: string) => {
    // Pequeno delay para permitir clique na lâmpada
    setTimeout(() => {
      setActiveField(null);
    }, 150);
  };

  // Sistema de proteção contra cliques acidentais
  const handleFieldFocus = (fieldName: string) => {
    // Limpa timer anterior se existir
    if (fieldProtection.timer) {
      clearTimeout(fieldProtection.timer);
    }
    
    setActiveField(fieldName);
    setFieldProtection({
      protected: true,
      fieldName,
      hasContent: false,
      timer: null
    });
  };

  const handleProtectedBlur = (fieldName: string) => {
    const currentFieldValue = formData[fieldName as keyof typeof formData] || '';
    const hasContent = currentFieldValue.trim().length > 0;
    
    // Se não tem conteúdo, permite sair imediatamente
    if (!hasContent) {
      // Delay para verificar se é a lâmpada sendo clicada
      setTimeout(() => {
        setActiveField(null);
        setFieldProtection({
          protected: false,
          fieldName: null,
          hasContent: false,
          timer: null
        });
      }, 50);
      return;
    }
    
    // Se tem conteúdo, adiciona um delay de proteção
    const timer = setTimeout(() => {
      // Verifica se o usuário não voltou ao campo
      const isFocusOnInput = document.activeElement?.matches(`input, textarea`);
      
      if (fieldProtection.fieldName === fieldName && !isFocusOnInput) {
        setActiveField(null);
        setFieldProtection({
          protected: false,
          fieldName: null,
          hasContent: false,
          timer: null
        });
      }
    }, 300); // 300ms de proteção
    
    setFieldProtection(prev => ({
      ...prev,
      timer
    }));
  };

  const handleProtectedClick = (fieldName: string) => {
    // Se clicou no campo protegido, cancela o timer
    if (fieldProtection.fieldName === fieldName && fieldProtection.timer) {
      clearTimeout(fieldProtection.timer);
      setFieldProtection(prev => ({
        ...prev,
        timer: null
      }));
    }
  };

  // Função para forçar saída do campo (para botões de ação)
  const forceFieldExit = () => {
    if (fieldProtection.timer) {
      clearTimeout(fieldProtection.timer);
    }
    setActiveField(null);
    setFieldProtection({
      protected: false,
      fieldName: null,
      hasContent: false,
      timer: null
    });
  };

  // Estado para componentes
  const [componentes, setComponentes] = useState<Array<{
    id: number;
    componenteId: number;
    nome: string;
    quantidade: number;
    peso: number;
    valor: number;
  }>>([]);
  // Overrides globais de peso e valor
  const [pesoManual, setPesoManual] = useState<string>('');
  const [valorManual, setValorManual] = useState<string>('');

  // Estado para embalagens
  const [embalagens, setEmbalagens] = useState([
    { id: 1, comprimento: '', altura: '', largura: '' }
  ]);
  const [numeroVolumes, setNumeroVolumes] = useState(1);
  
  const tabs = ['Informações', 'Medidas', 'Componentes', 'Embalagem', 'Dados'] as const;
  
  // Configuração das abas com ícones e descrições
  const tabsConfig = {
    'Informações': {
      icon: FileText,
      title: 'Informações Básicas',
      description: 'Nome, descrição, categoria e dados gerais do produto'
    },
    'Medidas': {
      icon: Maximize,
      title: 'Medidas e Dimensões',
      description: 'Dimensões físicas e especificações técnicas'
    },
    'Componentes': {
      icon: Package,
      title: 'Componentes do Produto',
      description: 'Peças e materiais que compõem o produto'
    },
    'Embalagem': {
      icon: Box,
      title: 'Embalagem e Estoque',
      description: 'Tipo de embalagem, quantidade e informações de estoque'
    },
    'Dados': {
      icon: Settings,
      title: 'Dados Adicionais',
      description: 'Código de barras, fornecedor e informações complementares'
    }
  };
  const currentTabIndex = tabs.indexOf(activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isFirstTab = currentTabIndex === 0;
  
  const nextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1]);
    }
  };

  const prevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1]);
    }
  };

  const openModal = () => {
    setActiveTab('Informações'); // Sempre reseta para a primeira aba
    setNumeroVolumes(1); // Reseta para 1 volume
    setEmbalagens([{ id: 1, comprimento: '', altura: '', largura: '' }]); // Reseta embalagens
    setComponentes([]); // Reseta componentes
    setModalOpen(true);
  };

  // Funções para gerenciar componentes
  const addComponente = () => {
    const newId = Math.max(0, ...componentes.map(c => c.id)) + 1;
    setComponentes([...componentes, {
      id: newId,
      componenteId: 0,
      nome: '',
      quantidade: 1,
      peso: 0,
      valor: 0,
    }]);
  };

  const removeComponente = (id: number) => {
    setComponentes(componentes.filter(c => c.id !== id));
  };

  const updateComponente = (id: number, field: string, value: any) => {
    setComponentes(componentes.map(c => {
      if (c.id === id) {
        if (field === 'componenteId') {
          const selectedComponent = componentesDisponiveis.find(comp => comp.id === parseInt(value));
          if (selectedComponent) {
            return {
              ...c,
              componenteId: parseInt(value),
              nome: selectedComponent.nome,
              peso: selectedComponent.peso,
              valor: selectedComponent.valor
            };
          }
        }
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const calcularTotais = () => {
    return componentes.reduce((acc, comp) => {
      acc.pesoTotal += comp.peso * comp.quantidade;
      acc.valorTotal += comp.valor * comp.quantidade;
      return acc;
    }, { pesoTotal: 0, valorTotal: 0 });
  };

  const { pesoTotal, valorTotal } = calcularTotais();
  // Calcular volume total das embalagens
  const calcularVolumeTotal = () => embalagens.reduce((acc, e) => {
    const l = parseFloat(e.comprimento) || 0;
    const a = parseFloat(e.altura) || 0;
    const w = parseFloat(e.largura) || 0;
    return acc + l * a * w;
  }, 0);
  const totalVolumeCm3 = calcularVolumeTotal();
  const volumeSide = Math.cbrt(totalVolumeCm3);

  // Funções para gerenciar embalagens
  const handleNumeroVolumesChange = (value: string) => {
    const num = parseInt(value) || 1;
    setNumeroVolumes(num);
    
    // Ajustar array de embalagens baseado no número
    const currentLength = embalagens.length;
    
    if (num > currentLength) {
      // Adicionar embalagens
      const newEmbalagens = [...embalagens];
      for (let i = currentLength; i < num; i++) {
        newEmbalagens.push({ id: i + 1, comprimento: '', altura: '', largura: '' });
      }
      setEmbalagens(newEmbalagens);
    } else if (num < currentLength) {
      // Remover embalagens
      setEmbalagens(embalagens.slice(0, num));
    }
  };

  const updateEmbalagem = (id: number, field: string, value: string) => {
    setEmbalagens(embalagens.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  // Função para verificar se o valor é "n" ou variações
  const isNotApplicable = (value: string) => {
    return value.toLowerCase().trim() === 'n' || value.toLowerCase().trim() === 'n/a' || value.toLowerCase().trim() === 'na';
  };

  // Função para lidar com mudanças nos campos
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Atualiza se o campo tem conteúdo para proteção
    if (fieldProtection.fieldName === field) {
      setFieldProtection(prev => ({
        ...prev,
        hasContent: value.trim().length > 0
      }));
    }
  };

  // Função para obter classes CSS baseadas no valor
  const getFieldClasses = (value: string, fieldName?: string) => {
    const baseClasses = "w-full h-[40px] px-3 border rounded-[6px] text-[14px] font-normal transition-all duration-200";
    
    // Adiciona borda azul se o campo está protegido
    const isProtected = fieldProtection.protected && fieldProtection.fieldName === fieldName;
    const protectedClasses = isProtected ? "ring-2 ring-blue-200 border-blue-300" : "";
    
    if (isNotApplicable(value)) {
      return `${baseClasses} bg-gray-100 text-gray-500 border-gray-200 placeholder-gray-400 ${protectedClasses}`;
    }
    
    return `${baseClasses} border-gray-300 placeholder-[#6B7280] ${protectedClasses}`;
  };

  // Função para obter classes CSS para textarea
  const getTextareaClasses = (value: string, fieldName?: string) => {
    const baseClasses = "w-full min-h-[100px] px-3 py-2 border rounded-[6px] text-[14px] font-normal transition-all duration-200";
    
    // Adiciona borda azul se o campo está protegido
    const isProtected = fieldProtection.protected && fieldProtection.fieldName === fieldName;
    const protectedClasses = isProtected ? "ring-2 ring-blue-200 border-blue-300" : "";
    
    if (isNotApplicable(value)) {
      return `${baseClasses} bg-gray-100 text-gray-500 border-gray-200 placeholder-gray-400 ${protectedClasses}`;
    }
    
    return `${baseClasses} border-gray-300 placeholder-[#6B7280] ${protectedClasses}`;
  };

  const [modalTab, setModalTab] = useState<'lembretes'|'info'>('lembretes');

  useEffect(() => {
    if (viewModal.open) setModalTab('lembretes');
  }, [viewModal.open]);

  // Cleanup para timers de proteção
  useEffect(() => {
    return () => {
      if (fieldProtection.timer) {
        clearTimeout(fieldProtection.timer);
      }
    };
  }, [fieldProtection.timer]);

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-0rem)] relative px-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] font-bold leading-[1.2] text-[#111827]">Gestão de Produtos</h1>
        <button
          className="flex items-center gap-2 bg-[#111827] text-white px-4 py-2.5 rounded-md font-medium text-[14px] shadow-sm hover:bg:black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111827]"
          onClick={openModal}
        >
          <span className="material-symbols-rounded text-xl">add</span>
          Novo
        </button>
      </div>
      {/* Botão principal '+ Novo' já está presente no cabeçalho */}
      <div className="flex-1 flex flex-col justify-stretch">
        <div className="flex flex-col h-full w-full bg:white">
          {/* Cabeçalho da tabela */}
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr] items-center gap-x-4 py-2">
            <div className="text-[12px] font-medium text-[#6B7280]">Nome</div>
            <div className="text-[12px] font-medium text-[#6B7280]">Categoria</div>
            <div className="text-[12px] font-medium text-[#6B7280]">Peso</div>
            <div className="text-[12px] font-medium text-[#6B7280]">Preço</div>
          </div>
          <div className="border-b border-gray-200" />
          {produtos.map((produto, idx) => (
            <div
              key={produto.id}
              className="w-full py-3"
              style={{ borderBottom: idx !== produtos.length - 1 ? '1px solid #F3F4F6' : 'none' }}
            >
              <div className="grid grid-cols-[3fr_1fr_1fr_1fr] items-center gap-x-4">
                {/* Nome e SKU */}
                <div>
                  <div className="text-[16px] font-normal leading-[1.4] text-[#1F2937]">{produto.nome}</div>
                  <div className="text-[13px] font-normal leading-[1.4] text-[#6B7280] mt-1">SKU: {produto.sku}</div>
                </div>
                {/* Categoria como tag harmonizada */}
                <div>
                  <span className="inline-flex items-center h-6 px-3 text-[13px] font-medium leading-[1.4] rounded-md bg-gray-100 text-[#4B5563]">
                    {produto.categoria}
                  </span>
                </div>
                {/* Peso */}
                <div>
                  <span className="text-[14px] font-normal text-[#1F2937]">
                    {produto.peso.toFixed(3)} kg
                  </span>
                </div>
                {/* Preço */}
                <div>
                  <span className="text-[14px] font-normal text-[#1F2937]">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {/* Preencher espaço vazio para efeito fullscreen das linhas */}
          <div className="flex-1 border-b border-gray-200" style={{ minHeight: 0 }} />
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-lg w-[700px] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 rounded-t-xl">
              {/* Seção da Aba Atual */}
              <div className="px-8 py-7">
                <div className="flex items:center justify-between">
                  {/* Informações da aba atual */}
                  <div className="flex items-center gap-6 flex-1">
                    {/* Cabeçalho refinado */}
                    {(() => {
                      const currentConfig = tabsConfig[activeTab];
                      const IconComponent = currentConfig.icon;
                      const hasContent = getTabContentStatus(activeTab);
                      
                      return (
                        <>
                          <div className="relative">
                            <button 
                              onClick={() => handleTabIconClick(activeTab)}
                              className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm transition-all duration-200 bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200"
                              title={hasContent ? 'Ver dicas e lembretes desta aba' : 'Adicionar dicas para esta aba'}
                              type="button"
                            >
                              <IconComponent className="w-5 h-5 text-gray-600" />
                            </button>
                            {hasContent && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow-sm"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-[18px] font-semibold text-gray-800 mb-1 leading-snug">
                              {currentConfig.title}
                            </h3>
                            <p className="text-[13px] text-gray-600 leading-tight">
                              {currentConfig.description}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* Botão fechar discreto */}
                  <button 
                    onClick={() => {
                      forceFieldExit();
                      setModalOpen(false);
                    }} 
                    aria-label="Fechar" 
                    className="p-1 transition-colors opacity-60 hover:opacity:100"
                  >
                    <span className="material-symbols-rounded text-[18px] text-gray-400">close</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 py-7">
              <div className="transition-opacity duration-200 ease-in-out">
                {/* Aba Informações */}
                {activeTab === 'Informações' && (
                  <form className="grid grid-cols-12 gap-x-6 gap-y-5 animate-in fade-in duration-300">
                    {/* Nome do produto */}
                    <div className="col-span-12">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                        Nome do produto
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ex: Camiseta Básica" 
                        value={formData.nome}
                        onChange={(e) => handleFieldChange('nome', e.target.value)}
                        className={getFieldClasses(formData.nome, 'nome')}
                        onFocus={() => handleFieldFocus('nome')}
                        onBlur={() => handleProtectedBlur('nome')}
                        onClick={() => handleProtectedClick('nome')}
                      />
                      {isNotApplicable(formData.nome) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Descrição */}
                    <div className="col-span-12">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                        Descrição
                      </label>
                      <textarea 
                        placeholder="Descreva os detalhes do produto..." 
                        value={formData.descricao}
                        onChange={(e) => handleFieldChange('descricao', e.target.value)}
                        className={getTextareaClasses(formData.descricao, 'descricao')}
                        onFocus={() => handleFieldFocus('descricao')}
                        onBlur={() => handleProtectedBlur('descricao')}
                        onClick={() => handleProtectedClick('descricao')}
                      />
                      {isNotApplicable(formData.descricao) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* SKU */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                        SKU
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ex: TSHIRT-001" 
                        value={formData.sku}
                        onChange={(e) => handleFieldChange('sku', e.target.value)}
                        className={getFieldClasses(formData.sku, 'sku')}
                        onFocus={() => handleFieldFocus('sku')}
                        onBlur={() => handleProtectedBlur('sku')}
                        onClick={() => handleProtectedClick('sku')}
                      />
                      {isNotApplicable(formData.sku) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Categoria */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                        Categoria
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ex: Vestuário" 
                        value={formData.categoria}
                        onChange={(e) => handleFieldChange('categoria', e.target.value)}
                        className={getFieldClasses(formData.categoria, 'categoria')}
                        onFocus={() => handleFieldFocus('categoria')}
                        onBlur={() => handleProtectedBlur('categoria')}
                        onClick={() => handleProtectedClick('categoria')}
                      />
                      {isNotApplicable(formData.categoria) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                  </form>
                )}
                
                {/* Aba Medidas */}
                {activeTab === 'Medidas' && (
                  <form className="grid grid-cols-12 gap-x-6 gap-y-5 animate-in fade-in duration-300">
                    {/* Dimensões Gerais */}
                    <div className="col-span-12">
                      <h4 className="text-[15px] font-medium text-[#111827] mb-4 pb-2 border-b border-gray-200">Dimensões Gerais</h4>
                    </div>
                    
                    {/* Comprimento */}
                    <div className="col-span-4">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                        Comprimento (cm)
                      </label>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.comprimento}
                        onChange={(e) => handleFieldChange('comprimento', e.target.value)}
                        className={getFieldClasses(formData.comprimento)}
                        onFocus={() => handleFieldFocus('comprimento')}
                        onBlur={() => handleProtectedBlur('comprimento')}
                      />
                      {isNotApplicable(formData.comprimento) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Altura */}
                    <div className="col-span-4">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                        Altura (cm)
                      </label>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.altura}
                        onChange={(e) => handleFieldChange('altura', e.target.value)}
                        className={getFieldClasses(formData.altura)}
                        onFocus={() => handleFieldFocus('altura')}
                        onBlur={() => handleProtectedBlur('altura')}
                      />
                      {isNotApplicable(formData.altura) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Largura */}
                    <div className="col-span-4">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor:pointer select-none">
                        Largura (cm)
                      </label>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.largura}
                        onChange={(e) => handleFieldChange('largura', e.target.value)}
                        className={getFieldClasses(formData.largura)}
                        onFocus={() => handleFieldFocus('largura')}
                        onBlur={() => handleProtectedBlur('largura')}
                      />
                      {isNotApplicable(formData.largura) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    
                    {/* Espessuras */}
                    <div className="col-span-12">
                      <h4 className="text-[15px] font-medium text-[#111827] mb-4 pb-2 border-b border-gray-200">Espessuras dos Materiais</h4>
                    </div>
                    
                    {/* Espessura do Ferro */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                        Espessura do Ferro (mm)
                      </label>
                      <input 
                        type="text" 
                        placeholder="0.0" 
                        value={formData.espessuraFerro}
                        onChange={(e) => handleFieldChange('espessuraFerro', e.target.value)}
                        className={getFieldClasses(formData.espessuraFerro)}
                        onFocus={() => handleFieldFocus('espessuraFerro')}
                        onBlur={() => handleProtectedBlur('espessuraFerro')}
                      />
                      {isNotApplicable(formData.espessuraFerro) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Espessura do MDF */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                        Espessura do MDF (mm)
                      </label>
                      <input 
                        type="text" 
                        placeholder="0.0" 
                        value={formData.espessuraMdf}
                        onChange={(e) => handleFieldChange('espessuraMdf', e.target.value)}
                        className={getFieldClasses(formData.espessuraMdf)}
                        onFocus={() => handleFieldFocus('espessuraMdf')}
                        onBlur={() => handleProtectedBlur('espessuraMdf')}
                      />
                      {isNotApplicable(formData.espessuraMdf) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    
                    {/* Distâncias */}
                    <div className="col-span-12">
                      <h4 className="text-[15px] font-medium text-[#111827] mb-4 pb-2 border-b border-gray-200">Distâncias e Espaçamentos</h4>
                    </div>
                    
                    {/* Distância dos Nichos */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                        Distância dos Nichos (cm)
                      </label>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.distanciaNichos}
                        onChange={(e) => handleFieldChange('distanciaNichos', e.target.value)}
                        className={getFieldClasses(formData.distanciaNichos)}
                        onFocus={() => handleFieldFocus('distanciaNichos')}
                        onBlur={() => handleProtectedBlur('distanciaNichos')}
                      />
                      {isNotApplicable(formData.distanciaNichos) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Distância dos Varões */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                        Distância dos Varões (cm)
                      </label>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.distanciaVaroes}
                        onChange={(e) => handleFieldChange('distanciaVaroes', e.target.value)}
                        className={getFieldClasses(formData.distanciaVaroes)}
                        onFocus={() => handleFieldFocus('distanciaVaroes')}
                        onBlur={() => handleProtectedBlur('distanciaVaroes')}
                      />
                      {isNotApplicable(formData.distanciaVaroes) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                  </form>
                )}
                
                {/* Aba Componentes */}
                {activeTab === 'Componentes' && (
                  <form className="space-y-4 animate-in fade-in duration-300">
                    {/* Cabeçalho compacto com totais */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                      <h4 className="text-[15px] font-medium text-[#111827]">Componentes</h4>
                      <div className="flex items-center gap-4 text-[13px]">
                        <span className="text-gray-600">
                          Peso: <strong>{(pesoManual.trim() !== '' ? parseFloat(pesoManual).toFixed(3) : valorTotal.toFixed(3))} kg</strong>
                        </span>
                        <span className="text-gray-600">
                          Valor: <strong>R$ {(valorManual.trim() !== '' ? parseFloat(valorManual).toFixed(2) : valorTotal.toFixed(2))}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Lista de componentes em formato de tabela compacta */}
                    {componentes.length > 0 && (
                      <div className="space-y-2">
                        {componentes.map((componente, index) => (
                          <div key={componente.id} className="grid grid-cols-12 gap-3 items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            {/* Seleção do componente */}
                            <div className="col-span-6">
                              <select
                                value={componente.componenteId}
                                onChange={(e) => updateComponente(componente.id, 'componenteId', e.target.value)}
                                className="w-full h-8 px-2 border border-gray-300 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                              >
                                <option value="0">Selecionar componente...</option>
                                {componentesDisponiveis.map(comp => (
                                  <option key={comp.id} value={comp.id}>
                                    {comp.nome}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Quantidade */}
                            <div className="col-span-2">
                              <input
                                type="number"
                                min="1"
                                value={componente.quantidade}
                                onChange={(e) => updateComponente(componente.id, 'quantidade', parseInt(e.target.value) || 1)}
                                className="w-full h-8 px-2 border border-gray-300 rounded-lg text-[13px] text-center appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Qtd"
                              />
                            </div>

                            {/* Peso e Valor calculados */}
                            <div className="col-span-3 flex items-center justify-between text-[13px] text-gray-600">
                              <span>{(componente.peso * componente.quantidade).toFixed(3)} kg</span>
                              <span>R$ {(componente.valor * componente.quantidade).toFixed(2)}</span>
                            </div>

                            {/* Botão remover */}
                            <div className="col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeComponente(componente.id)}
                                className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                                title="Remover"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Botão adicionar componente */}
                    <button
                      type="button"
                      onClick={addComponente}
                      className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors text-[13px]"
                    >
                      <span className="material-symbols-rounded text-[16px]">add</span>
                      Adicionar Componente
                    </button>

                    {/* Mensagem quando não há componentes */}
                    {componentes.length === 0 && (
                      <div className="text-center py-6">
                        <div className="text-gray-500 text-[13px] mb-1">Nenhum componente adicionado</div>
                        <div className="text-gray-400 text-[12px]">Use o botão acima para adicionar componentes</div>
                      </div>
                    )}
                  </form>
                )}
                
                {/* Aba Embalagem */}
                {activeTab === 'Embalagem' && (
                  <form className="grid grid-cols-12 gap-x-6 gap-y-5 animate-in fade-in duration-300">
                    {/* Título */}
                    <div className="col-span-12">
                      <h4 className="text-[15px] font-medium text-[#111827] mb-4 pb-2 border-b border-gray-200">Dimensões das Embalagens</h4>
                    </div>
                    
                    {/* Card de escolha de quantidade */}
                    <div className="col-span-12">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="text-[14px] font-medium text-[#111827]">Número de volumes:</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={numeroVolumes}
                          onChange={(e) => handleNumeroVolumesChange(e.target.value)}
                          className="w-16 h-8 px-2 border border-gray-300 rounded text-[13px] text-center bg-white"
                        />
                      </div>
                    </div>

                    {/* Lista de embalagens */}
                    {embalagens.map((embalagem, index) => (
                      <div key={embalagem.id} className="col-span-12 space-y-4">
                        {/* Campos da embalagem com título inline */}
                        <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                          {/* Comprimento */}
                          <div className="col-span-4">
                            <label className="block text-[13px] font-medium text-[#111827] mb-2">
                              Comprimento {index + 1} (cm)
                            </label>
                            <input 
                              type="text" 
                              placeholder="0" 
                              value={embalagem.comprimento}
                              onChange={(e) => updateEmbalagem(embalagem.id, 'comprimento', e.target.value)}
                              className={getFieldClasses(embalagem.comprimento)}
                            />
                            {isNotApplicable(embalagem.comprimento) && (
                              <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                            )}
                          </div>
                          
                          {/* Altura */}
                          <div className="col-span-4">
                            <label className="block text-[13px] font-medium text-[#111827] mb-2">
                              Altura {index + 1} (cm)
                            </label>
                            <input 
                              type="text" 
                              placeholder="0" 
                              value={embalagem.altura}
                              onChange={(e) => updateEmbalagem(embalagem.id, 'altura', e.target.value)}
                              className={getFieldClasses(embalagem.altura)}
                            />
                            {isNotApplicable(embalagem.altura) && (
                              <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                            )}
                          </div>
                          
                          {/* Largura */}
                          <div className="col-span-4">
                            <label className="block text-[13px] font-medium text-[#111827] mb-2">
                              Largura {index + 1} (cm)
                            </label>
                            <input 
                              type="text" 
                              placeholder="0" 
                              value={embalagem.largura}
                              onChange={(e) => updateEmbalagem(embalagem.id, 'largura', e.target.value)}
                              className={getFieldClasses(embalagem.largura)}
                            />
                            {isNotApplicable(embalagem.largura) && (
                              <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                            )}
                          </div>
                        </div>

                        {/* Separador entre embalagens */}
                        {index < embalagens.length - 1 && (
                          <div className="border-b border-gray-200 mt-6"></div>
                        )}
                      </div>
                    ))}
                    
                    {/* Volume Total e dimensões equivalentes */}
                    <div className="col-span-12 pt-4 border-t border-gray-200">
                      <h4 className="text-[15px] font-medium text-[#111827] mb-2">Volume Total</h4>
                      <div className="flex items-center gap-4 text-[13px] text-gray-700">
                        <span>Total: <strong>{totalVolumeCm3.toFixed(2)} cm³</strong></span>
                        <span>Dimensões equivalentes: <strong>{volumeSide.toFixed(2)} x {volumeSide.toFixed(2)} x {volumeSide.toFixed(2)}</strong> cm</span>
                      </div>
                    </div>
                  </form>
                )}
                
                {/* Aba Dados Adicionais */}
                {activeTab === 'Dados' && (
                  <form className="grid grid-cols-12 gap-6 animate-in fade-in duration-300">
                    {/* Card de Links Padrão */}
                    <div className="col-span-12 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-[15px] font-semibold text-gray-800 mb-4">Links Padrão</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 mb-1.5 cursor-pointer select-none">
                            Google Drive
                          </label>
                          <input
                            type="text"
                            placeholder="https://drive.google.com/..."
                            value={formData.driveLink}
                            onChange={(e) => handleFieldChange('driveLink', e.target.value)}
                            className={getFieldClasses(formData.driveLink)}
                            onFocus={() => handleFieldFocus('driveLink')}
                            onBlur={() => handleProtectedBlur('driveLink')}
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 mb-1.5 cursor-pointer select-none">
                            Olist
                          </label>
                          <input
                            type="text"
                            placeholder="https://olist.com/..."
                            value={formData.olistLink}
                            onChange={(e) => handleFieldChange('olistLink', e.target.value)}
                            className={getFieldClasses(formData.olistLink)}
                            onFocus={() => handleFieldFocus('olistLink')}
                            onBlur={() => handleProtectedBlur('olistLink')}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card de Links Personalizados */}
                    <div className="col-span-12 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-[15px] font-semibold text-gray-800 mb-4">Links Personalizados</h4>
                      <div className="space-y-3">
                        {customLinks.map(link => (
                          <div key={link.id} className="grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-5">
                              <input
                                type="text"
                                placeholder="Nome do link"
                                value={link.name}
                                onChange={(e) => updateCustomLink(link.id, 'name', e.target.value)}
                                className="w-full h-9 px-3 border border-gray-300 rounded-md text-[13px] focus:ring-2 focus:ring-blue-400"
                              />
                            </div>
                            <div className="col-span-6">
                              <input
                                type="text"
                                placeholder="URL do link"
                                value={link.url}
                                onChange={(e) => updateCustomLink(link.id, 'url', e.target.value)}
                                className="w-full h-9 px-3 border border-gray-300 rounded-md text-[13px] focus:ring-2 focus:ring-blue-400"
                              />
                            </div>
                            <div className="col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeCustomLink(link.id)}
                                className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-md transition-colors"
                                title="Remover link"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addCustomLink}
                        className="w-full flex items-center justify-center gap-2 mt-4 py-2.5 border border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors text-[13px] font-medium"
                      >
                        <span className="material-symbols-rounded text-[16px]">add</span>
                        Adicionar Link
                      </button>
                    </div>

                    {/* Card de Observação */}
                    <div className="col-span-12 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-[15px] font-semibold text-gray-800 mb-3 cursor-pointer select-none">
                        Observação
                      </h4>
                      <textarea
                        placeholder="Deixe aqui suas observações..."
                        value={formData.observacao}
                        onChange={(e) => handleFieldChange('observacao', e.target.value)}
                        className={getTextareaClasses(formData.observacao)}
                        onFocus={() => handleFieldFocus('observacao')}
                        onBlur={() => handleProtectedBlur('observacao')}
                      />
                    </div>
                  </form>
                )}
                
                {/* Placeholder para outras abas */}
                {activeTab !== 'Informações' && activeTab !== 'Medidas' && activeTab !== 'Componentes' && activeTab !== 'Embalagem' && activeTab !== 'Dados' && (
                  <div className="text-center py-16 animate-in fade-in duration-300">
                    <div className="text-[#6B7280] text-lg mb-2">Em construção...</div>
                    <div className="text-[#9CA3AF] text-sm">
                      A aba "{activeTab}" será implementada em breve.
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-between items-center px-8 py-6 border-t border-gray-200 rounded-b-xl">
              <div>
                {!isFirstTab && (
                  <button 
                    onClick={prevTab}
                    className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-[14px] font-medium"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Voltar
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {isLastTab ? (
                  <button className="px-6 py-2 rounded-md bg-[#111827] text-white hover:bg-black transition-colors text-[14px] font-medium">
                    Salvar Produto
                  </button>
                ) : (
                  <div className="relative">
                    <button 
                      onClick={nextTab}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenuPosition({ x: e.clientX, y: e.clientY });
                        setContextMenuOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#111827] text-white hover:bg-black transition-colors text-[14px] font-medium"
                      title="Clique direito para ver todas as etapas"
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    
                    {/* Popup com todas as etapas */}
                    {contextMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300 ease-out" 
                          onClick={() => setContextMenuOpen(false)}
                        />
                        <div 
                          className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-80 animate-in fade-in zoom-in-95 duration-300"
                        >
                          <div className="p-4">
                            <h4 className="text-[14px] font-semibold text-[#111827] mb-3 text-center">Escolher Etapa</h4>
                            <div className="space-y-1.5">
                              {tabs.map((tab, index) => {
                                const config = tabsConfig[tab];
                                const IconComponent = config.icon;
                                const isActive = index === currentTabIndex;
                                const isCompleted = index < currentTabIndex;
                                
                                return (
                                  <button
                                    key={tab}
                                    onClick={() => {
                                      setActiveTab(tab);
                                      setContextMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-all duration-200 ${
                                      isActive 
                                        ? 'bg-[#111827] text-white transform scale-[1.01]' 
                                        : 'hover:bg-gray-50 hover:shadow-sm'
                                    }`}
                                  >
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-md border transition-all duration-200 ${
                                      isActive 
                                        ? 'bg-white text-[#111827] border-white' 
                                        : isCompleted 
                                          ? 'bg-[#111827] text-white border-[#111827]'
                                          : 'bg-white text-gray-500 border-gray-200'
                                    }`}>
                                      <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className={`text-[13px] font-medium ${isActive ? 'text-white' : 'text-[#111827]'}`}>
                                        {config.title}
                                      </div>
                                      <div className={`text-[11px] truncate ${isActive ? 'text-gray-200' : 'text-[#6B7280]'}`}>
                                        {config.description}
                                      </div>
                                    </div>
                                    {isActive && (
                                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}




      {/* Modal de Visualização de Lembretes */}
      {viewModal.open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40" onClick={(e) => e.target === e.currentTarget && setViewModal({ open: false, field: '' })}>
          <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header com X e abas alinhadas */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {/* Tab Navigation */}
              <div className="flex gap-1">
                <button
                  onClick={() => setModalTab('info')}
                  className={`flex items-center gap-2 px-4 py-2 text-[14px] font-medium rounded-lg transition-all duration-200 ${
                    modalTab === 'info'
                      ? 'bg-gray-100 text-gray-900 border border-gray-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-rounded text-[18px]">info</span>
                  Informações
                </button>
                <button
                  onClick={() => setModalTab('lembretes')}
                  className={`flex items-center gap-2 px-4 py-2 text-[14px] font-medium rounded-lg transition-all duration-200 ${
                    modalTab === 'lembretes'
                      ? 'bg-gray-100 text-gray-900 border border-gray-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-rounded text-[18px]">lightbulb</span>
                  Lembretes
                </button>
              </div>
              
              {/* Botão fechar */}
              <button 
                onClick={() => setViewModal({ open: false, field: '' })} 
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-rounded text-[18px]">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {modalTab === 'info' && (
                <div className="space-y-4">
                  {/* Botão adicionar/editar no topo */}
                  <button 
                    onClick={() => openEditModal(viewModal.field, 'info')}
                    className="px-3 py-1.5 text-[13px] font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:text-gray-700 transition-all"
                  >
                    Adicionar
                  </button>
                  
                  {/* Informação */}
                  {fieldReminders[viewModal.field]?.info ? (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-[13px] text-gray-800 relative group">
                      <div className="whitespace-pre-wrap">{fieldReminders[viewModal.field].info}</div>
                      <button
                        onClick={() => {
                          setFieldReminders(prev => ({
                            ...prev,
                            [viewModal.field]: {
                              ...prev[viewModal.field],
                              info: ''
                            }
                          }));
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity:100 text-gray-600 hover:text-gray-800 transition-opacity"
                        title="Remover informação"
                      >
                        <span className="material-symbols-rounded text-[16px]">close</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[13px] text-gray-500 italic">Nenhuma informação adicionada</p>
                    </div>
                  )}
                </div>
              )}

              {modalTab === 'lembretes' && (
                <div className="space-y-4">
                  {/* Botão adicionar no topo */}
                  <button 
                    onClick={() => openEditModal(viewModal.field, 'reminder')}
                    className="px-3 py-1.5 text-[13px] font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:text-gray-700 transition-all"
                  >
                    Adicionar
                  </button>
                  
                  {/* Lista de lembretes */}
                  {fieldReminders[viewModal.field]?.reminders?.length > 0 ? (
                    <div className="space-y-3">
                      {fieldReminders[viewModal.field].reminders.map((reminder, index) => (
                        <div 
                          key={index} 
                          className="p-4 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-800 relative group cursor-pointer hover:border-gray-300 hover:shadow-md transition-all"
                          onClick={() => setSelectedReminder(reminder)}
                          title="Clique para ver o conteúdo completo"
                        >
                          <div className="flex items-center gap-3">
                            {/* Ícone de lembrete */}
                            <div className="flex-shrink-0">
                              <span className="material-symbols-rounded text-[20px] text-amber-500">lightbulb</span>
                            </div>
                            
                            {/* Conteúdo do lembrete */}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900">{reminder.title}</div>
                              <div className="text-[12px] text-gray-600 mt-1 line-clamp-2">
                                {reminder.content.length > 80 
                                  ? `${reminder.content.substring(0, 80)}...` 
                                  : reminder.content
                                }
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmModal({
                                open: true,
                                field: viewModal.field,
                                index: index
                              });
                            }}
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                            title="Remover lembrete"
                          >
                            <span className="material-symbols-rounded text-[16px]">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[13px] text-gray-500 italic">Nenhum lembrete adicionado</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={(e) => e.target === e.currentTarget && setEditModal({ open: false, field: '', type: 'reminder' })}>
          <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-[16px] font-semibold text-gray-800">
                  {editModal.type === 'reminder' ? 'Lembrete' : 'Informações'} - {
                    editModal.field.startsWith('tab_') 
                      ? editModal.field.replace('tab_', '')
                      : editModal.field
                  }
                </h3>
                <p className="text-[12px] text-gray-600">
                  {editModal.type === 'reminder' 
                    ? (editModal.field.startsWith('tab_') ? 'Adicione um lembrete para esta aba' : 'Adicione um lembrete para este campo')
                    : (editModal.field.startsWith('tab_') ? 'Adicione informações sobre esta aba' : 'Adicione informações sobre este campo')
                  }
                </p>
              </div>
              <button 
                onClick={() => setEditModal({ open: false, field: '', type: 'reminder' })} 
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-rounded text-[18px]">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {editModal.type === 'reminder' ? (
                <div className="space-y-4">
                  {/* Campo de título */}
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">
                      Título do lembrete
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Ex: Verificar especificações técnicas"
                      className="w-full h-[40px] px-3 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-400"
                      autoFocus
                    />
                  </div>
                  {/* Campo de conteúdo */}
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">
                      Conteúdo do lembrete
                    </label>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="Digite o conteúdo detalhado do lembrete. Ex: Sempre verificar se as dimensões estão dentro das especificações do cliente antes de prosseguir com a produção."
                      className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-lg text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                </div>
              ) : (
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Digite as informações..."
                  className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-lg text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                  autoFocus
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button 
                onClick={() => setEditModal({ open: false, field: '', type: 'reminder' })}
                className="px-4 py-2 text-[14px] font-medium text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={saveFieldData}
                disabled={editModal.type === 'reminder' && (!editTitle.trim() || !editValue.trim())}
                className="px-4 py-2 text-[14px] font-medium bg-[#111827] text-white rounded-md hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização do Lembrete */}
      {selectedReminder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40" onClick={(e) => e.target === e.currentTarget && setSelectedReminder(null)}>
          <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div className="flex items-start gap-3">
                {/* Ícone de lembrete */}
                <div className="flex-shrink-0">
                  <span className="material-symbols-rounded text-[22px] text-amber-500 leading-none">lightbulb</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-[16px] font-semibold text-gray-800 leading-tight">
                    {selectedReminder.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="material-symbols-rounded text-[14px] text-gray-500 leading-none">calendar_today</span>
                    <p className="text-[12px] text-gray-600 leading-none">
                      Criado em {selectedReminder.date}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReminder(null)} 
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-rounded text-[18px]">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-[14px] text-gray-800">
                <div className="whitespace-pre-wrap">{selectedReminder.content}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button 
                onClick={() => setSelectedReminder(null)}
                className="px-4 py-2 text-[14px] font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirmModal.open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40" onClick={(e) => e.target === e.currentTarget && setDeleteConfirmModal({ open: false, field: '', index: -1 })}>
          <div className="bg-white rounded-lg shadow-lg w-[280px] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Content */}
            <div className="p-5 text-center">
              <h3 className="text-[15px] font-medium text-gray-800 mb-2">
                Excluir lembrete?
              </h3>
              <p className="text-[13px] text-gray-600">
                Esta ação não pode ser desfeita.
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 border-t border-gray-100">
              <button 
                onClick={() => setDeleteConfirmModal({ open: false, field: '', index: -1 })}
                className="flex-1 px-3 py-2 text-[13px] font-medium text-gray-600 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteReminder}
                className="flex-1 px-3 py-2 text-[13px] font-medium bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
