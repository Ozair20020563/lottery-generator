export interface LotteryConfig {
  mainMin: number;
  mainMax: number;
  mainCount: number;
  bonusMin?: number;
  bonusMax?: number;
  bonusCount: number;
}

export class LotteryEngine {
  private config: LotteryConfig;

  constructor(config: LotteryConfig) {
    this.config = config;
  }

  generateNumbers(
    strategy: string,
    options: {
      include?: number[];
      exclude?: number[];
      lines?: number;
    } = {}
  ) {
    const lines = options.lines || 1;
    const include = [...new Set(options.include || [])];
    const exclude = [...new Set(options.exclude || [])];
    const results = [];

    for (let i = 0; i < lines; i++) {
      let mainNumbers = this.randomSelection(include, exclude);
      
      let bonusNumbers: number[] = [];
      if (this.config.bonusCount > 0 && this.config.bonusMax) {
        bonusNumbers = this.generateBonusNumbers();
      }

      results.push({
        main: mainNumbers.sort((a, b) => a - b),
        bonus: bonusNumbers,
        uniqueness: this.calculateUniquenessScore(mainNumbers)
      });
    }

    return results;
  }

  private randomSelection(include: number[], exclude: number[]): number[] {
    const pool = [];
    const excludeSet = new Set(exclude);
    for (let i = this.config.mainMin; i <= this.config.mainMax; i++) {
      if (!excludeSet.has(i)) pool.push(i);
    }
    
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const needed = this.config.mainCount - include.length;
    return [...include, ...shuffled.slice(0, needed)];
  }

  private generateBonusNumbers(): number[] {
    const bonus: number[] = [];
    for (let i = this.config.bonusMin!; i <= this.config.bonusMax!; i++) {
      bonus.push(i);
    }
    for (let i = bonus.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bonus[i], bonus[j]] = [bonus[j], bonus[i]];
    }
    return bonus.slice(0, this.config.bonusCount).sort((a, b) => a - b);
  }

  private calculateUniquenessScore(numbers: number[]) {
    let score = 100;
    const warnings: string[] = [];

    const birthdayCount = numbers.filter(n => n <= 31).length;
    if (birthdayCount > 3) {
      score -= 25;
      warnings.push(`${birthdayCount} numbers in birthday range (1-31)`);
    }

    let consecutiveCount = 0;
    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i + 1] === numbers[i] + 1) consecutiveCount++;
    }
    if (consecutiveCount >= 2) {
      score -= 30;
      warnings.push(`${consecutiveCount + 1} consecutive numbers detected`);
    }

    const oddCount = numbers.filter(n => n % 2 === 1).length;
    if (oddCount === 0 || oddCount === numbers.length) {
      score -= 20;
      warnings.push("All numbers are same parity");
    }

    return { score: Math.max(0, score), warnings };
  }
}