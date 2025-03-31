import { AppContext } from "@/context/AppContext";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { ConversationItem } from "./ConversationItem";

export const ConversationsScreen = () => {
  const [historicalConversations, setHistoricalConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(AppContext);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await fetch(user.website + "/api/getConversations");
      const data = await response.json();
      setHistoricalConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConversations().then(() => setRefreshing(false));
  }, [fetchConversations]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    );
  }

  return (
    <FlatList
      data={historicalConversations}
      keyExtractor={(item) => item.id.toString()}
      renderItem={(item) => <ConversationItem {...item} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#555",
  },
  unread: {
    fontSize: 14,
    color: "red",
    marginTop: 5,
  },
});

export default ConversationsScreen;
