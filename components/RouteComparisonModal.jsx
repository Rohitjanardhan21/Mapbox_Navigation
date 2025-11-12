import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RouteComparisonModal = ({ 
  visible, 
  onClose, 
  mainRoute, 
  alternatives,
  onSelectRoute 
}) => {
  if (!mainRoute) return null;

  const renderScoreBar = (score, label, color) => (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={styles.scoreBarContainer}>
        <View style={[styles.scoreBar, { width: `${score * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.scoreValue}>{(score * 100).toFixed(0)}%</Text>
    </View>
  );

  const renderRoute = (route, score, index, isRecommended) => (
    <View style={[styles.routeCard, isRecommended && styles.recommendedCard]}>
      {isRecommended && (
        <View style={styles.recommendedBadge}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.recommendedText}>AI Recommended</Text>
        </View>
      )}
      
      <Text style={styles.routeTitle}>Route {index + 1}</Text>
      
      <View style={styles.routeStats}>
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={20} color="#4285F4" />
          <Text style={styles.statValue}>{route.duration} min</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="navigate-outline" size={20} color="#4285F4" />
          <Text style={styles.statValue}>{route.distance} km</Text>
        </View>
      </View>

      {score && (
        <View style={styles.scoreSection}>
          <Text style={styles.scoreTitle}>AI Score: {(score.totalScore * 100).toFixed(0)}/100</Text>
          {renderScoreBar(score.breakdown.duration, 'Walking Time', '#4CAF50')}
          {renderScoreBar(score.breakdown.pedestrianTraffic, 'Crowd Level', '#2196F3')}
          {renderScoreBar(score.breakdown.pathQuality, 'Path Quality', '#FF9800')}
          {renderScoreBar(score.breakdown.accessibility, 'Accessibility', '#9C27B0')}
          {renderScoreBar(score.breakdown.distance, 'Distance', '#607D8B')}
        </View>
      )}

      <TouchableOpacity
        style={[styles.selectButton, isRecommended && styles.recommendedButton]}
        onPress={() => onSelectRoute(route, index)}
      >
        <Text style={styles.selectButtonText}>
          {isRecommended ? 'Use This Route' : 'Select Route'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Choose Your Route</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <Text style={styles.subtitle}>
              AI analyzed {alternatives.length + 1} route{alternatives.length > 0 ? 's' : ''} to find the best option
            </Text>

            {renderRoute(mainRoute, mainRoute.score, 0, true)}

            {alternatives.map((alt, index) => 
              renderRoute(alt.route, alt.score, index + 1, false)
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    padding: 15,
    paddingTop: 10,
  },
  scrollView: {
    padding: 15,
  },
  routeCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  recommendedCard: {
    borderColor: '#4285F4',
    backgroundColor: '#f0f7ff',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  recommendedText: {
    marginLeft: 5,
    color: '#4285F4',
    fontWeight: 'bold',
    fontSize: 12,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scoreSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    width: 80,
    fontSize: 12,
    color: '#666',
  },
  scoreBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    borderRadius: 4,
  },
  scoreValue: {
    width: 40,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  selectButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  recommendedButton: {
    backgroundColor: '#34A853',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RouteComparisonModal;
