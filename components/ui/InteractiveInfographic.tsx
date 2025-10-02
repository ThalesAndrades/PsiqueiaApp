import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

interface DataItem {
  id: string;
  title: string;
  category: string;
  type: string;
  color: string;
}

interface CategoryInfo {
  name: string;
  color: string;
  icon: string;
  count: number;
}

interface InteractiveInfographicProps {
  data: DataItem[];
  title: string;
  categories: CategoryInfo[];
  onItemPress?: (item: DataItem) => void;
}

export default function InteractiveInfographic({
  data,
  title,
  categories,
  onItemPress,
}: InteractiveInfographicProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    translateY.value = withDelay(300, withSpring(0));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const filterData = selectedCategory 
    ? data.filter(item => item.category === selectedCategory)
    : data;

  const InfoCard = ({ category, index }: { category: CategoryInfo; index: number }) => {
    const cardOpacity = useSharedValue(0);
    const cardScale = useSharedValue(0.8);

    useEffect(() => {
      cardOpacity.value = withDelay(500 + index * 100, withTiming(1, { duration: 600 }));
      cardScale.value = withDelay(500 + index * 100, withSpring(1));
    }, []);

    const cardAnimatedStyle = useAnimatedStyle(() => ({
      opacity: cardOpacity.value,
      transform: [{ scale: cardScale.value }],
    }));

    const isSelected = selectedCategory === category.name;

    return (
      <Animated.View style={cardAnimatedStyle}>
        <TouchableOpacity
          onPress={() => setSelectedCategory(isSelected ? null : category.name)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={isSelected 
              ? [category.color + '40', category.color + '20']
              : ['rgba(26, 26, 46, 0.95)', 'rgba(22, 33, 62, 0.95)']
            }
            style={[
              styles.infoCard,
              isSelected && { borderColor: category.color, borderWidth: 2 }
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
                <MaterialIcons name={category.icon as any} size={20} color={category.color} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={[styles.categoryCount, { color: category.color }]}>
                  {category.count}
                </Text>
              </View>
            </View>
            
            {/* Barra de progreso visual */}
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: category.color,
                    width: `${(category.count / Math.max(...categories.map(c => c.count))) * 100}%`
                  }
                ]} 
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const DataItemRow = ({ item, index }: { item: DataItem; index: number }) => {
    const itemOpacity = useSharedValue(0);
    const itemTranslateX = useSharedValue(-50);

    useEffect(() => {
      itemOpacity.value = withDelay(800 + index * 50, withTiming(1, { duration: 400 }));
      itemTranslateX.value = withDelay(800 + index * 50, withSpring(0));
    }, []);

    const itemAnimatedStyle = useAnimatedStyle(() => ({
      opacity: itemOpacity.value,
      transform: [{ translateX: itemTranslateX.value }],
    }));

    const categoryInfo = categories.find(c => c.name === item.category);
    const isHighlighted = selectedCategory === null || selectedCategory === item.category;

    return (
      <Animated.View style={itemAnimatedStyle}>
        <TouchableOpacity
          onPress={() => onItemPress?.(item)}
          style={[styles.dataItem, !isHighlighted && styles.dataItemDimmed]}
          activeOpacity={0.7}
        >
          <View style={styles.itemIndicator}>
            <View style={[styles.colorBar, { backgroundColor: categoryInfo?.color || '#7B68EE' }]} />
            <View style={[styles.connectionDot, { backgroundColor: categoryInfo?.color || '#7B68EE' }]} />
          </View>
          
          <View style={styles.itemContent}>
            <Text style={[styles.itemTitle, !isHighlighted && styles.textDimmed]}>
              {item.title}
            </Text>
            <Text style={[styles.itemType, { color: categoryInfo?.color || '#7B68EE' }]}>
              {item.type}
            </Text>
          </View>

          {/* Linha de conexão visual */}
          <View style={styles.connectionLine}>
            <Svg width="50" height="20" style={styles.connectionSvg}>
              <Path
                d="M0,10 Q25,5 50,10"
                stroke={isHighlighted ? (categoryInfo?.color || '#7B68EE') : '#333'}
                strokeWidth="1"
                fill="none"
                opacity={isHighlighted ? 0.6 : 0.2}
              />
              <Circle
                cx="50"
                cy="10"
                r="2"
                fill={isHighlighted ? (categoryInfo?.color || '#7B68EE') : '#333'}
                opacity={isHighlighted ? 0.8 : 0.3}
              />
            </Svg>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          Total: <Text style={styles.totalCount}>{data.length}</Text> itens
        </Text>
      </View>

      {/* Categories Grid */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <InfoCard key={category.name} category={category} index={index} />
          ))}
        </View>
      </View>

      {/* Data Items List */}
      <View style={styles.dataContainer}>
        <View style={styles.dataHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? `${selectedCategory} (${filterData.length})` : 'Todos os Itens'}
          </Text>
          {selectedCategory && (
            <TouchableOpacity 
              onPress={() => setSelectedCategory(null)}
              style={styles.clearFilter}
            >
              <Text style={styles.clearFilterText}>Limpar</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          style={styles.dataList} 
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {filterData.map((item, index) => (
            <DataItemRow key={item.id} item={item} index={index} />
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7B68EE',
    marginTop: 4,
  },
  totalCount: {
    color: '#00E5FF',
    fontWeight: 'bold',
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    width: (screenWidth - 60) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(123, 104, 238, 0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(123, 104, 238, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  dataContainer: {
    flex: 1,
  },
  dataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    borderRadius: 12,
  },
  clearFilterText: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: '600',
  },
  dataList: {
    flex: 1,
    maxHeight: 300,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(123, 104, 238, 0.1)',
  },
  dataItemDimmed: {
    opacity: 0.4,
  },
  itemIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  colorBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  connectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  itemType: {
    fontSize: 12,
    marginTop: 2,
  },
  textDimmed: {
    color: '#666',
  },
  connectionLine: {
    marginLeft: 8,
  },
  connectionSvg: {
    overflow: 'visible',
  },
});