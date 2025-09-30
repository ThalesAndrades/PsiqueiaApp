import React from 'react';
import { View, StyleSheet } from 'react-native';
import InteractiveInfographic from './InteractiveInfographic';

interface DashboardStatsProps {
  userType: 'patient' | 'psychologist';
}

export default function DashboardStats({ userType }: DashboardStatsProps) {
  
  if (userType === 'patient') {
    const patientData = [
      { id: '1', title: 'Sessão de Ansiedade', category: 'Terapia Individual', type: 'Concluída', color: '#00E5FF' },
      { id: '2', title: 'Exercício de Respiração', category: 'Bem-estar', type: 'Em Progresso', color: '#7B68EE' },
      { id: '3', title: 'Consulta Inicial', category: 'Terapia Individual', type: 'Concluída', color: '#00E5FF' },
      { id: '4', title: 'Meditação Guiada', category: 'Bem-estar', type: 'Disponível', color: '#7B68EE' },
      { id: '5', title: 'Terapia de Casal', category: 'Terapia em Grupo', type: 'Agendada', color: '#20B2AA' },
      { id: '6', title: 'Diário de Humor', category: 'Bem-estar', type: 'Pendente', color: '#7B68EE' },
      { id: '7', title: 'Sessão de Mindfulness', category: 'Terapia Individual', type: 'Concluída', color: '#00E5FF' },
      { id: '8', title: 'Grupo de Apoio', category: 'Terapia em Grupo', type: 'Agendada', color: '#20B2AA' },
    ];

    const patientCategories = [
      { name: 'Terapia Individual', color: '#00E5FF', icon: 'psychology', count: 3 },
      { name: 'Bem-estar', color: '#7B68EE', icon: 'self-improvement', count: 3 },
      { name: 'Terapia em Grupo', color: '#20B2AA', icon: 'groups', count: 2 },
    ];

    return (
      <View style={styles.container}>
        <InteractiveInfographic
          data={patientData}
          title="Meu Progresso Terapêutico"
          categories={patientCategories}
          onItemPress={(item) => console.log('Item selecionado:', item.title)}
        />
      </View>
    );
  }

  // Psicólogo
  const psychologistData = [
    { id: '1', title: 'Maria Silva - Ansiedade', category: 'Pacientes Ativos', type: 'Sessão Hoje', color: '#00E5FF' },
    { id: '2', title: 'João Santos - Depressão', category: 'Pacientes Ativos', type: 'Próxima: 15h', color: '#00E5FF' },
    { id: '3', title: 'Ana Costa - Finalizada', category: 'Pacientes Inativos', type: 'Concluído', color: '#7B68EE' },
    { id: '4', title: 'Carlos Lima - Terapia Casal', category: 'Pacientes Ativos', type: 'Agendado', color: '#00E5FF' },
    { id: '5', title: 'Relatório Mensal', category: 'Administrativo', type: 'Pendente', color: '#20B2AA' },
    { id: '6', title: 'Atualização de Prontuário', category: 'Administrativo', type: 'Vencido', color: '#20B2AA' },
    { id: '7', title: 'Lúcia Santos - Trauma', category: 'Pacientes Ativos', type: 'Emergência', color: '#00E5FF' },
    { id: '8', title: 'Certificação Continuada', category: 'Desenvolvimento', type: 'Em Progresso', color: '#FFD700' },
  ];

  const psychologistCategories = [
    { name: 'Pacientes Ativos', color: '#00E5FF', icon: 'people', count: 4 },
    { name: 'Administrativo', color: '#20B2AA', icon: 'assignment', count: 2 },
    { name: 'Pacientes Inativos', color: '#7B68EE', icon: 'person-off', count: 1 },
    { name: 'Desenvolvimento', color: '#FFD700', icon: 'school', count: 1 },
  ];

  return (
    <View style={styles.container}>
      <InteractiveInfographic
        data={psychologistData}
        title="Visão Geral da Prática"
        categories={psychologistCategories}
        onItemPress={(item) => console.log('Item selecionado:', item.title)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});