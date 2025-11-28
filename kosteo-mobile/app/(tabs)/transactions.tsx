import React from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_TRANSACTIONS = [
    { id: '1', date: '2023-10-25', amount: 150.00, description: 'Grocery Shopping', type: 'expense' },
    { id: '2', date: '2023-10-24', amount: 2500.00, description: 'Salary', type: 'income' },
    { id: '3', date: '2023-10-23', amount: 45.50, description: 'Coffee', type: 'expense' },
    { id: '4', date: '2023-10-22', amount: 120.00, description: 'Utilities', type: 'expense' },
    { id: '5', date: '2023-10-21', amount: 300.00, description: 'Freelance Work', type: 'income' },
];

export default function TransactionsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Transactions</Text>
            <FlatList
                data={MOCK_TRANSACTIONS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.description}>{item.description}</Text>
                            <Text style={[styles.amount, item.type === 'income' ? styles.income : styles.expense]}>
                                {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                            </Text>
                        </View>
                        <Text style={styles.date}>{item.date}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        padding: 20,
        backgroundColor: '#fff',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    description: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    income: {
        color: '#4CAF50',
    },
    expense: {
        color: '#F44336',
    },
    date: {
        fontSize: 14,
        color: '#888',
    },
});
