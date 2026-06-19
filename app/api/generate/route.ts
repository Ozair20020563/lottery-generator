import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, includeNumbers, excludeNumbers, lines } = body;

    const gameConfigs: Record<string, { mainMax: number; mainCount: number; bonusMax?: number; bonusCount: number; isPick?: boolean }> = {
      '1': { mainMax: 69, mainCount: 5, bonusMax: 26, bonusCount: 1 },
      '2': { mainMax: 70, mainCount: 5, bonusMax: 25, bonusCount: 1 },
      '3': { mainMax: 49, mainCount: 6, bonusCount: 0 },
      '4': { mainMax: 47, mainCount: 7, bonusCount: 0 },
      '5': { mainMax: 50, mainCount: 7, bonusCount: 0 },
      '6': { mainMax: 9, mainCount: 2, bonusCount: 0, isPick: true },
      '7': { mainMax: 9, mainCount: 3, bonusCount: 0, isPick: true },
      '8': { mainMax: 9, mainCount: 4, bonusCount: 0, isPick: true },
      '9': { mainMax: 49, mainCount: 5, bonusMax: 10, bonusCount: 1 },
      '10': { mainMax: 50, mainCount: 5, bonusMax: 12, bonusCount: 2 },
      '11': { mainMax: 49, mainCount: 6, bonusCount: 0 },
    };

    const config = gameConfigs[gameId];
    if (!config) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const results = [];
    const linesCount = lines || 5;
    const include = includeNumbers || [];
    const exclude = excludeNumbers || [];

    for (let line = 0; line < linesCount; line++) {
      // Generate main numbers
      let available: number[] = [];
      for (let i = (config.isPick ? 0 : 1); i <= config.mainMax; i++) {
        if (!exclude.includes(i)) available.push(i);
      }
      
      // Shuffle
      for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
      }
      
      let main = [...include];
      const needed = config.mainCount - main.length;
      main = [...main, ...available.slice(0, needed)];
      main.sort((a, b) => a - b);
      
      // Generate bonus numbers
      let bonus: number[] = [];
      if (config.bonusCount > 0 && config.bonusMax) {
        const bonusPool: number[] = [];
        for (let i = 1; i <= config.bonusMax; i++) {
          bonusPool.push(i);
        }
        for (let i = bonusPool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [bonusPool[i], bonusPool[j]] = [bonusPool[j], bonusPool[i]];
        }
        bonus = bonusPool.slice(0, config.bonusCount).sort((a, b) => a - b);
      }
      
      // Calculate uniqueness score (only for non-Pick games)
      let score = 100;
      const warnings: string[] = [];
      
      if (!config.isPick) {
        const birthdayCount = main.filter(n => n <= 31).length;
        if (birthdayCount > 3) {
          score -= 25;
          warnings.push(`${birthdayCount} numbers in birthday range (1-31)`);
        }
        
        let consecutiveCount = 0;
        for (let i = 0; i < main.length - 1; i++) {
          if (main[i + 1] === main[i] + 1) consecutiveCount++;
        }
        if (consecutiveCount >= 2) {
          score -= 30;
          warnings.push(`${consecutiveCount + 1} consecutive numbers detected`);
        }
        
        const oddCount = main.filter(n => n % 2 === 1).length;
        if (oddCount === 0 || oddCount === main.length) {
          score -= 20;
          warnings.push("All numbers are same parity");
        }
      }
      
      results.push({
        main,
        bonus,
        uniqueness: { score: Math.max(0, score), warnings }
      });
    }
    
    return NextResponse.json({ success: true, numbers: results });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate numbers' }, { status: 500 });
  }
}