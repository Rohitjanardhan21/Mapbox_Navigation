import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OfflineMapDownloader = ({ visible, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const campusRegions = [
    { id: 'main', name: 'Main Campus', size: '25 MB' },
    { id: 'north', name: 'North Campus', size: '15 MB' },
    { id: 'south', name: 'South Campus', size: '12 MB' },
    { id: 'sports', name: 'Sports Complex Area', size: '8 MB' }
  ];

  const handleDownload = (region) => {
    Alert.alert(
      'Download Offline Map',
      `Download ${region.name} (${region.size}) for offline use?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: () => {
            setDownloading(true);
            // Simulate download
            let prog = 0;
            const interval = setInterval(() => {
              prog += 10;
              setProgress(prog);
              if (prog >= 100) {
                clearInterval(interval);
                setDownloading(false);
                setProgress(0);
                Alert.alert('Success', `${region.name} downloaded successfully!`);
              }
            }, 300);
          }
        }
      ]
    );
  };

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
            <Text style={styles.headerTitle}>Offline Maps</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Download campus maps for offline navigation
          </Text>

          {downloading && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Downloading... {progress}%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>
          )}

          <View style={styles.regionList}>
            {campusRegions.map(region => (
              <TouchableOpacity
                key={region.id}
                style={styles.regionCard}
                onPress={() => handleDownload(region)}
                disabled={downloading}
              >
                <View style={styles.regionIcon}>
                  <Ionicons name="map" size={24} color="#4285F4" />
                </View>
                <View style={styles.regionInfo}>
                  <Text style={styles.regionName}>{region.name}</Text>
                  <Text style={styles.regionSize}>{region.size}</Text>
                </View>
                <Ionicons name="download-outline" size={24} color="#4285F4" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#2196F3" />
            <Text style={styles.infoText}>
              Offline maps allow navigation without internet connection
            </Text>
          </View>
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
    maxHeight: '70%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#4285F4',
    marginBottom: 8,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4285F4',
  },
  regionList: {
    marginBottom: 20,
  },
  regionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  regionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  regionInfo: {
    flex: 1,
  },
  regionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  regionSize: {
    fontSize: 12,
    color: '#666',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    color: '#1976D2',
  },
});

export default OfflineMapDownloader;
