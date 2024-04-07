export type Stake = {
  user: string;
  amount: number;
  since: number;
  claimable: number;
};

export type StakingSummary = {
  total_amount: number;
  stakes: Stake[];
};