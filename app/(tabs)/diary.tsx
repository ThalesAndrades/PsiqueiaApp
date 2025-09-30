import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientCard from '../../components/ui/GradientCard';
import PsiqueButton from '../../components/ui/PsiqueButton';
import DynamicTextInput from '../../components/ui/DynamicTextInput';
import CustomSlider from '../../components/ui/CustomSlider';
import DiarySuccessAnimation from '../../components/ui/DiarySuccessAnimation';
import { useAuth, showAlert } from '../../hooks/useAuth';

interface DiaryEntry {
  id: string;
  date: string;
  time: string;
  mood: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export default function Diary() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry>({
    id: '',
    date: new Date().toLocaleDateString('pt-BR'),
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    mood: 5,
    title: '',
    content: '',
    tags: [],
    createdAt: new Date().toISOString(),
  });
  
  const [recentEntries, setRecentEntries] = useState<DiaryEntry[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const availableTags = [
    { name: 'Ansiedade', color: '#FF6B6B', icon: 'psychology' },
    { name: 'Gratidão', color: '#20B2AA', icon: 'favorite' },
    { name: 'Reflexão', color: '#7B68EE', icon: 'lightbulb' },
    { name: 'Progresso', color: '#00E5FF', icon: 'trending-up' },
    { name: 'Desafio', color: '#FFD700', icon: 'fitness-center' },
    { name: 'Família', color: '#FF6B9D', icon: 'family-restroom' },
    { name: 'Trabalho', color: '#20B2AA', icon: 'work' },
    { name: 'Relacionamentos', color: '#FF8C00', icon: 'people' },
  ];

  useEffect(() => {
    loadRecentEntries();
  }, []);

  const loadRecentEntries = async () => {
    try {
      setIsLoading(true);
      const entries = await AsyncStorage.getItem(`diary_entries_${user?.id}`);
      if (entries) {
        const parsedEntries = JSON.parse(entries);
        setRecentEntries(parsedEntries.slice(0, 5)); // Últimas 5 entradas
      }
    } catch (error) {
      console.error('Erro ao carregar entradas:', error);
      showAlert('Erro', 'Não foi possível carregar as entradas do diário.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!currentEntry.content.trim()) {
      showAlert('Campo Obrigatório', 'Por favor, escreva algo em seu diário antes de salvar.');
      return;
    }

    try {
      const entryToSave = {
        ...currentEntry,
        id: currentEntry.id || Date.now().toString(),
        tags: selectedTags,
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      const existingEntries = await AsyncStorage.getItem(`diary_entries_${user?.id}`);
      let entries = existingEntries ? JSON.parse(existingEntries) : [];
      
      if (currentEntry.id) {
        // Atualizar entrada existente
        entries = entries.map((entry: DiaryEntry) => 
          entry.id === currentEntry.id ? entryToSave : entry
        );
      } else {
        // Nova entrada
        entries.unshift(entryToSave);
      }

      await AsyncStorage.setItem(`diary_entries_${user?.id}`, JSON.stringify(entries));
      
      // Show success animation
      setShowSuccessAnimation(true);
      
      // Reset form
      resetForm();
      
      // Reload entries
      loadRecentEntries();
    } catch (error) {
      console.error('Erro ao salvar entrada:', error);
      showAlert('Erro', 'Não foi possível salvar sua entrada. Tente novamente.');
    }
  };

  const resetForm = () => {
    setCurrentEntry({
      id: '',
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      mood: 5,
      title: '',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
    });
    setSelectedTags([]);
    setIsEditing(false);
  };

  const loadEntry = (entry: DiaryEntry) => {
    setCurrentEntry(entry);
    setSelectedTags(entry.tags);
    setIsEditing(true);
  };

  const deleteEntry = async (entryId: string) => {
    try {
      const existingEntries = await AsyncStorage.getItem(`diary_entries_${user?.id}`);
      if (existingEntries) {
        let entries = JSON.parse(existingEntries);
        entries = entries.filter((entry: DiaryEntry) => entry.id !== entryId);
        await AsyncStorage.setItem(`diary_entries_${user?.id}`, JSON.stringify(entries));
        loadRecentEntries();
        showAlert('Sucesso', 'Entrada excluída com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao excluir entrada:', error);
      showAlert('Erro', 'Não foi possível excluir a entrada.');
    }
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName)
        ? prev.filter(tag => tag !== tagName)
        : [...prev, tagName]
    );
  };

  const handleCalendar = () => {
    if (recentEntries.length === 0) {
      showAlert(
        'Diário Vazio',
        'Você ainda não tem entradas no seu diário.\n\nComece escrevendo seus pensamentos e sentimentos para criar um histórico!'
      );
      return;
    }

    const entriesInfo = recentEntries.map((entry, index) => 
      `${index + 1}. ${entry.date} - ${entry.time}${entry.title ? ` (${entry.title})` : ''}`
    ).join('\n');

    showAlert(
      'Histórico do Diário',
      `📅 Suas últimas ${recentEntries.length} entradas:\n\n${entriesInfo}\n\n💡 Toque em uma entrada para editá-la.`
    );
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '😐';
    if (mood >= 4) return '😔';
    return '😢';
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return '#20B2AA';
    if (mood >= 6) return '#FFD700';
    if (mood >= 4) return '#FF8C00';
    return '#FF6B6B';
  };

  const getMoodLabel = (mood: number) => {
    if (mood >= 8) return 'Excelente';
    if (mood >= 6) return 'Bom';
    if (mood >= 4) return 'Regular';
    return 'Difícil';
  };

  return (
    <LinearGradient
      colors={['#0A0E1A', '#1A1A2E', '#16213E']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Meu Diário</Text>
          <Text style={styles.subtitle}>Registre seus pensamentos e sentimentos</Text>
        </View>
        <TouchableOpacity style={styles.calendarButton} onPress={handleCalendar}>
          <MaterialIcons name="calendar-today" size={24} color="#00E5FF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Nova Entrada */}
          <GradientCard style={styles.newEntryCard}>
            <View style={styles.newEntryContent}>
              <Text style={styles.sectionTitle}>
                {isEditing ? 'Editar Entrada' : 'Nova Entrada'}
              </Text>
              
              {/* Data e Hora */}
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateContainer}>
                  <MaterialIcons name="event" size={20} color="#00E5FF" />
                  <Text style={styles.dateText}>{currentEntry.date}</Text>
                </View>
                <View style={styles.timeContainer}>
                  <MaterialIcons name="access-time" size={20} color="#7B68EE" />
                  <Text style={styles.timeText}>{currentEntry.time}</Text>
                </View>
              </View>

              {/* Humor */}
              <View style={styles.moodSection}>
                <Text style={styles.moodTitle}>Como você está se sentindo?</Text>
                <View style={styles.moodDisplay}>
                  <Text style={styles.moodEmoji}>{getMoodEmoji(currentEntry.mood)}</Text>
                  <View style={styles.moodInfo}>
                    <Text style={[styles.moodLabel, { color: getMoodColor(currentEntry.mood) }]}>
                      {getMoodLabel(currentEntry.mood)}
                    </Text>
                    <Text style={styles.moodValue}>
                      {currentEntry.mood}/10
                    </Text>
                  </View>
                </View>
                <CustomSlider
                  value={currentEntry.mood}
                  onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, mood: value }))}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  showValue={false}
                />
              </View>

              {/* Título */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Título (opcional)</Text>
                <DynamicTextInput
                  value={currentEntry.title}
                  onChangeText={(text) => setCurrentEntry(prev => ({ ...prev, title: text }))}
                  placeholder="Dê um título para sua entrada..."
                  minHeight={50}
                  maxHeight={100}
                  multiline={false}
                />
              </View>

              {/* Conteúdo */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Como foi seu dia?</Text>
                <DynamicTextInput
                  value={currentEntry.content}
                  onChangeText={(text) => setCurrentEntry(prev => ({ ...prev, content: text }))}
                  placeholder="Escreva seus pensamentos, sentimentos, experiências do dia..."
                  minHeight={120}
                  maxHeight={300}
                />
              </View>

              {/* Tags */}
              <View style={styles.tagsSection}>
                <Text style={styles.inputLabel}>Tags (temas do dia)</Text>
                <View style={styles.tagsContainer}>
                  {availableTags.map((tag) => (
                    <TouchableOpacity
                      key={tag.name}
                      style={[
                        styles.tag,
                        selectedTags.includes(tag.name) && [
                          styles.tagSelected,
                          { backgroundColor: tag.color + '20', borderColor: tag.color }
                        ]
                      ]}
                      onPress={() => toggleTag(tag.name)}
                    >
                      <MaterialIcons 
                        name={tag.icon as any} 
                        size={16} 
                        color={selectedTags.includes(tag.name) ? tag.color : '#7B68EE'} 
                      />
                      <Text style={[
                        styles.tagText,
                        selectedTags.includes(tag.name) && { color: tag.color }
                      ]}>
                        {tag.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Botões */}
              <View style={styles.actionButtons}>
                {isEditing && (
                  <PsiqueButton
                    title="Cancelar"
                    onPress={resetForm}
                    style={styles.cancelButton}
                    variant="outline"
                  />
                )}
                <PsiqueButton
                  title={isEditing ? "Atualizar" : "Salvar Entrada"}
                  onPress={saveEntry}
                  style={styles.saveButton}
                />
              </View>
            </View>
          </GradientCard>

          {/* Entradas Recentes */}
          {!isLoading && recentEntries.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Entradas Recentes</Text>
              {recentEntries.map((entry) => (
                <GradientCard key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryContent}>
                    <View style={styles.entryHeader}>
                      <View style={styles.entryDateTime}>
                        <View style={styles.entryDate}>
                          <MaterialIcons name="event" size={16} color="#00E5FF" />
                          <Text style={styles.entryDateText}>{entry.date}</Text>
                        </View>
                        <View style={styles.entryTime}>
                          <MaterialIcons name="access-time" size={14} color="#7B68EE" />
                          <Text style={styles.entryTimeText}>{entry.time}</Text>
                        </View>
                      </View>
                      <View style={styles.entryMood}>
                        <Text style={styles.entryMoodEmoji}>{getMoodEmoji(entry.mood)}</Text>
                        <Text style={[styles.entryMoodText, { color: getMoodColor(entry.mood) }]}>
                          {entry.mood}/10
                        </Text>
                      </View>
                    </View>
                    
                    {entry.title && (
                      <Text style={styles.entryTitle}>{entry.title}</Text>
                    )}
                    
                    <Text style={styles.entryPreview} numberOfLines={3}>
                      {entry.content}
                    </Text>
                    
                    {entry.tags.length > 0 && (
                      <View style={styles.entryTags}>
                        {entry.tags.slice(0, 3).map((tagName) => {
                          const tagInfo = availableTags.find(t => t.name === tagName);
                          return (
                            <View key={tagName} style={[styles.entryTag, { backgroundColor: tagInfo?.color + '20' }]}>
                              <Text style={[styles.entryTagText, { color: tagInfo?.color }]}>
                                {tagName}
                              </Text>
                            </View>
                          );
                        })}
                        {entry.tags.length > 3 && (
                          <Text style={styles.moreTagsText}>+{entry.tags.length - 3}</Text>
                        )}
                      </View>
                    )}

                    <View style={styles.entryActions}>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => loadEntry(entry)}
                      >
                        <MaterialIcons name="edit" size={16} color="#00E5FF" />
                        <Text style={styles.editButtonText}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => deleteEntry(entry.id)}
                      >
                        <MaterialIcons name="delete" size={16} color="#FF6B6B" />
                        <Text style={styles.deleteButtonText}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </GradientCard>
              ))}
            </View>
          )}

          {/* Estado de Loading */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando entradas...</Text>
            </View>
          )}

          {/* Estado Vazio */}
          {!isLoading && recentEntries.length === 0 && (
            <GradientCard style={styles.emptyStateCard}>
              <View style={styles.emptyStateContent}>
                <MaterialIcons name="book" size={64} color="#7B68EE" />
                <Text style={styles.emptyStateTitle}>Seu diário está vazio</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Comece escrevendo seus pensamentos e sentimentos. 
                  É um espaço seguro para você se expressar!
                </Text>
              </View>
            </GradientCard>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Animation */}
      <DiarySuccessAnimation
        visible={showSuccessAnimation}
        onComplete={() => setShowSuccessAnimation(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 229, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7B68EE',
    marginTop: 4,
  },
  calendarButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  newEntryCard: {
    marginBottom: 32,
  },
  newEntryContent: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#00E5FF',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 16,
    color: '#7B68EE',
    fontWeight: '600',
  },
  moodSection: {
    marginBottom: 24,
  },
  moodTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    fontWeight: '600',
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  moodEmoji: {
    fontSize: 32,
  },
  moodInfo: {
    flex: 1,
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  moodValue: {
    fontSize: 14,
    color: '#7B68EE',
    marginTop: 2,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    fontWeight: '600',
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(123, 104, 238, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(123, 104, 238, 0.3)',
    gap: 6,
  },
  tagSelected: {
    borderWidth: 2,
  },
  tagText: {
    fontSize: 12,
    color: '#7B68EE',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
  recentSection: {
    marginBottom: 24,
  },
  entryCard: {
    marginBottom: 16,
  },
  entryContent: {
    padding: 20,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDateTime: {
    flex: 1,
  },
  entryDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  entryTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  entryDateText: {
    fontSize: 14,
    color: '#00E5FF',
    fontWeight: '600',
  },
  entryTimeText: {
    fontSize: 12,
    color: '#7B68EE',
    fontWeight: '500',
  },
  entryMood: {
    alignItems: 'center',
    gap: 4,
  },
  entryMoodEmoji: {
    fontSize: 20,
  },
  entryMoodText: {
    fontSize: 12,
    fontWeight: '600',
  },
  entryTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  entryPreview: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 12,
  },
  entryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  entryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  entryTagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#7B68EE',
    fontWeight: '600',
  },
  entryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(123, 104, 238, 0.2)',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    color: '#00E5FF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#7B68EE',
    fontSize: 16,
  },
  emptyStateCard: {
    marginTop: 20,
  },
  emptyStateContent: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#7B68EE',
    textAlign: 'center',
    lineHeight: 22,
  },
});