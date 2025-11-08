import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PaymentMethod = "credit" | "cash" | "crediario";

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("credit");

  const paymentMethods = [
    {
      id: "credit" as PaymentMethod,
      icon: "card-outline",
      title: "Cartão de Crédito na Entrega",
      subtitle: "Pague ao receber seu pedido",
      badge: null,
    },
    {
      id: "cash" as PaymentMethod,
      icon: "cash-outline",
      title: "Dinheiro na Entrega",
      subtitle: "Pague em dinheiro ao receber",
      badge: null,
    },
    {
      id: "crediario" as PaymentMethod,
      icon: "calendar-outline",
      title: "Pagar com Crediário",
      subtitle: "Parcele no crediário da loja",
      badge: null,
    },
  ];

  const handleConfirm = () => {
    console.log("Método selecionado:", selectedMethod);
    router.back();
  };

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
        <Text style={styles.headerTitle}>Forma de Pagamento</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Escolha como pagar</Text>

        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodIcon}>
                <Ionicons
                  name={method.icon as any}
                  size={28}
                  color={selectedMethod === method.id ? "#7C3AED" : "#666"}
                />
              </View>
              <View style={styles.methodInfo}>
                <View style={styles.methodTitleRow}>
                  <Text style={styles.methodTitle}>{method.title}</Text>
                  {method.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{method.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  selectedMethod === method.id && styles.radioOuterSelected,
                ]}
              >
                {selectedMethod === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Detalhes do método selecionado */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Informações</Text>

          {selectedMethod === "credit" && (
            <View style={styles.detailsContent}>
              <Ionicons name="card" size={20} color="#7C3AED" />
              <Text style={styles.detailsText}>
                Pague com cartão de crédito no momento da entrega. O pagamento
                será processado quando você receber seu pedido.
              </Text>
            </View>
          )}

          {selectedMethod === "cash" && (
            <View style={styles.detailsContent}>
              <Ionicons name="cash" size={20} color="#4CAF50" />
              <Text style={styles.detailsText}>
                Pague em dinheiro ao receber seu pedido. Tenha o valor exato ou
                troco disponível.
              </Text>
            </View>
          )}

          {selectedMethod === "crediario" && (
            <View style={styles.detailsContent}>
              <Ionicons name="calendar" size={20} color="#FF9800" />
              <Text style={styles.detailsText}>
                Parcele suas compras no crediário da loja. Consulte as condições
                disponíveis.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.savedCards}>
          <Text style={styles.savedCardsTitle}>Cartões salvos</Text>
          <TouchableOpacity style={styles.addCardButton}>
            <Ionicons name="add-circle-outline" size={24} color="#7C3AED" />
            <Text style={styles.addCardText}>Adicionar novo cartão</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer com botão confirmar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  methodsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  methodCardSelected: {
    borderColor: "#7C3AED",
    backgroundColor: "#F0E7FF",
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  badge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFF",
  },
  methodSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#7C3AED",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7C3AED",
  },
  detailsContainer: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  detailsContent: {
    flexDirection: "row",
    gap: 12,
  },
  detailsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  savedCards: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  savedCardsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  addCardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7C3AED",
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  confirmButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
});
