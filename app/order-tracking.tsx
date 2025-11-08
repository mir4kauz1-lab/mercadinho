import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TrackingStep = {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  completed: boolean;
  active: boolean;
  timestamp?: string;
};

export default function OrderTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;

  const trackingSteps: TrackingStep[] = [
    {
      id: 1,
      title: "Pedido Confirmado",
      subtitle: "Seu pedido foi recebido e confirmado",
      icon: "checkmark-circle",
      completed: true,
      active: false,
      timestamp: "08/11/2025 - 14:30",
    },
    {
      id: 2,
      title: "Pedido Separado",
      subtitle: "Seus produtos foram separados e embalados",
      icon: "cube",
      completed: true,
      active: false,
      timestamp: "08/11/2025 - 14:45",
    },
    {
      id: 3,
      title: "Saiu para Entrega",
      subtitle: "Seu pedido está a caminho do endereço",
      icon: "car",
      completed: false,
      active: true,
      timestamp: "08/11/2025 - 15:10",
    },
    {
      id: 4,
      title: "Pedido Entregue",
      subtitle: "Seu pedido foi entregue com sucesso",
      icon: "home",
      completed: false,
      active: false,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Acompanhar Pedido</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Info Card */}
        <View style={styles.orderInfoCard}>
          <View style={styles.orderInfoHeader}>
            <View>
              <Text style={styles.orderLabel}>Pedido</Text>
              <Text style={styles.orderNumber}>#{orderId}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Ionicons name="car-outline" size={20} color="#2196F3" />
              <Text style={styles.statusText}>A Caminho</Text>
            </View>
          </View>

          <View style={styles.deliveryInfo}>
            <Ionicons name="location" size={24} color="#7C3AED" />
            <View style={styles.deliveryDetails}>
              <Text style={styles.deliveryTitle}>Endereço de Entrega</Text>
              <Text style={styles.deliveryAddress}>
                Rua das Flores, 123 - Centro
              </Text>
              <Text style={styles.deliveryAddress}>São Paulo - SP</Text>
            </View>
          </View>

          <View style={styles.estimateContainer}>
            <Ionicons name="time-outline" size={20} color="#4CAF50" />
            <Text style={styles.estimateText}>
              Previsão de entrega:{" "}
              <Text style={styles.estimateTime}>30-45 min</Text>
            </Text>
          </View>
        </View>

        {/* Tracking Timeline */}
        <View style={styles.timelineContainer}>
          <Text style={styles.timelineTitle}>Status do Pedido</Text>

          {trackingSteps.map((step, index) => (
            <View key={step.id} style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                <View
                  style={[
                    styles.timelineIcon,
                    step.completed && styles.timelineIconCompleted,
                    step.active && styles.timelineIconActive,
                  ]}
                >
                  <Ionicons
                    name={step.icon as any}
                    size={24}
                    color={step.completed || step.active ? "#FFF" : "#CCC"}
                  />
                </View>
                {index < trackingSteps.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      step.completed && styles.timelineLineCompleted,
                    ]}
                  />
                )}
              </View>

              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineStepTitle,
                    (step.completed || step.active) &&
                      styles.timelineStepTitleActive,
                  ]}
                >
                  {step.title}
                </Text>
                <Text style={styles.timelineStepSubtitle}>{step.subtitle}</Text>
                {step.timestamp && (
                  <Text style={styles.timelineTimestamp}>{step.timestamp}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Help Section */}
        <View style={styles.helpCard}>
          <Ionicons name="help-circle-outline" size={24} color="#7C3AED" />
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Precisa de ajuda?</Text>
            <Text style={styles.helpText}>
              Entre em contato com nosso suporte para qualquer dúvida sobre seu
              pedido
            </Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/orders" as any)}
        >
          <Ionicons name="receipt-outline" size={24} color="#7C3AED" />
          <Text style={styles.secondaryButtonText}>Ver Todos os Pedidos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#7C3AED",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  orderInfoCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  orderLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2196F3",
  },
  deliveryInfo: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  deliveryDetails: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  deliveryAddress: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  estimateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  estimateText: {
    fontSize: 14,
    color: "#4CAF50",
  },
  estimateTime: {
    fontWeight: "700",
  },
  timelineContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 24,
  },
  timelineItem: {
    flexDirection: "row",
    gap: 16,
  },
  timelineIconContainer: {
    alignItems: "center",
  },
  timelineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineIconCompleted: {
    backgroundColor: "#4CAF50",
  },
  timelineIconActive: {
    backgroundColor: "#2196F3",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  timelineLineCompleted: {
    backgroundColor: "#4CAF50",
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineStepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#999",
    marginBottom: 4,
  },
  timelineStepTitleActive: {
    color: "#333",
  },
  timelineStepSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 6,
  },
  timelineTimestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  helpCard: {
    flexDirection: "row",
    backgroundColor: "#F0E7FF",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#7C3AED",
    alignItems: "center",
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7C3AED",
    marginBottom: 4,
  },
  helpText: {
    fontSize: 13,
    color: "#7C3AED",
    lineHeight: 18,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  secondaryButton: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#7C3AED",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7C3AED",
    letterSpacing: 0.5,
  },
});
