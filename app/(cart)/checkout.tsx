// Checkout movido para (cart)
import { useCart } from "@/contexts/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
type PaymentMethod = "credit" | "cash" | "crediario";
export default function CheckoutScreen() {
  const router = useRouter();
  const { items: cartItems, getTotalPrice, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethod>("credit");
  const [selectedAddress, setSelectedAddress] = useState("principal");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const subtotal = getTotalPrice();
  const shipping = 12.0;
  const discount = appliedCoupon ? 15.0 : 0;
  const total = subtotal + shipping - discount;
  const addresses = [
    {
      id: "principal",
      label: "Principal",
      street: "Rua das Flores, 123",
      district: "Centro",
      city: "São Paulo - SP",
      cep: "01234-567",
    },
    {
      id: "trabalho",
      label: "Trabalho",
      street: "Av. Paulista, 1000",
      district: "Bela Vista",
      city: "São Paulo - SP",
      cep: "01310-100",
    },
  ];
  const paymentMethods = [
    {
      id: "credit" as PaymentMethod,
      icon: "card-outline",
      title: "Cartão de Crédito na Entrega",
      subtitle: "Pague ao receber seu pedido",
    },
    {
      id: "cash" as PaymentMethod,
      icon: "cash-outline",
      title: "Dinheiro na Entrega",
      subtitle: "Pague em dinheiro ao receber",
    },
    {
      id: "crediario" as PaymentMethod,
      icon: "calendar-outline",
      title: "Pagar com Crediário",
      subtitle: "Parcele no crediário da loja",
    },
  ];
  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "santafe10") {
      setAppliedCoupon(true);
      Alert.alert("Sucesso!", "Cupom aplicado com sucesso! 🎉");
    } else {
      Alert.alert("Erro", "Cupom inválido. Tente: SANTAFE10");
    }
  };
  const handleFinishOrder = () => {
    const orderId = Math.floor(Math.random() * 900000) + 100000;
    clearCart();
    router.push(
      `/order-success?orderId=${orderId}&total=${total.toFixed(2)}` as any
    );
  };
  return (
    <View style={styles.container}>
      {" "}
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />{" "}
      <View style={styles.header}>
        {" "}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>{" "}
        <Text style={styles.headerTitle}>Finalizar Pedido</Text>{" "}
        <View style={styles.placeholder} />{" "}
      </View>{" "}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {" "}
        <View className="section" style={styles.section}>
          {" "}
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={24} color="#7C3AED" />
            <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
          </View>{" "}
          {addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                selectedAddress === address.id && styles.addressCardSelected,
              ]}
              onPress={() => setSelectedAddress(address.id)}
            >
              {" "}
              <View style={styles.addressInfo}>
                <Text style={styles.addressLabel}>{address.label}</Text>
                <Text style={styles.addressText}>{address.street}</Text>
                <Text style={styles.addressText}>
                  {address.district} - {address.city}
                </Text>
                <Text style={styles.addressText}>CEP: {address.cep}</Text>
              </View>{" "}
              <View
                style={[
                  styles.radioOuter,
                  selectedAddress === address.id && styles.radioOuterSelected,
                ]}
              >
                {" "}
                {selectedAddress === address.id && (
                  <View style={styles.radioInner} />
                )}{" "}
              </View>{" "}
            </TouchableOpacity>
          ))}{" "}
          <TouchableOpacity style={styles.addAddressButton}>
            <Ionicons name="add-circle-outline" size={20} color="#7C3AED" />
            <Text style={styles.addAddressText}>Adicionar novo endereço</Text>
          </TouchableOpacity>{" "}
        </View>{" "}
        <View style={styles.section}>
          {" "}
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={24} color="#7C3AED" />
            <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
          </View>{" "}
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                selectedPayment === method.id && styles.paymentCardSelected,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              {" "}
              <Ionicons
                name={method.icon as any}
                size={24}
                color={selectedPayment === method.id ? "#7C3AED" : "#666"}
              />{" "}
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>{method.title}</Text>
                <Text style={styles.paymentSubtitle}>{method.subtitle}</Text>
              </View>{" "}
              <View
                style={[
                  styles.radioOuter,
                  selectedPayment === method.id && styles.radioOuterSelected,
                ]}
              >
                {" "}
                {selectedPayment === method.id && (
                  <View style={styles.radioInner} />
                )}{" "}
              </View>{" "}
            </TouchableOpacity>
          ))}{" "}
        </View>{" "}
        <View style={styles.section}>
          {" "}
          <View style={styles.sectionHeader}>
            <Ionicons name="pricetag" size={24} color="#7C3AED" />
            <Text style={styles.sectionTitle}>Cupom de Desconto</Text>
          </View>{" "}
          <View style={styles.couponContainer}>
            <TextInput
              style={styles.couponInput}
              placeholder="Digite o código do cupom"
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
              editable={!appliedCoupon}
            />
            <TouchableOpacity
              style={[
                styles.couponButton,
                appliedCoupon && styles.couponButtonApplied,
              ]}
              onPress={handleApplyCoupon}
              disabled={appliedCoupon}
            >
              <Text style={styles.couponButtonText}>
                {appliedCoupon ? "Aplicado" : "Aplicar"}
              </Text>
            </TouchableOpacity>
          </View>{" "}
          {appliedCoupon && (
            <View style={styles.couponSuccess}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.couponSuccessText}>
                Cupom aplicado! R$ 15,00 de desconto
              </Text>
            </View>
          )}{" "}
        </View>{" "}
        <View style={styles.section}>
          {" "}
          <View style={styles.sectionHeader}>
            <Ionicons name="cart" size={24} color="#7C3AED" />
            <Text style={styles.sectionTitle}>
              Resumo do Pedido ({cartItems.length}{" "}
              {cartItems.length === 1 ? "item" : "itens"})
            </Text>
          </View>{" "}
          {cartItems.map((item) => (
            <View key={item.id} style={styles.productItem}>
              {" "}
              <Image
                source={item.image as any}
                style={styles.productImage}
              />{" "}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.productQuantity}>Qtd: {item.quantity}</Text>
              </View>{" "}
              <Text style={styles.productPrice}>
                R$ {(item.price * item.quantity).toFixed(2)}
              </Text>{" "}
            </View>
          ))}{" "}
        </View>{" "}
        <View style={styles.summarySection}>
          {" "}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
          </View>{" "}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frete</Text>
            <Text style={styles.summaryValue}>R$ {shipping.toFixed(2)}</Text>
          </View>{" "}
          {appliedCoupon && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.discountText]}>
                Desconto
              </Text>
              <Text style={[styles.summaryValue, styles.discountText]}>
                - R$ {discount.toFixed(2)}
              </Text>
            </View>
          )}{" "}
          <View style={styles.divider} />{" "}
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>{" "}
        </View>{" "}
        <View style={styles.bottomSpacer} />{" "}
      </ScrollView>{" "}
      <View style={styles.footer}>
        {" "}
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Total a pagar</Text>
          <Text style={styles.footerTotal}>R$ {total.toFixed(2)}</Text>
        </View>{" "}
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishOrder}
        >
          <Text style={styles.finishButtonText}>Confirmar Pedido</Text>
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
        </TouchableOpacity>{" "}
      </View>{" "}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#7C3AED",
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#FFF" },
  placeholder: { width: 32 },
  content: { flex: 1 },
  contentContainer: { paddingBottom: 20 },
  section: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  addressCardSelected: { borderColor: "#7C3AED", backgroundColor: "#F0E7FF" },
  addressInfo: { flex: 1 },
  addressLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  addressText: { fontSize: 14, color: "#666", marginBottom: 2 },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: { borderColor: "#7C3AED" },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7C3AED",
  },
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    borderRadius: 12,
  },
  addAddressText: { fontSize: 14, fontWeight: "600", color: "#7C3AED" },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    gap: 12,
  },
  paymentCardSelected: { borderColor: "#7C3AED", backgroundColor: "#F0E7FF" },
  paymentInfo: { flex: 1 },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  paymentSubtitle: { fontSize: 13, color: "#666" },
  couponContainer: { flexDirection: "row", gap: 12 },
  couponInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  couponButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  couponButtonApplied: { backgroundColor: "#4CAF50" },
  couponButtonText: { fontSize: 14, fontWeight: "700", color: "#FFF" },
  couponSuccess: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
  },
  couponSuccessText: { fontSize: 14, color: "#4CAF50", fontWeight: "600" },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  productImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 12,
  },
  productInfo: { flex: 1 },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productQuantity: { fontSize: 12, color: "#666" },
  productPrice: { fontSize: 16, fontWeight: "700", color: "#7C3AED" },
  summarySection: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 14, color: "#666" },
  summaryValue: { fontSize: 14, fontWeight: "600", color: "#333" },
  discountText: { color: "#4CAF50" },
  divider: { height: 1, backgroundColor: "#E0E0E0", marginVertical: 8 },
  totalLabel: { fontSize: 18, fontWeight: "700", color: "#333" },
  totalValue: { fontSize: 22, fontWeight: "700", color: "#7C3AED" },
  bottomSpacer: { height: 20 },
  footer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    gap: 12,
  },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLabel: { fontSize: 14, color: "#666" },
  footerTotal: { fontSize: 24, fontWeight: "700", color: "#333" },
  finishButton: {
    flexDirection: "row",
    backgroundColor: "#7C3AED",
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
});
