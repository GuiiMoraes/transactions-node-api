import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactions {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const reducer = (accumulator: number, currentValue: number): number =>
      accumulator + currentValue;

    const incomeTransactions = this.transactions.filter(
      transaction => transaction.type === 'income',
    );
    const incomeValues = incomeTransactions.map(
      incomeTransaction => incomeTransaction.value,
    );
    const incomesSum = incomeValues.reduce(reducer, 0);

    const outcomeTransactions = this.transactions.filter(
      transaction => transaction.type === 'outcome',
    );
    const outcomeValues = outcomeTransactions.map(
      outcomeTransaction => outcomeTransaction.value,
    );
    const outcomesSum = outcomeValues.reduce(reducer, 0);

    const totalSum = incomesSum - outcomesSum;

    return {
      income: incomesSum,
      outcome: outcomesSum,
      total: totalSum,
    };
  }

  public create({ title, value, type }: CreateTransactions): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
